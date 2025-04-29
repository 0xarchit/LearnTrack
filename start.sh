#!/bin/bash
uvicorn app:app --host 0.0.0.0 --port 5000 &
cd /app && serve -s frontend/dist -l 5173 --single
wait