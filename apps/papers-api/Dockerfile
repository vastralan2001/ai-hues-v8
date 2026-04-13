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
  --mount=type=bind,source=apps/papers-api/package.json,target=apps/papers-api/package.json \
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
  pnpm moon docker scaffold papers-api --log="$X_MOON_LOG"

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
  pnpm moon run papers-api:build --log="$X_MOON_LOG"

###########################################################
# runtime
###########################################################
FROM msai-cn-beijing.cr.volces.com/public/library/node:22.17.1-bookworm AS runtime

WORKDIR /app

COPY --from=build /src/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=build /src/apps/papers-api/dist ./apps/papers-api/dist
COPY --from=build /src/apps/papers-api/package.json ./apps/papers-api/
COPY --from=build /src/packages/shared-types/package.json ./packages/shared-types/
COPY --from=build /src/package.json ./
COPY --from=build /src/pnpm-workspace.yaml ./
COPY --from=build /src/pnpm-lock.yaml ./

RUN corepack enable && pnpm install --frozen-lockfile --prod

WORKDIR /app/apps/papers-api

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "dist/index.js"]
