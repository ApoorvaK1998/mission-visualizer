#!/bin/bash

echo "========================================"
echo "Starting Mission Visualizer..."
echo "========================================"

# Kill existing processes

echo "Cleaning ports 3000 and 5000..."
fuser -k 5000/tcp 2>/dev/null
fuser -k 3000/tcp 2>/dev/null
sleep 2

#######################################

# Start Backend

#######################################
echo "Starting backend on port 5000..."

cd backend/MissionVisualizer.Api || exit

dotnet run --urls="http://localhost:5000" &
BACKEND_PID=$!

echo "Backend PID: $BACKEND_PID"

cd ../../


echo "Waiting for backend to start..."
sleep 5

if curl -s http://localhost:5000/api/data/park/data > /dev/null 2>&1; then
echo "Backend started successfully"
else
echo "Warning: Backend may not have started properly"
fi

#######################################

# Start Frontend

#######################################
echo "Starting frontend on port 3000..."

cd frontend || exit

npm start &
FRONTEND_PID=$!

echo "Frontend PID: $FRONTEND_PID"


echo ""
echo "========================================"
echo "Mission Visualizer is running!"
echo "========================================"
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo "========================================"
echo ""
echo "Press CTRL+C to stop everything"
echo ""

#######################################

# Stop both on CTRL+C

#######################################
trap "echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

wait
