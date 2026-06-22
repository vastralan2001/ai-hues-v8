#!/bin/bash
# AIHues 本地开发停止脚本
# 用法: ./scripts/stop.sh

echo "=== Stopping AIHues services ==="

if [ -f /tmp/aihues-web.pid ]; then
  echo "Stopping frontend..."
  kill $(cat /tmp/aihues-web.pid) 2>/dev/null || true
  rm -f /tmp/aihues-web.pid
fi

if [ -f /tmp/aihues-api.pid ]; then
  echo "Stopping backend..."
  kill $(cat /tmp/aihues-api.pid) 2>/dev/null || true
  rm -f /tmp/aihues-api.pid
fi

if pg_isready -h localhost -p 5432 >/dev/null 2>&1; then
  echo "Stopping PostgreSQL..."
  pg_ctl -D /Users/moonshot/pgdata stop
fi

echo "All services stopped."
