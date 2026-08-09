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

以下示例假设服务目录为 `/opt/gateway-bot`，systemd 服务名为 `gateway-bot`。如生产环境不同，
仅替换目录和服务名，不修改配置文件或数据库。

```bash
set -euo pipefail
cd /opt/gateway-bot
timestamp="$(date +%Y%m%d-%H%M%S)"
sudo mkdir -p backups
sudo cp gateway-bot "backups/gateway-bot-${timestamp}"
sudo cp -a data "backups/data-${timestamp}"
sha256sum -c checksums.txt
sudo install -m 0755 gateway-bot_linux_amd64 gateway-bot
sudo systemctl restart gateway-bot
```

## health 检查

部署后必须依次检查进程、健康端点、关键页面和日志：

```bash
sudo systemctl is-active --quiet gateway-bot
curl --fail --silent --show-error http://127.0.0.1:8080/health
curl --fail --silent --show-error https://gateway.bot.cd/home >/dev/null
curl --fail --silent --show-error https://gateway.bot.cd/login >/dev/null
sudo journalctl -u gateway-bot --since '-10 minutes' --no-pager
```

登录后还要人工验证 `/dashboard`、`/subscriptions`、`/api-keys`、`/usage`、
`/admin/dashboard`、用户、分组、账户与设置页面，确认静态资源无 404、页面无旧品牌文案。

## rollback 回滚

任何 health、关键页面、数据库连接或日志检查失败，都立即回滚，不继续观察带故障的版本：

```bash
set -euo pipefail
cd /opt/gateway-bot
sudo install -m 0755 "backups/gateway-bot-<timestamp>" gateway-bot
sudo systemctl restart gateway-bot
curl --fail --silent --show-error http://127.0.0.1:8080/health
```

应用升级未包含数据库迁移时无需恢复 data。若发布包含迁移，必须先按该版本迁移说明确认兼容性，
再决定是否恢复部署前的数据备份；禁止直接覆盖仍在写入的数据目录。
