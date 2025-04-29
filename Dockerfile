# Multi-stage Dockerfile for LearnTrack

# 1. Build frontend
FROM node:18-alpine AS frontend
WORKDIR /app/frontend
# Set environment variable for frontend build
# This will be used during build time
ENV VITE_API_URL=http://localhost:5000
# Copy manifests and config
COPY index.html package.json pnpm-lock.yaml vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json postcss.config.js tailwind.config.js ./
# Copy frontend source
COPY public/ ./public
COPY src/ ./src
# Install pnpm
RUN npm install -g pnpm
# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm build
# Install serve globally - for properly handling SPA routing
RUN npm install -g serve

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
# Install Node.js for running serve
RUN apk add --no-cache nodejs npm bash
# Install serve globally
RUN npm install -g serve

# Set environment variable for runtime
ENV VITE_API_URL=http://localhost:5000

# Copy backend dependencies (including scripts) and code
COPY --from=backend /usr/local /usr/local
COPY backend/ ./backend
# Ensure uploads directory exists
RUN mkdir -p /app/backend/uploads
COPY backend/uploads /app/backend/uploads

# Copy frontend build output
COPY --from=frontend /app/frontend/dist /app/frontend/dist

# Copy serve binary from frontend build stage
COPY --from=frontend /usr/local/bin/serve /usr/local/bin/serve

# Expose ports: FastAPI (5000) and React app (5173)
EXPOSE 5000 5173

# Copy start script and ensure it has the right permissions
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Set working directory for the start command
WORKDIR /app/backend

CMD ["/app/start.sh"]
