# RYVO: one container runs the mini Redis bus, every agent and the FastAPI backend serving the React app.
FROM node:20-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM python:3.12-slim
WORKDIR /app
RUN pip install --no-cache-dir "redis>=5" "fastapi>=0.110" "uvicorn>=0.29" "pydantic>=2"
COPY . .
COPY --from=frontend /app/frontend/dist ./frontend/dist
ENV PYTHONUNBUFFERED=1 PYTHONIOENCODING=utf-8
EXPOSE 8501
CMD ["sh", "-c", "python run_all.py --domain all --port ${PORT:-8501}"]
