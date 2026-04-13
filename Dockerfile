FROM msai-cn-beijing.cr.volces.com/public/node:22 AS base

# Build stage
FROM base AS builder
WORKDIR /app

RUN npm install -g pnpm@10.24.0 --registry="https://registry.npmmirror.com/"

COPY . .

RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile

RUN pnpm build

# Production runtime stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

CMD ["node", "server.js"]
