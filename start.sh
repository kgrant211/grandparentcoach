#!/bin/bash

# Increase file descriptor limit to prevent EMFILE errors
ulimit -n 65536

# Start Expo with clear cache
npx expo start --clear
