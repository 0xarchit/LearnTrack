#!/bin/bash

# Print environment variables for debugging
echo "Using API URL: $VITE_API_URL"

# Start the backend server with increased upload size limit
cd /app/backend
uvicorn app:app --host 0.0.0.0 --port 5000 &

# Start the frontend server with the environment variables
# The environment variables set in the Dockerfile or passed when running the container
# will be available here
cd /app && VITE_API_URL=$VITE_API_URL serve -s frontend/dist -l 5173 --single

wait