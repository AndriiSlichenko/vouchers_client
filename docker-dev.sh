#!/bin/bash

# Simple script to run the development container

echo "🐳 Building and starting development container..."
echo "📱 App will be available at: http://localhost:5001"
echo "🛑 Press Ctrl+C to stop the container"

docker-compose up --build