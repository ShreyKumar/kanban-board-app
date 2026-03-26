# Stage 1: Build the NextJS frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Build the FastAPI backend
FROM python:3.12-slim

# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Enable bytecode compilation
ENV UV_COMPILE_BYTECODE=1

# Change to backend dir
WORKDIR /app/backend

# Copy the pyproject.toml file
COPY backend/pyproject.toml .

# Install dependencies into system via uv
RUN uv pip install --system .

# Copy frontend to /app/frontend/out so it's outside the /app/backend volume mount
COPY --from=frontend-builder /app/frontend/out /app/frontend/out

# Copy the entire backend
COPY backend/ .

EXPOSE 8000

# Run the app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
