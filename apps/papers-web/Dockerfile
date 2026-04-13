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
  --mount=type=bind,source=.moon/toolchain.yml,target=.moon/toolchain.yml \
  --mount=type=bind,source=.moon/workspace.yml,target=.moon/workspace.yml \
  --mount=type=bind,source=.moon/tasks,target=.moon/tasks \
  --mount=type=bind,source=apps/papers-web/package.json,target=apps/papers-web/package.json \
  --mount=type=bind,source=packages/shared-types/package.json,target=packages/shared-types/package.json \
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
  pnpm moon docker scaffold papers-web --log="$X_MOON_LOG"

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
  pnpm moon run papers-web:build --log="$X_MOON_LOG"

###########################################################
# runtime
###########################################################
FROM msai-cn-beijing.cr.volces.com/public/library/node:22.17.1-bookworm AS runtime

WORKDIR /app

COPY --from=build /src/apps/papers-web/.next/standalone ./
COPY --from=build /src/apps/papers-web/.next/static ./apps/papers-web/.next/static
COPY --from=build /src/apps/papers-web/public ./apps/papers-web/public

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "apps/papers-web/server.js"]
