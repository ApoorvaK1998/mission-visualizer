#!/bin/bash

# Start Mission Visualizer Application
# Usage: ./start.sh

echo "Starting Mission Visualizer..."

# Kill existing processes on ports 3000 and 5000
echo "Checking for existing processes..."
fuser -k 5000/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
sleep 2

# Start backend
echo "Starting backend on port 5000..."
cd backend/MissionVisualizer.Api
dotnet run --urls="http://localhost:5000" &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -s http://localhost:5000/api/data/park/data > /dev/null 2>&1; then
    echo "Backend started successfully (PID: $BACKEND_PID)"
else
    echo "Warning: Backend may not have started properly"
fi

# Start frontend
echo "Starting frontend on port 3000..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "Mission Visualizer is running!"
echo "========================================"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "========================================"
echo ""
echo "To stop:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo "Or use: fuser -k 3000/tcp 5000/tcp"
