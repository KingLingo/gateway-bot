#!/usr/bin/env bash
# zgo 上 Gateway Bot（sub2api 的自有 fork）的无人值守更新看门狗
#
#   备份(pg_dump + 二进制) → 下载并校验 sha256 → 换二进制 → 重启
#   → 探活 + **版本断言** → 失败自动回退二进制
#   → 回退后仍不健康则恢复数据库（仅当 ALLOW_DB_RESTORE=1）
#
# 用法:
#   gateway-bot-update.sh                 升到 fork 的 GitHub latest
#   gateway-bot-update.sh 0.1.173-r4      升/降到指定版本（不含 gateway-bot-v 前缀）
#   gateway-bot-update.sh --dry-run       只报告，不动手
#   gateway-bot-update.sh --status        打印当前状态（金丝雀查询用）
#
# 这个脚本取代原 sub2api-update.sh。四处与上游不兼容的地方都在这里对齐了：
#   仓库   Wei-Shaw/sub2api            → KingLingo/gateway-bot
#   tag    v0.1.173                    → gateway-bot-v0.1.173-r4
#   包名   sub2api_0.1.173_linux_amd64.tar.gz → gateway-bot_linux_amd64.tar.gz（不带版本）
#   包内   sub2api                     → gateway-bot_linux_amd64
#
# ⚠️ 直接拿老脚本跑 Gateway Bot 二进制会在 current_version() 处 die（grep 不到
#    'Sub2API'，pipefail 让管道返回非零），不会覆盖二进制但从此不再更新，且 die
#    不走 notify —— 静默停摆。所以必须换成本脚本。
#
# ⚠️ 为什么这台机器可以无人值守，而主网关不行：见 README「自动更新看门狗」一节。
set -euo pipefail

REPO="KingLingo/gateway-bot"
TAG_PREFIX="gateway-bot-v"
ASSET="gateway-bot_linux_amd64"          # 包内可执行文件名，也是 tarball 前缀
BRAND="Gateway Bot"                      # --version 输出里的品牌串

APP_DIR="/opt/sub2api"                   # 路径与 service 名保持不变，减少改动面
BIN="$APP_DIR/sub2api"
SERVICE="sub2api"
BACKUP_DIR="$APP_DIR/backups"
STATE_DIR="/var/lib/sub2api-update"
LOG_FILE="$STATE_DIR/update.log"
STATE_FILE="$STATE_DIR/state.json"
LOCK_FILE="$STATE_DIR/.lock"
NOTIFY_ENV="/etc/sub2api/update-notify.env"
HEALTH_URL="http://127.0.0.1:8080/health"
BACKUP_KEEP="${BACKUP_KEEP:-3}"
# zgo 是空实例（无账号/无用量/无计费），恢复数据库不丢任何有价值的写入，
# 所以这里敢开。主网关上这一项必须是 0。
ALLOW_DB_RESTORE="${ALLOW_DB_RESTORE:-1}"

export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
mkdir -p "$STATE_DIR" "$BACKUP_DIR"

log() {
  local msg="[$(date '+%F %T %Z')] $*"
  echo "$msg"
  echo "$msg" >>"$LOG_FILE"
}

notify() {
  local title="$1" body="$2"
  log "NOTIFY: $title — ${body//$'\n'/ }"
  # shellcheck disable=SC1090
  [[ -f "$NOTIFY_ENV" ]] && . "$NOTIFY_ENV"
  [[ -z "${NOTIFY_WEBHOOK:-}" ]] && return 0
  python3 - "$NOTIFY_WEBHOOK" "$title" "$body" <<'PY' || log "webhook 推送失败（忽略）"
import json, sys, urllib.request
url, title, body = sys.argv[1], sys.argv[2], sys.argv[3]
data = json.dumps({"msg_type": "text", "content": {"text": f"[zgo] {title}\n{body}"}}).encode()
req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
urllib.request.urlopen(req, timeout=10).read()
PY
}

# 老脚本里 die 是静默的（只写日志），排查时全靠翻 journal。这里让它出声。
die() {
  log "ERROR: $*"
  notify "🔴 Gateway Bot 更新器异常" "$*
主机 zgo，日志 ${LOG_FILE}"
  exit 1
}

# --- 版本 ---------------------------------------------------------------------
# 以"正在跑的二进制自己报的版本"为准，而不是记账文件——记账会和现实漂移。
# 同时认上游品牌：万一被换回官方二进制，这里能读出来并触发一次换回 fork，
# 而不是像老脚本那样直接 die。
current_version() {
  local out
  out="$("$BIN" --version 2>&1 || true)"
  if [[ "$out" == *"$BRAND"* ]]; then
    sed -nE "s/.*${BRAND} ([0-9]+\.[0-9]+\.[0-9]+(-r[0-9]+)?).*/\1/p" <<<"$out" | head -1
    return 0
  fi
  if [[ "$out" == *"Sub2API"* ]]; then
    # 上游二进制：打上前缀，保证与任何 fork 版本号都不相等 → 会被换成 fork
    sed -nE 's/.*Sub2API ([0-9]+\.[0-9]+\.[0-9]+).*/upstream-\1/p' <<<"$out" | head -1
    return 0
  fi
  return 1
}

