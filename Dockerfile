# ─────────────────────────────────────────────────────────
#  Stage 1: Install all dependencies
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# Install all deps (includes devDeps needed for build + postinstall that runs prisma generate)
RUN npm ci

# ─────────────────────────────────────────────────────────
#  Stage 2: Build Next.js application
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Prevent Next.js from trying to reach external services at build time
ENV SKIP_ENV_VALIDATION=1
# Dummy DB URL so Prisma client can initialise during build
ENV DATABASE_URL=postgresql://build:build@localhost:5432/build

RUN npm run build

# ─────────────────────────────────────────────────────────
#  Stage 3: Production runner (minimal image)
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# ── Next.js standalone output ──────────────────────────
COPY --from=builder /app/public                    ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

# ── Prisma runtime (client engine + adapter) ──────────
COPY --from=deps /app/node_modules/.prisma             ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma             ./node_modules/@prisma
COPY --from=deps /app/node_modules/pg                  ./node_modules/pg
COPY --from=deps /app/node_modules/pg-pool             ./node_modules/pg-pool
COPY --from=deps /app/node_modules/pg-types            ./node_modules/pg-types
COPY --from=deps /app/node_modules/pgpass              ./node_modules/pgpass
COPY --from=deps /app/node_modules/pg-connection-string ./node_modules/pg-connection-string

# ── Prisma CLI (for migrate deploy at start) ───────────
COPY --from=deps /app/node_modules/prisma              ./node_modules/prisma
COPY --from=deps /app/node_modules/@prisma/engines      ./node_modules/@prisma/engines

# ── Schema + config (needed by CLI) ───────────────────
COPY --from=builder /app/prisma        ./prisma
COPY --from=builder /app/prisma.config.ts ./

# ── Entrypoint ─────────────────────────────────────────
COPY --chown=nextjs:nodejs scripts/start.sh ./start.sh
RUN chmod +x ./start.sh

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/bin/sh", "./start.sh"]
