#!/usr/bin/env bash
# 在项目目录启动终端版 Kimi Code（不依赖 Cursor 扩展）
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

export PATH="${HOME}/.kimi-code/bin:${PATH}"

if ! command -v kimi >/dev/null 2>&1; then
  echo "未找到 kimi CLI。安装："
  echo "  curl -fsSL https://code.kimi.com/kimi-code/install.sh | bash"
  exit 1
fi

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  cat <<'EOF'
用法:
  ./scripts/kimi.sh          启动交互式 Kimi（项目目录）
  ./scripts/kimi.sh -C         续本项目上一次终端会话
  ./scripts/kimi.sh -S [id]    恢复指定会话
  ./scripts/kimi.sh login        登录
  ./scripts/kimi.sh doctor       检查配置

交接说明见 scripts/KIMI-TERMINAL.md
EOF
  exit 0
fi

exec kimi "$@"