latest_version() {
  python3 - "$REPO" "$TAG_PREFIX" <<'PY'
import json, sys, urllib.request
repo, prefix = sys.argv[1], sys.argv[2]
url = f"https://api.github.com/repos/{repo}/releases/latest"
req = urllib.request.Request(url, headers={"Accept": "application/vnd.github+json"})
with urllib.request.urlopen(req, timeout=25) as r:
    tag = json.load(r)["tag_name"]
if not tag.startswith(prefix):
    sys.exit(f"latest tag {tag!r} 不带前缀 {prefix!r}，拒绝解析")
print(tag[len(prefix):])
PY
}

write_state() {
  python3 - "$STATE_FILE" "$1" "$2" "$3" <<'PY'
import json, sys, time
path, version, result, note = sys.argv[1:5]
json.dump({"version": version, "result": result, "note": note,
           "at": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "epoch": int(time.time())},
          open(path, "w"), ensure_ascii=False, indent=2)
PY
}

# --- 探活 ---------------------------------------------------------------------
# systemd active 不等于能服务：必须 /health 真的 200
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
  log "探活超时（最后 http_code=${code:-NA}，systemd=$(systemctl is-active "$SERVICE")）"
  return 1
}

# 关键新增：健康不等于装对了。二进制被换回上游、或装了错版本，/health 一样 200。
# 老脚本只看 /health，这类"回退成上游"的事故会被记成 result=ok，永远发现不了。
assert_version() {
  local want="$1" real
  real="$(current_version || echo '')"
  if [[ "$real" != "$want" ]]; then
    log "版本断言失败：期望 $want，实际 ${real:-读不出来}"
    return 1
  fi
  return 0
}

# --- 参数 ---------------------------------------------------------------------
DRY_RUN=0
TARGET=""
for arg in "$@"; do
  case "$arg" in
  --dry-run) DRY_RUN=1 ;;
  --status)
    echo "brand   : $("$BIN" --version 2>&1 | head -1)"
    echo "running : $(current_version || echo '解析失败')"
    echo "latest  : $(latest_version 2>/dev/null || echo '取不到')"
    echo "health  : $(curl -s -o /dev/null -m 5 -w '%{http_code}' "$HEALTH_URL" || echo 000)"
    [[ -f "$STATE_FILE" ]] && cat "$STATE_FILE"
    exit 0
    ;;
  -*) die "未知参数: $arg" ;;
  *) TARGET="$arg" ;;
  esac
done

CURRENT="$(current_version)" || die "无法读取当前版本（$BIN --version 输出既不含 '$BRAND' 也不含 'Sub2API'）"
[[ -n "$CURRENT" ]] || die "解析 --version 输出失败"

if [[ -z "$TARGET" ]]; then
  TARGET="$(latest_version)" || die "取 GitHub latest 失败（网络？）"
fi

if [[ "$CURRENT" == "$TARGET" ]]; then
  log "已是 $CURRENT，无需更新"
  exit 0
fi

log "发现新版本：$CURRENT → $TARGET"
if ((DRY_RUN)); then
  log "[dry-run] 将执行：pg_dump + 备份二进制 → 下载校验 → 换二进制 → 重启 → 探活 → 版本断言"
  exit 0
fi

exec 9>"$LOCK_FILE"
flock -n 9 || die "另一个更新进程正在运行"

# --- 前置检查 -----------------------------------------------------------------
systemctl is-active --quiet postgresql || die "postgresql 未运行，拒绝升级"
AVAIL_MB="$(df -Pm "$APP_DIR" | awk 'NR==2{print $4}')"
((AVAIL_MB >= 1024)) || die "磁盘剩余 ${AVAIL_MB}MB 不足 1G，拒绝备份"

# --- 1. 备份（失败即中止，不动任何东西）-----------------------------------------
BK="$BACKUP_DIR/pre-${TARGET}"
rm -rf "$BK"
mkdir -p "$BK"
log "备份数据库与二进制到 $BK ..."
if ! sudo -u postgres pg_dump -d sub2api -Fc 2>>"$LOG_FILE" | gzip >"$BK/postgres.dump.gz"; then
  rm -rf "$BK"
  die "pg_dump 失败，已中止（未改动任何东西）"
fi
cp -a "$BIN" "$BK/sub2api"
echo "$CURRENT" >"$BK/version"
log "备份完成：db $(du -h "$BK/postgres.dump.gz" | cut -f1) / bin $(du -h "$BK/sub2api" | cut -f1)"

