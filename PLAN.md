# Rebuild project to fix SDK version mismatch

Your project configuration and dependencies are already set to Expo SDK 54. The "SDK 52" error you're seeing is caused by a stale/cached build.

**What will be done:**
- Reinstall all project dependencies to clear any cached or outdated packages
- Restart the development server with a fresh build

This should resolve the SDK version mismatch error when scanning the QR code with Expo Go.