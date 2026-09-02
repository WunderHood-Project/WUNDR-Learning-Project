#!/usr/bin/env bash
set -euo pipefail

# Prisma Client Python requires the executable query engine, while newer Prisma
# CLI versions download the shared-library engine by default.
export PRISMA_CLI_QUERY_ENGINE_TYPE=binary
export PRISMA_CLIENT_ENGINE_TYPE=binary

# A fresh Render instance might not have the engine cache populated yet.
python -m prisma py fetch

# Select only the executable engine. A wildcard can incorrectly select the
# similarly named libquery_engine shared library.
BIN="$(find \
  /opt/render/project/src/backend \
  /opt/render/project/src/backend/.prisma/binaries \
  /opt/render/.cache/prisma-python/binaries \
  -type f \( \
    -name 'query-engine-debian-openssl-3.0.x' -o \
    -name 'prisma-query-engine-debian-openssl-3.0.x' \
  \) \
  -print -quit 2>/dev/null)"

if [ -z "$BIN" ]; then
  echo "Prisma engine not found after fetch"
  ls -R /opt/render/project/src/backend/.prisma || true
  ls -R /opt/render/.cache/prisma-python || true
  exit 1
fi

chmod +x "$BIN" || true
export PRISMA_QUERY_ENGINE_BINARY="$BIN"

# Boot FastAPI after the required engine is available.
exec uvicorn main:app --host 0.0.0.0 --port "${PORT:-8000}"
