
# Invoice Creator Pro - Native App Build Instructions

This document provides step-by-step instructions to build and run your Invoice Creator Pro application as native apps for Windows and Android.

## 📋 Prerequisites

### For Windows Desktop App (Electron)
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional) - [Download here](https://git-scm.com/)

### For Android App (Capacitor)
- **Node.js** (v16 or higher)
- **Android Studio** - [Download here](https://developer.android.com/studio)
- **Java JDK 11** - [Download here](https://adoptium.net/)

## 🚀 Quick Start

### 1. Setup Development Environment
```bash
# Run the setup script to install all dependencies
node scripts/setup-dev.js
```

### 2. Development Mode

**Web Development:**
```bash
npm run dev
# Opens at http://localhost:8080
```

**Windows Desktop Development:**
```bash
node scripts/electron-dev.js
# Starts both web server and Electron app
```

**Android Development:**
```bash
# First time only - add Android platform
npx cap add android

# For development
npx cap run android
# Opens Android Studio or deploys to connected device
```

## 🏗️ Building for Production

### Build All Platforms
```bash
node scripts/build-all.js
```

### Individual Platform Builds

**Windows Desktop (.exe):**
```bash
node scripts/build-electron.js
# Output: dist-electron/
```

**Android APK:**
```bash
node scripts/build-android.js
# Then open android/ folder in Android Studio
```

## 📱 Android APK Build Process

### Method 1: Using Android Studio (Recommended)
1. Run `node scripts/build-android.js`
2. Open Android Studio
3. Open the `android/` folder as a project
4. Wait for Gradle sync to complete
5. Go to **Build > Generate Signed Bundle / APK**
6. Choose **APK** and click **Next**
7. Create a new keystore or use existing one
8. Click **Next** and then **Finish**
9. APK will be generated in `android/app/build/outputs/apk/`

### Method 2: Command Line
```bash
# Navigate to android folder
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires signing)
./gradlew assembleRelease
```

## 💻 Windows Executable Build Process

The Electron build process creates:
- **Installer (.exe)**: For easy installation on Windows
- **Portable version**: Standalone executable
- **Files are generated in**: `dist-electron/`

### Distribution
- **Installer**: Share the `.exe` installer file
- **Portable**: Share the entire application folder

## 📁 Project Structure

```
invoice-creator-pro/
├── src/                          # React source code
├── public/                       # Static assets
├── dist/                        # Web build output
├── electron/                    # Electron configuration
│   ├── main.js                  # Main Electron process
│   └── preload.js              # Preload script
├── android/                     # Android project (generated)
├── scripts/                     # Build scripts
│   ├── setup-dev.js            # Development setup
│   ├── build-electron.js       # Windows build
│   ├── build-android.js        # Android build prep
│   ├── electron-dev.js         # Electron dev mode
│   └── build-all.js            # Build all platforms
├── dist-electron/              # Windows build output
└── BUILD_INSTRUCTIONS.md       # This file
```

## 🔧 Platform-Specific Features

### Windows Desktop (Electron)
- ✅ Native window controls
- ✅ System tray integration
- ✅ File system access
- ✅ Print functionality
- ✅ Keyboard shortcuts
- ✅ Auto-updater ready

### Android (Capacitor)
- ✅ Native Android UI
- ✅ Splash screen
- ✅ Status bar configuration
- ✅ File access permissions
- ✅ Camera access (for future features)
- ✅ Offline support
- ✅ Hardware back button

## 🔧 Troubleshooting

### Common Windows Issues
- **Electron not starting**: Run `npm install electron --save-dev`
- **Build fails**: Ensure Node.js version is 16+
- **Missing dependencies**: Run `node scripts/setup-dev.js`

### Common Android Issues
- **Gradle sync fails**: Update Android Studio and SDK
- **Build tools missing**: Install latest Android SDK build tools
- **APK install fails**: Enable "Unknown sources" in Android settings

### General Issues
- **Port 8080 in use**: Change port in `vite.config.ts`
- **Build fails**: Clear `node_modules` and run `npm install`

## 📋 Testing Checklist

### Before Building
- [ ] All features work in web version (`npm run dev`)
- [ ] No console errors
- [ ] All dependencies installed
- [ ] Build scripts have executable permissions

### Windows Testing
- [ ] Electron app starts without errors
- [ ] All UI components render correctly
- [ ] Print functionality works
- [ ] File operations work
- [ ] App installs and uninstalls properly

### Android Testing
- [ ] APK installs on Android device
- [ ] All features work offline
- [ ] Responsive design works on mobile
- [ ] Permissions are granted
- [ ] Back button works correctly

## 🚀 Distribution

### Windows
- Share the installer `.exe` from `dist-electron/`
- Users double-click to install
- App appears in Start Menu and Desktop

### Android
- Share the `.apk` file from `android/app/build/outputs/apk/`
- Users enable "Install from unknown sources"
- Install by tapping the APK file

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Ensure all prerequisites are installed
3. Try rebuilding with `node scripts/build-all.js`
4. Check console output for specific error messages

Happy building! 🎉
