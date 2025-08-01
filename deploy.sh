#!/bin/bash

# BZA RUET Deployment Script
echo "🚀 Starting BZA RUET deployment..."

# Build the project
echo "📦 Building the project..."
npm run build

# Deploy to Firebase
echo "🔥 Deploying to Firebase Hosting..."
firebase deploy

echo "✅ Deployment complete!"
echo "🌐 Your website is live at: https://bza-ruet-alumni-477a6.web.app"
