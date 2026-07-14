#!/bin/bash

# WALIKELASPRO Deployment Script
# untuk server dengan systemd

set -e

echo "📦 Building WALIKELASPRO..."

# Install dependencies
npm install

# Build project
npm run build

echo "✅ Build complete!"

# Stop existing service
echo "⏹️  Stopping existing service..."
sudo systemctl stop walaspro || true

# Copy files to production directory
echo "📁 Copying files to /var/www/walas.my.id..."
sudo mkdir -p /var/www/walas.my.id
sudo cp -r dist package.json .env storage /var/www/walas.my.id/

# Set permissions
sudo chown -R www-data:www-data /var/www/walas.my.id

# Copy systemd service
echo "⚙️  Installing systemd service..."
sudo cp deploy/walaspro.service /etc/systemd/system/
sudo systemctl daemon-reload

# Start service
echo "▶️  Starting service..."
sudo systemctl start walaspro
sudo systemctl enable walaspro

# Check status
echo "📊 Service status:"
sudo systemctl status walaspro --no-pager

echo ""
echo "🎉 Deployment complete!"
echo "🌐 App URL: https://walas.my.id"
