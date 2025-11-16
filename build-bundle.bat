@echo off
REM Build Release App Bundle Script for 41 Day Quit Smoking App
REM This script builds a signed release AAB for Play Store

echo ========================================
echo Building Release App Bundle (AAB)
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if Android SDK is configured
if not defined ANDROID_HOME (
    echo WARNING: ANDROID_HOME environment variable is not set
    echo Please set ANDROID_HOME to your Android SDK location
    pause
)

echo Step 1: Cleaning previous builds...
cd android
call gradlew clean
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Clean failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo Step 2: Building Release App Bundle...
cd android
call gradlew bundleRelease
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo Build Successful!
echo ========================================
echo.
echo AAB Location:
echo android\app\build\outputs\bundle\release\app-release.aab
echo.

REM Check if AAB exists and show size
if exist android\app\build\outputs\bundle\release\app-release.aab (
    dir android\app\build\outputs\bundle\release\app-release.aab
    echo.
    echo This AAB file is ready for Google Play Store upload!
) else (
    echo ERROR: AAB file not found
)

echo.
echo Next Steps:
echo 1. Upload AAB to Google Play Console
echo 2. Complete store listing
echo 3. Submit for review
echo.
pause
