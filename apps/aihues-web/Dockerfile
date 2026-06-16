###########################################################
# base image to install build tools
###########################################################
FROM msai-cn-beijing.cr.volces.com/public/library/node:22.17.1-bookworm AS base
ARG BUILDARCH
ARG X_NPM_MIRROR="https://registry.npmmirror.com"
ENV CI=true
RUN corepack enable && pnpm config set registry $X_NPM_MIRROR

WORKDIR /src

RUN --mount=type=bind,source=package.json,target=package.json \
  --mount=type=bind,source=pnpm-lock.yaml,target=pnpm-lock.yaml \
  --mount=type=bind,source=pnpm-workspace.yaml,target=pnpm-workspace.yaml \
  --mount=type=bind,source=apps/aihues-web/package.json,target=apps/aihues-web/package.json \
  --mount=type=cache,target=/root/.pnpm-store \
  pnpm config set store-dir /root/.pnpm-store && \
  pnpm install --frozen-lockfile

###########################################################
# moon workspace
###########################################################
FROM base AS workspace
ARG X_MOON_LOG=info

COPY . .
RUN --mount=type=cache,target=/root/.proto \
  pnpm moon docker scaffold aihues-web --log="$X_MOON_LOG"

###########################################################
# build
###########################################################
FROM base AS build
ARG X_MOON_LOG=info
ARG PROTO_OFFLINE=0

COPY --from=workspace /src/.moon/docker/workspace .
COPY --from=workspace /src/.moon/docker/sources .

RUN --mount=type=cache,target=/root/.proto \
  --mount=type=cache,target=/root/.pnpm-store \
  pnpm config set store-dir /root/.pnpm-store && \
  pnpm install --frozen-lockfile && \
  pnpm moon run aihues-web:build --log="$X_MOON_LOG"

###########################################################
# runtime
###########################################################
FROM msai-cn-beijing.cr.volces.com/public/library/node:22.17.1-bookworm AS runtime

WORKDIR /app

COPY --from=build /src/apps/aihues-web/.next/standalone ./
COPY --from=build /src/apps/aihues-web/.next/static ./apps/aihues-web/.next/static
COPY --from=build /src/apps/aihues-web/public ./apps/aihues-web/public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "apps/aihues-web/server.js"]
