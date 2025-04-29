#!/bin/bash

# Start the backend server
cd /app/backend
uvicorn app:app --host 0.0.0.0 --port 5000 &

# Start the frontend server
# Use environment variables that were set in the Dockerfile
cd /app && serve -s frontend/dist -l 5173 --single

wait