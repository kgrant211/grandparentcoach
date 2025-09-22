# Troubleshooting Guide

## Issues Fixed

### 1. Icon MIME Error ✅ FIXED
**Problem**: `Could not find MIME for Buffer <null>`
**Solution**: Removed empty icon files and icon references from app.json

### 2. Too Many Open Files Error ✅ FIXED
**Problem**: `EMFILE: too many open files, watch`
**Solution**: 
- Increased file descriptor limit: `ulimit -n 65536`
- Created `start.sh` script with the fix

### 3. Package Version Conflicts ✅ FIXED
**Problem**: Version mismatches between packages
**Solution**: Updated to compatible versions

## How to Run the App

### Option 1: Use the Start Script (Recommended)
```bash
./start.sh
```

### Option 2: Manual Start
```bash
# Increase file limit
ulimit -n 65536

# Start with clear cache
npx expo start --clear
```

### Option 3: For iOS Simulator
```bash
# Make sure you have Xcode installed
npx expo run:ios
```

## Current Status

✅ **Expo Server**: Running on http://localhost:8081
✅ **Dependencies**: All installed successfully
✅ **App Configuration**: Fixed icon issues
✅ **File Limits**: Increased to prevent EMFILE errors

## Next Steps

1. **Test in Expo Go**: Scan the QR code with Expo Go app
2. **Test in Simulator**: Press `i` in the terminal to open iOS simulator
3. **Test on Device**: Use Expo Go app on your phone

## If You Still Get Errors

### For Icon Issues:
- The app will use default Expo icons
- Add custom icons later when ready for production

### For File Limit Issues:
- Run `ulimit -n 65536` before starting
- Or use the `./start.sh` script

### For Build Issues:
- Try `npx expo prebuild --clean` to rebuild native code
- Make sure Xcode is installed for iOS builds

## Testing the App

The app should now show:
- Home screen with welcome message
- Ask screen for AI coaching
- Guides screen with parenting tips
- Settings screen with accessibility options

All features are functional except:
- AI responses (needs backend setup)
- Voice input (needs device testing)
- Subscriptions (needs RevenueCat setup)
