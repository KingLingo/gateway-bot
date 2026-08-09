#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
RELEASE_WORKFLOW="$ROOT_DIR/.github/workflows/gateway-bot-release.yml"
SYNC_WORKFLOW="$ROOT_DIR/.github/workflows/gateway-bot-upstream-sync.yml"
DOCKERFILE="$ROOT_DIR/deploy/Dockerfile"
DEPLOY_DOC="$ROOT_DIR/docs/deployment/gateway-bot-release.md"

fail() {
  printf 'release contract failed: %s\n' "$1" >&2
  exit 1
}

require_file() {
  [[ -f "$1" ]] || fail "missing ${1#$ROOT_DIR/}"
}

require_text() {
  local file=$1
  local text=$2
  grep -Fq -- "$text" "$file" || fail "${file#$ROOT_DIR/} must contain: $text"
}

require_file "$RELEASE_WORKFLOW"
require_file "$SYNC_WORKFLOW"
require_file "$DEPLOY_DOC"

for text in \
  "gateway-bot-v*-r*" \
  "pnpm@10.28.0" \
  "lint:check" \
  "typecheck" \
  "test:run" \
  "pnpm run build" \
  "go test ./..." \
  "GOOS=linux GOARCH=amd64" \
  "sha256sum" \
  "gateway-bot_linux_amd64"; do
  require_text "$RELEASE_WORKFLOW" "$text"
done

for text in \
  "cron:" \
  "Wei-Shaw/sub2api" \
  "git merge" \
  "gh pr create"; do
  require_text "$SYNC_WORKFLOW" "$text"
done

for text in \
  'LABEL description="Gateway Bot - AI API Subscription Gateway"' \
  'LABEL org.opencontainers.image.source="https://github.com/KingLingo/gateway-bot"'; do
  require_text "$DOCKERFILE" "$text"
done

for text in \
  "gateway-bot-v<upstream>-r<revision>" \
  "checksums.txt" \
  "health" \
  "rollback" \
  "KingLingo/gateway-bot"; do
  require_text "$DEPLOY_DOC" "$text"
done

printf 'Gateway Bot release contract verified.\n'
