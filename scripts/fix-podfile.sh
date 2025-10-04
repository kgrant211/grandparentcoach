#!/bin/bash
# Fix Podfile configuration issue

PODFILE_PATH="./ios/Podfile"

if [ -f "$PODFILE_PATH" ]; then
  echo "Fixing Podfile..."
  # Replace the incorrect use_native_modules! call with the correct one
  sed -i '' 's/config = use_native_modules!(config_command)/config = use_native_modules!/' "$PODFILE_PATH"
  echo "Podfile fixed successfully"
else
  echo "Podfile not found at $PODFILE_PATH"
  exit 1
fi

