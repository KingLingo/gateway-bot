#!/usr/bin/env bash
# zgo 首次切换到 Gateway Bot（sub2api 自有 fork）的一次性上线脚本。
#
# 做四件事，任何一步失败都不留半成品：
#   1. 备份 pg_dump + 当前二进制
#   2. 下载指定版本，校验 tarball 与包内二进制两个 sha256
#   3. 换二进制 → 重启 → /health 探活 + 版本断言；失败自动回退并验证回退成功
#   4. 用 gateway-bot-update.sh 替换掉老的 sub2api-update.sh（老的对 Gateway Bot
#      二进制会在 current_version() 静默 die，从此不再更新）
#
# 用法（在 zgo 上以 root 执行，本脚本与 gateway-bot-update.sh 需在同一目录）：
#   ./deploy-gateway-bot.sh                 上线默认版本
#   ./deploy-gateway-bot.sh 0.1.173-r4      上线指定版本
#   ./deploy-gateway-bot.sh --dry-run       只检查环境与产物，不改任何东西
#   ./deploy-gateway-bot.sh --rollback      从最近一次 pre-* 备份回到上游二进制
#
# 前提：fork 相对上游基线零 migration，schema 不会因为这次切换而前移，
#       所以二进制层面可以自由来回换（这是敢这么干的根据）。
set -euo pipefail

REPO="KingLingo/gateway-bot"
TAG_PREFIX="gateway-bot-v"
ASSET="gateway-bot_linux_amd64"
DEFAULT_VERSION="0.1.173-r4"
BRAND="Gateway Bot"

APP_DIR="/opt/sub2api"
BIN="$APP_DIR/sub2api"
SERVICE="sub2api"
BACKUP_DIR="$APP_DIR/backups"
HEALTH_URL="http://127.0.0.1:8080/health"
UPDATER_SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/gateway-bot-update.sh"

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

say() { echo "[$(date '+%F %T')] $*"; }
die() {
  echo "[$(date '+%F %T')] ERROR: $*" >&2
  exit 1
}

version_of() {
  local out
  out="$("$BIN" --version 2>&1 || true)"
  if [[ "$out" == *"$BRAND"* ]]; then
    sed -nE "s/.*${BRAND} ([0-9]+\.[0-9]+\.[0-9]+(-r[0-9]+)?).*/\1/p" <<<"$out" | head -1
  elif [[ "$out" == *"Sub2API"* ]]; then
    sed -nE 's/.*Sub2API ([0-9]+\.[0-9]+\.[0-9]+).*/upstream-\1/p' <<<"$out" | head -1
  else
    echo ""
  fi
}

probe_healthy() {
  local timeout="${1:-90}" waited=0 code
  while ((waited < timeout)); do
    if systemctl is-active --quiet "$SERVICE"; then
      code="$(curl -s -o /dev/null -m 5 -w '%{http_code}' "$HEALTH_URL" || echo 000)"
      [[ "$code" == "200" ]] && return 0
    fi
    sleep 3
    waited=$((waited + 3))
  done
  say "探活超时（最后 http_code=${code:-NA}）"
  return 1
}

MODE="deploy"
VERSION="$DEFAULT_VERSION"
for arg in "$@"; do
  case "$arg" in
  --dry-run) MODE="dry-run" ;;
  --rollback) MODE="rollback" ;;
  -*) die "未知参数: $arg" ;;
  *) VERSION="$arg" ;;
  esac
done

[[ $EUID -eq 0 ]] || die "需要 root"
[[ -x "$BIN" ]] || die "找不到 $BIN"

# --- rollback ------------------------------------------------------------------
if [[ "$MODE" == "rollback" ]]; then
  # shellcheck disable=SC2012
  BK="$(ls -dt "$BACKUP_DIR"/pre-* 2>/dev/null | head -1)"
  [[ -n "$BK" && -f "$BK/sub2api" ]] || die "找不到可用备份"
  say "从 $BK 回退（备份记录的版本：$(cat "$BK/version" 2>/dev/null || echo 未知)）"
  install -m0755 -o root -g root "$BK/sub2api" "$BIN"
  systemctl restart "$SERVICE"
  probe_healthy 90 || die "回退后不健康，需人工介入（备份仍在 $BK）"
  say "回退完成，当前版本：$(version_of)"
  exit 0
fi

# --- 环境检查 -------------------------------------------------------------------
CURRENT="$(version_of)"
[[ -n "$CURRENT" ]] || die "读不出当前版本，$BIN --version 输出异常"
say "当前运行：$CURRENT"
say "目标版本：$VERSION（${TAG_PREFIX}${VERSION}）"

if [[ "$CURRENT" == "$VERSION" ]]; then
  say "已经是目标版本，无需部署"
  exit 0
fi

systemctl is-active --quiet postgresql || die "postgresql 未运行，拒绝部署"
AVAIL_MB="$(df -Pm "$APP_DIR" | awk 'NR==2{print $4}')"
((AVAIL_MB >= 1024)) || die "磁盘剩余 ${AVAIL_MB}MB 不足 1G"
say "磁盘余量 ${AVAIL_MB}MB，postgresql 运行中"
[[ -f "$UPDATER_SRC" ]] || die "同目录下缺少 gateway-bot-update.sh"

# --- 下载并双重校验 --------------------------------------------------------------
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
TARBALL="${ASSET}.tar.gz"
BASE="https://github.com/${REPO}/releases/download/${TAG_PREFIX}${VERSION}"

