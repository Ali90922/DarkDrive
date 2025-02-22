#!/bin/bash

# Define variables
SOURCE_DIR="/home/ec2-user/DarkDrive/frontend/dist"
DEST_DIR="/var/www/html"
APACHE_SERVICE="httpd"  # Change to 'apache2' if using Ubuntu/Debian

echo "🚀 Deploying Vite React App to Apache..."

# Ensure the script is run as root
if [[ $EUID -ne 0 ]]; then
   echo "❌ This script must be run as root! Use sudo." 
   exit 1
fi

# Remove existing files in Apache root
echo "🗑️  Clearing existing files in $DEST_DIR..."
rm -rf $DEST_DIR/*

# Copy new build files
echo "📂 Copying new build files from $SOURCE_DIR to $DEST_DIR..."
cp -r $SOURCE_DIR/* $DEST_DIR/

# Set proper permissions
echo "🔑 Setting permissions..."
chown -R apache:apache $DEST_DIR
chmod -R 755 $DEST_DIR

# Restart Apache
echo "🔄 Restarting Apache..."
systemctl restart $APACHE_SERVICE

echo "✅ Deployment complete! Your site should be live."

exit 0
