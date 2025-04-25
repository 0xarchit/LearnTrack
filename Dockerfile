# Multi-stage Dockerfile for LearnTrack

# 1. Build frontend
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
# Copy environment file for frontend
COPY .env .env
# Install pnpm
RUN npm install -g pnpm
# Copy manifests and config
COPY index.html package.json pnpm-lock.yaml vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json postcss.config.js tailwind.config.js ./
# Copy frontend source
COPY public/ ./public
COPY src/ ./src
# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm build

# 2. Install backend dependencies
FROM python:3.11-alpine AS backend
WORKDIR /app/backend
# Install build tools
RUN apk add --no-cache gcc musl-dev libffi-dev openssl-dev make
# Copy and install Python requirements
COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# 3. Final runtime image
FROM python:3.11-alpine AS final
WORKDIR /app
# lightweight shell for chaining
RUN apk add --no-cache bash

# Copy backend dependencies (including scripts) and code
COPY --from=backend /usr/local /usr/local
COPY backend/ ./backend
# Ensure uploads directory exists
RUN mkdir -p /app/backend/uploads
COPY backend/uploads /app/backend/uploads

# Copy frontend build output
COPY --from=frontend /app/frontend/dist /app/frontend/dist

# Expose ports: FastAPI (5000) and static server (5173)
EXPOSE 5000 5173

# Start services
WORKDIR /app/backend
CMD ["bash", "-c", "uvicorn app:app --host 0.0.0.0 --port 5000 & python3 -m http.server --directory /app/frontend/dist 5173"]