say "下载 $TARBALL ..."
curl -fsSL -m 300 -o "$TMP/$TARBALL" "$BASE/$TARBALL" || die "下载 tarball 失败"
curl -fsSL -m 60 -o "$TMP/checksums.txt" "$BASE/checksums.txt" || die "下载 checksums 失败"

check_sha() {
  local file="$1" name="$2" want got
  want="$(grep " ${name}\$" "$TMP/checksums.txt" | awk '{print $1}')"
  got="$(sha256sum "$file" | awk '{print $1}')"
  [[ -n "$want" && "$want" == "$got" ]] || die "sha256 不匹配 $name (want=${want:-空} got=$got)"
  say "sha256 通过：$name"
}
check_sha "$TMP/$TARBALL" "$TARBALL"

tar -xzf "$TMP/$TARBALL" -C "$TMP" || die "解包失败"
NEWBIN="$TMP/$ASSET"
[[ -x "$NEWBIN" ]] || die "包里找不到 $ASSET"
check_sha "$NEWBIN" "$ASSET" # 老脚本只校验 tarball，这里连包内二进制一起校验

# file(1) 在精简系统上不一定有；没有就退化成读 ELF magic，不能让缺个工具把脚本打死
if command -v file >/dev/null 2>&1; then
  file "$NEWBIN" | grep -q "ELF 64-bit.*x86-64" || die "产物不是 linux/amd64 ELF"
else
  [[ "$(head -c 4 "$NEWBIN" | od -An -tx1 | tr -d ' ')" == "7f454c46" ]] || die "产物不是 ELF"
fi
say "产物形态校验通过"

if [[ "$MODE" == "dry-run" ]]; then
  say "[dry-run] 环境与产物均正常，未做任何改动"
  exit 0
fi

# --- 备份 -----------------------------------------------------------------------
BK="$BACKUP_DIR/pre-${VERSION}"
rm -rf "$BK"
mkdir -p "$BK"
say "备份到 $BK ..."
if ! sudo -u postgres pg_dump -d sub2api -Fc 2>/dev/null | gzip >"$BK/postgres.dump.gz"; then
  rm -rf "$BK"
  die "pg_dump 失败，已中止（未改动任何东西）"
fi
cp -a "$BIN" "$BK/sub2api"
echo "$CURRENT" >"$BK/version"
say "备份完成：db $(du -h "$BK/postgres.dump.gz" | cut -f1) / bin $(du -h "$BK/sub2api" | cut -f1)"

# --- 停掉老 timer，避免部署过程中被插一脚 -------------------------------------------
OLD_TIMER_WAS_ACTIVE=0
if systemctl is-active --quiet sub2api-update.timer 2>/dev/null; then
  OLD_TIMER_WAS_ACTIVE=1
  systemctl stop sub2api-update.timer
  say "已暂停 sub2api-update.timer"
fi

# 注意：下面恢复 timer 一律用 if 块。写成 `((VAR)) && systemctl start ...` 在
# set -e 下会因为 ((0)) 返回 1 让整条 && 链失败，把脚本在成功路径上打死。
resume_timer() {
  if ((OLD_TIMER_WAS_ACTIVE)); then
    systemctl start sub2api-update.timer
    say "已恢复 sub2api-update.timer"
  fi
}

# --- 换二进制 --------------------------------------------------------------------
say "安装并重启 ..."
install -m0755 -o root -g root "$NEWBIN" "$BIN"
systemctl restart "$SERVICE"

REAL=""
if probe_healthy 90; then
  REAL="$(version_of)"
fi

if [[ "$REAL" != "$VERSION" ]]; then
  say "失败：探活或版本断言不通过（实际=${REAL:-读不出}），回退 ..."
  install -m0755 -o root -g root "$BK/sub2api" "$BIN"
  systemctl restart "$SERVICE"
  if probe_healthy 90; then
    say "已回退到 $(version_of)，服务恢复。备份保留在 $BK"
  else
    say "🔴 回退后仍不健康，需人工介入。备份在 $BK"
  fi
  resume_timer
  exit 1
fi

say "✅ 上线成功：$CURRENT → $REAL，/health 200，版本断言通过"

# --- 换更新器 --------------------------------------------------------------------
# 不知道 unit 里 ExecStart 指向哪，直接从 systemd 里问出来，就地替换，保留原文件名，
# 这样 unit/timer 一行都不用改。
EXEC_PATH="$(systemctl cat sub2api-update.service 2>/dev/null |
  sed -n 's/^ExecStart=//p' | awk '{print $1}' | head -1)"
if [[ -n "$EXEC_PATH" && -f "$EXEC_PATH" ]]; then
  cp -a "$EXEC_PATH" "${EXEC_PATH}.bak-preforkswitch"
  install -m0755 -o root -g root "$UPDATER_SRC" "$EXEC_PATH"
  say "更新器已替换：$EXEC_PATH（原文件备份为 ${EXEC_PATH}.bak-preforkswitch）"
  say "自检：$("$EXEC_PATH" --dry-run 2>&1 | tail -1)"
else
  say "⚠️ 没找到 sub2api-update.service 的 ExecStart，更新器未替换。"
  say "   请手动把 gateway-bot-update.sh 装到更新器路径，否则今后不再自动更新。"
fi

resume_timer

echo
say "===== 收尾状态 ====="
"$BIN" --version 2>&1 | head -1
echo "health : $(curl -s -o /dev/null -m 5 -w '%{http_code}' "$HEALTH_URL")"
systemctl is-active "$SERVICE" | sed 's/^/service: /'
systemctl list-timers sub2api-update.timer --no-pager 2>/dev/null | head -2
