# aihues-embed — sentence-embedding sidecar
# Bakes the all-MiniLM-L6-v2 model into the image so no model download happens
# at runtime. Co-deployed alongside aihues-api on the same instance.
FROM python:3.11-slim

ENV HF_ENDPOINT=https://hf-mirror.com \
    HF_HUB_DISABLE_TELEMETRY=1 \
    PYTHONUNBUFFERED=1 \
    EMBED_MODEL=sentence-transformers/all-MiniLM-L6-v2

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py ./

# Pre-download the model weights at build time.
RUN python -c "from sentence_transformers import SentenceTransformer; import os; SentenceTransformer(os.environ['EMBED_MODEL'])"

EXPOSE 8000
ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
