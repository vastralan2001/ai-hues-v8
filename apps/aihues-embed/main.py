"""aihues-embed — tiny sentence-embedding sidecar for aihues-api.

Exposes the same model the web app used in-process (all-MiniLM-L6-v2) over
HTTP so the Go service can build a FAISS index and embed queries. L2-normalised
vectors → inner product == cosine similarity.
"""

from __future__ import annotations

import os

from fastapi import FastAPI
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer

MODEL_NAME = os.environ.get("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")

app = FastAPI(title="aihues-embed")
_model: SentenceTransformer | None = None


def model() -> SentenceTransformer:
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model


class EmbedRequest(BaseModel):
    texts: list[str]


class EmbedResponse(BaseModel):
    vectors: list[list[float]]
    dim: int


@app.get("/healthz")
def healthz() -> dict:
    return {"status": "ok", "model": MODEL_NAME, "dim": model().get_sentence_embedding_dimension()}


@app.post("/embed", response_model=EmbedResponse)
def embed(req: EmbedRequest) -> EmbedResponse:
    if not req.texts:
        return EmbedResponse(vectors=[], dim=model().get_sentence_embedding_dimension())
    vecs = model().encode(req.texts, normalize_embeddings=True, convert_to_numpy=True)
    return EmbedResponse(vectors=vecs.tolist(), dim=int(vecs.shape[1]))
