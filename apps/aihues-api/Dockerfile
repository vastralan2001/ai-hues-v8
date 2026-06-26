FROM msai-cn-beijing.cr.volces.com/public/library/golang:1.26.1-bookworm AS base

ARG GOPROXY="https://goproxy.cn,direct"
ARG GONOSUMDB="*.msh.team"

RUN go env -w \
  GOPATH="/go" \
  GOCACHE="/go/cache" \
  GOPROXY=$GOPROXY \
  GONOSUMDB=$GONOSUMDB

WORKDIR /src

# 注意：build context 应为仓库根（含 go.mod、packages/proto-go、packages、apps/aihues-api）
COPY go.mod go.sum ./
COPY packages/proto-go ./packages/proto-go
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

ENV HF_ENDPOINT=https://hf-mirror.com \
    HF_HUB_DISABLE_TELEMETRY=1 \
    PYTHONUNBUFFERED=1 \
    EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2 \
    AIHUES_API__EMBEDDINGS__URL=http://127.0.0.1:8000

RUN set -ex \
  && sed -i "s|deb.debian.org|$APT_SOURCE|g" /etc/apt/sources.list.d/debian.sources

RUN \
  --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
  --mount=type=cache,target=/var/cache/apt,sharing=locked \
  apt-get update \
  && apt-get install -y --no-install-recommends \
  ca-certificates \
  tzdata \
  python3 \
  python3-pip

# Embedding sidecar (co-located in this image; launched alongside the Go API).
COPY apps/aihues-embed /opt/embed
RUN pip install --no-cache-dir --break-system-packages -r /opt/embed/requirements.txt
# Bake the model so no download happens at runtime.
RUN python3 -c "from sentence_transformers import SentenceTransformer; import os; SentenceTransformer(os.environ['EMBED_MODEL'])"

COPY --from=base /dist/aihues-api .
COPY apps/aihues-api/entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