# --- 2. 下载并校验 sha256（校验失败即中止）--------------------------------------
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
TARBALL="${ASSET}.tar.gz"
BASE="https://github.com/${REPO}/releases/download/${TAG_PREFIX}${TARGET}"

log "下载 $TARBALL （${TAG_PREFIX}${TARGET}）..."
curl -fsSL -m 300 -o "$TMP/$TARBALL" "$BASE/$TARBALL" || {
  notify "Gateway Bot 更新失败" "下载 ${TARGET} 失败，仍运行 ${CURRENT}"
  die "下载失败"
}
curl -fsSL -m 60 -o "$TMP/checksums.txt" "$BASE/checksums.txt" || {
  notify "Gateway Bot 更新失败" "下载 checksums.txt 失败，仍运行 ${CURRENT}"
  die "下载 checksums 失败"
}

WANT="$(grep " $TARBALL\$" "$TMP/checksums.txt" | awk '{print $1}')"
GOT="$(sha256sum "$TMP/$TARBALL" | awk '{print $1}')"
[[ -n "$WANT" && "$WANT" == "$GOT" ]] || {
  notify "Gateway Bot 更新失败" "sha256 校验不通过，拒绝安装 ${TARGET}"
  die "sha256 不匹配 (want=${WANT:-空} got=$GOT)"
}
log "sha256 校验通过"

tar -xzf "$TMP/$TARBALL" -C "$TMP" || die "解包失败"
NEWBIN="$(find "$TMP" -maxdepth 2 -type f -name "$ASSET" -perm -u+x | head -1)"
[[ -n "$NEWBIN" ]] || die "包里找不到 $ASSET 可执行文件"

# --- 3. 换二进制并重启 ----------------------------------------------------------
log "安装并重启 ..."
install -m0755 -o root -g root "$NEWBIN" "$BIN"
systemctl restart "$SERVICE"

# --- 4. 探活 + 版本断言 ----------------------------------------------------------
if probe_healthy 90 && assert_version "$TARGET"; then
  log "更新成功：${CURRENT} → ${TARGET}"
  write_state "$TARGET" ok "从 ${CURRENT} 升级"
  notify "Gateway Bot 已自动更新" "${CURRENT} → ${TARGET}，/health 200 且版本断言通过。"
  # shellcheck disable=SC2012
  ls -dt "$BACKUP_DIR"/pre-* 2>/dev/null | tail -n +$((BACKUP_KEEP + 1)) | while read -r old; do
    log "清理旧备份 $(basename "$old")"
    rm -rf "$old"
  done
  exit 0
fi

# --- 5. 回退二进制 --------------------------------------------------------------
log "探活或版本断言失败，回退二进制到 $CURRENT"
tail -40 "$APP_DIR/data/logs/sub2api.log" >>"$LOG_FILE" 2>&1 || true
install -m0755 -o root -g root "$BK/sub2api" "$BIN"
systemctl restart "$SERVICE"

if probe_healthy 90; then
  log "已回退到 $CURRENT 并恢复健康"
  write_state "$CURRENT" rolled_back "${TARGET} 探活/版本断言失败，已回退二进制"
  notify "Gateway Bot 升级失败已回退" "${TARGET} 失败 → 回到 ${CURRENT}，服务已恢复。
fork 相对上游零 migration，二进制来回换不会动 schema。"
  exit 1
fi

# --- 6. 回退后仍挂：恢复数据库（只有空实例才敢这么干）------------------------------
if [[ "$ALLOW_DB_RESTORE" == "1" ]]; then
  log "回退后仍不健康，恢复数据库（ALLOW_DB_RESTORE=1）"
  systemctl stop "$SERVICE"
  if gunzip -c "$BK/postgres.dump.gz" |
    sudo -u postgres pg_restore -d sub2api --clean --if-exists >>"$LOG_FILE" 2>&1; then
    log "pg_restore 完成"
  else
    log "pg_restore 报错（--clean 常有噪音，继续探活判断）"
  fi
  systemctl start "$SERVICE"
  if probe_healthy 90; then
    log "恢复数据库后已健康，停在 $CURRENT"
    write_state "$CURRENT" restored "升级 ${TARGET} 失败，二进制+数据库均已恢复"
    notify "Gateway Bot 升级失败已完整回滚" "${TARGET} 失败 → 二进制与数据库均回到 ${CURRENT}，服务已恢复。"
    exit 1
  fi
fi

write_state "$CURRENT" broken "升级 ${TARGET} 失败且回滚后仍不健康"
notify "🔴 Gateway Bot 故障需人工介入" "升级 ${TARGET} 失败，回退 ${CURRENT} 后仍不健康。
备份在 ${BK}，日志 ${LOG_FILE}"
die "回滚后仍不健康，需要人工介入"
