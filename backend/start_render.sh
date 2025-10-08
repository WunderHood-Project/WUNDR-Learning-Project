#!/usr/bin/env bash
set -e

# 1) Ensure the engine is downloaded (fresh instance may have empty cache)
python -m prisma py fetch || true

# 2) Look for the query engine in both possible locations
BIN="$(find /opt/render/project/src/backend/.prisma/binaries /opt/render/.cache/prisma-python/binaries -type f -name '*query-engine-debian-openssl-3.0.x' 2>/dev/null | head -n1)"

if [ -z "$BIN" ]; then
  echo "Prisma engine not found after fetch"
  ls -R /opt/render/project/src/backend/.prisma || true
  ls -R /opt/render/.cache/prisma-python || true
  exit 1
fi

chmod +x "$BIN" || true
export PRISMA_QUERY_ENGINE_BINARY="$BIN"

# 3) Boot FastAPI
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"
