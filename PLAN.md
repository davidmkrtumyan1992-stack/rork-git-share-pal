# Fix recurring 404 build error by flattening project structure

**Problem:**  
The app has a nested folder structure (`expo/` subdirectory) that the build system can't properly package into an archive, causing repeated 404 errors.

**What will happen:**
- Remove the `rork.json` file that points to the `expo/` subdirectory
- Ensure all app files (screens, components, settings, assets) live at the root level where the build system expects them
- Remove any duplicate configuration files that exist in both the root and `expo/` folder
- Verify the app configuration is correct and consistent
- Clean reinstall all packages to ensure a fresh build

**Result:**  
The build system will be able to properly create and serve the project archive, eliminating the recurring 404 error.