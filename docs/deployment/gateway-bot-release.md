# Gateway Bot 发布与部署

本文描述 Gateway Bot 独立于上游 Sub2API 的发布通道。zgo 上的自动更新器只能跟随
`KingLingo/gateway-bot`，不得直接下载或跟随上游仓库的 release。

## 发布规则

- 标签格式：`gateway-bot-v<upstream>-r<revision>`，例如 `gateway-bot-v0.1.173-r1`。
- `upstream` 记录本次品牌版本基于的上游版本，`revision` 从 1 开始递增。
- 只有 `.github/workflows/gateway-bot-release.yml` 生成的产物可用于生产部署。
- 每个 release 必须同时包含 `gateway-bot_linux_amd64`、压缩包和 `checksums.txt`。
- 上游更新由同步工作流创建 PR，人工复核品牌与 UI 后才能合并。

## 发布前检查

1. 确认工作区干净，发布提交已经进入准备发布的分支。
2. 运行 `bash scripts/verify-gateway-bot-release.sh`。
3. 完成前端 lint、类型检查、单元测试和生产构建。
4. 在 `backend` 目录运行 `go test ./...`。
5. 创建并推送符合规则的标签，等待 Gateway Bot Release 全部完成。
6. 下载 release 产物，在部署机执行 `sha256sum -c checksums.txt`。

## zgo 部署

**zgo 的真实路径不是 `/opt/gateway-bot`。** 该机沿用 sub2api 时期的布局，切换品牌时
不改路径也不改 unit，以缩小改动面：

| 项 | 实际值 |
| --- | --- |
| 服务目录 | `/opt/sub2api` |
| 二进制 | `/opt/sub2api/sub2api`（内容换成 Gateway Bot，文件名不变） |
| systemd 服务 | `sub2api` |
| 自动更新 | `sub2api-update.service` + `sub2api-update.timer`（每日 04:00±45min） |
| 健康端点 | `http://127.0.0.1:8080/health` |

上线用仓库外的运维脚本完成，不要手敲：

```bash
# 两个脚本需放在同一目录
sudo ./deploy-gateway-bot.sh --dry-run     # 只校验环境与产物
sudo ./deploy-gateway-bot.sh 0.1.173-r4    # 备份 → 安装 → 探活 → 版本断言 → 换更新器
```

脚本会自动把 `sub2api-update.service` 的 `ExecStart` 指向的老更新器就地替换为
`gateway-bot-update.sh`，并保留原文件名，所以 unit 与 timer 一行都不用改。

### 必须换更新器，否则静默停摆

老的 `sub2api-update.sh` 有四处与本 fork 不兼容：仓库 `Wei-Shaw/sub2api`、标签 `v<ver>`、
包名 `sub2api_<ver>_linux_amd64.tar.gz`、包内二进制 `sub2api`。更关键的是它的
`current_version()` 只 grep `Sub2API`，遇到 Gateway Bot 二进制会因 `pipefail`
让整条管道返回非零，脚本在读版本这一步就 `die` 退出——**不会覆盖二进制，但从此不再更新，
而且 `die` 不发通知**。

`gateway-bot-update.sh` 除了对齐上述四项，还补了一条老脚本没有的守卫：安装后除 `/health`
之外**再断言 `--version` 等于目标版本**。只看 health 的话，"二进制被换成别的版本"这类
事故照样 200，会被记成 `result=ok` 永远发现不了。

## health 检查

部署后必须依次检查进程、健康端点、关键页面和日志：

```bash
sudo systemctl is-active --quiet sub2api
/opt/sub2api/sub2api --version | grep -q 'Gateway Bot'   # 品牌与版本断言
curl --fail --silent --show-error http://127.0.0.1:8080/health
curl --fail --silent --show-error https://gateway.bot.cd/home >/dev/null
curl --fail --silent --show-error https://gateway.bot.cd/login >/dev/null
sudo journalctl -u sub2api --since '-10 minutes' --no-pager
```

⚠️ Caddy 在 host 未匹配到站点时会返回**空体 200**，所以外网探测不能只看状态码，
必须校验响应体非空。

登录后还要人工验证 `/dashboard`、`/subscriptions`、`/api-keys`、`/usage`、
`/admin/dashboard`、用户、分组、账户与设置页面，确认静态资源无 404、页面无旧品牌文案。

## rollback 回滚

任何 health、关键页面、数据库连接或日志检查失败，都立即回滚，不继续观察带故障的版本：

```bash
sudo ./deploy-gateway-bot.sh --rollback     # 从最近一次 pre-* 备份回到上游二进制
```

等价的手工步骤：

```bash
set -euo pipefail
sudo install -m 0755 /opt/sub2api/backups/pre-<ver>/sub2api /opt/sub2api/sub2api
sudo systemctl restart sub2api
curl --fail --silent --show-error http://127.0.0.1:8080/health
```

**本 fork 相对上游基线零 migration**，schema 不会因为切换品牌而前移，因此二进制层面
可以自由来回换，不需要恢复数据库。这与上游"迁移单向、回退 tag 不回退 DB"的常规风险
不同，是本次敢直接上生产的根据。若将来某个 revision 引入了自有迁移，本节结论立即失效，
必须重新评估。
