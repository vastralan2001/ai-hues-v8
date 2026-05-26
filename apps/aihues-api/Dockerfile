FROM msai-cn-beijing.cr.volces.com/public/library/golang:1.26.1-bookworm AS base

ARG GOPROXY="https://goproxy.cn,direct"
ARG GONOSUMDB="*.msh.team"

RUN go env -w \
  GOPATH="/go" \
  GOCACHE="/go/cache" \
  GOPROXY=$GOPROXY \
  GONOSUMDB=$GONOSUMDB

WORKDIR /src

# 注意：build context 应为仓库根（含 go.mod、gen/go、packages、apps/aihues-api）
COPY go.mod go.sum ./
COPY gen/go ./gen/go
COPY packages/cfg ./packages/cfg
COPY packages/database ./packages/database
COPY apps/aihues-api ./apps/aihues-api

RUN --mount=type=cache,target=/go \
  go mod download -x

RUN --mount=type=cache,target=/go \
  go build -o /dist/aihues-api ./apps/aihues-api


FROM msai-cn-beijing.cr.volces.com/public/library/debian:bookworm-slim
ARG APT_SOURCE=mirrors.volces.com

WORKDIR /usr/src/app

RUN set -ex \
  && sed -i "s|deb.debian.org|$APT_SOURCE|g" /etc/apt/sources.list.d/debian.sources

RUN \
  --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
  --mount=type=cache,target=/var/cache/apt,sharing=locked \
  apt-get update \
  && apt-get install -y --no-install-recommends \
  ca-certificates \
  tzdata

COPY --from=base /dist/aihues-api .

ENTRYPOINT ["./aihues-api", "api"]
