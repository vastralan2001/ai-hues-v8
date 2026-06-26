#!/bin/sh
# Launch the embedding sidecar (localhost) then the Go API in the same
# container, so the sidecar co-deploys with aihues-api via the existing CI/CD.
set -e

uvicorn main:app --app-dir /opt/embed --host 127.0.0.1 --port 8000 &

exec ./aihues-api api
