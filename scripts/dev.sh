#!/bin/bash
# AIHues 本地开发一键启动脚本
# 用法: ./scripts/dev.sh

set -e

PG_BIN="/Users/moonshot/.local/pg16/pgsql/bin"
GO_BIN="/Users/moonshot/go-sdk/bin"
API_DIR="apps/aihues-api"
WEB_DIR="apps/aihues-web"

export PATH="$PG_BIN:$GO_BIN:$PATH"

echo "=== AIHues Local Dev ==="

# 1. 启动 PostgreSQL（如果未运行）
if ! pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
  echo "[1/4] Starting PostgreSQL..."
  pg_ctl -D /Users/moonshot/pgdata -l /Users/moonshot/pgdata/logfile start
  sleep 2
else
  echo "[1/4] PostgreSQL already running"
fi

# 2. 启动后端 API
echo "[2/4] Starting aihues-api..."
cd "$API_DIR"
if [ -f /tmp/aihues-api.pid ]; then
  kill $(cat /tmp/aihues-api.pid) 2>/dev/null || true
fi
/tmp/aihues-api api -c aihues-api.yaml > /tmp/aihues-api.log 2>&1 &
echo $! > /tmp/aihues-api.pid
cd - >/dev/null
sleep 2

# 3. 启动前端
echo "[3/4] Starting aihues-web..."
cd "$WEB_DIR"
if [ -f /tmp/aihues-web.pid ]; then
  kill $(cat /tmp/aihues-web.pid) 2>/dev/null || true
fi
pnpm dev > /tmp/aihues-web.log 2>&1 &
echo $! > /tmp/aihues-web.pid
cd - >/dev/null
sleep 3

echo ""
echo "[4/4] All services started!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:9005"
echo "  Database: localhost:5432 (aihues/aihues_dev)"
echo ""
echo "Logs:"
echo "  API:  tail -f /tmp/aihues-api.log"
echo "  Web:  tail -f /tmp/aihues-web.log"
echo "  DB:   tail -f /Users/moonshot/pgdata/logfile"
