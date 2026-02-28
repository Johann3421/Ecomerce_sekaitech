#!/bin/sh
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  LumiStore — Production Startup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "▶ Running database migrations..."
node node_modules/prisma/build/index.js migrate deploy \
  --schema=./prisma/schema.prisma

echo "✓ Migrations complete"
echo "▶ Starting Next.js server on port ${PORT:-3000}..."

exec node server.js
