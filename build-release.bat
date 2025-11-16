@echo off
REM Build Release APK Script for 41 Day Quit Smoking App
REM This script builds a signed release APK

echo ========================================
echo Building Release APK
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
    echo Example: C:\Users\YourName\AppData\Local\Android\Sdk
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
echo Step 2: Building Release APK...
cd android
call gradlew assembleRelease
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
echo APK Location:
echo android\app\build\outputs\apk\release\
echo.

REM List generated APK files
dir /B android\app\build\outputs\apk\release\*.apk

echo.
echo Next Steps:
echo 1. Install APK on device: adb install android\app\build\outputs\apk\release\app-release.apk
echo 2. Test all features using TASK_25.3_TESTING_CHECKLIST.md
echo 3. Check app size and performance
echo.
pause
