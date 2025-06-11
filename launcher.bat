
@echo off
title Invoice Creator Pro - Platform Launcher
color 0A

echo.
echo ========================================
echo   Invoice Creator Pro - Platform Launcher
echo ========================================
echo.
echo Choose your platform:
echo.
echo [1] Web Development (Browser)
echo [2] Windows Desktop (Electron)
echo [3] Android (Capacitor)
echo [4] Build All Platforms
echo [5] Setup Development Environment
echo [0] Exit
echo.
set /p choice="Enter your choice (0-5): "

if "%choice%"=="1" (
    echo Starting web development server...
    npm run dev
) else if "%choice%"=="2" (
    echo Starting Windows desktop app...
    node scripts/electron-dev.js
) else if "%choice%"=="3" (
    echo Starting Android development...
    npx cap run android
) else if "%choice%"=="4" (
    echo Building all platforms...
    node scripts/build-all.js
) else if "%choice%"=="5" (
    echo Setting up development environment...
    node scripts/setup-dev.js
) else if "%choice%"=="0" (
    exit
) else (
    echo Invalid choice. Please try again.
    pause
    goto start
)

pause
