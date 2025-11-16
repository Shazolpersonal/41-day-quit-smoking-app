@echo off
REM Install Release APK Script for 41 Day Quit Smoking App
REM This script installs the release APK on a connected device

echo ========================================
echo Installing Release APK
echo ========================================
echo.

REM Check if adb is available
where adb >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: adb is not installed or not in PATH
    echo Please install Android SDK Platform Tools
    pause
    exit /b 1
)

REM Check if device is connected
echo Checking for connected devices...
adb devices
echo.

REM Find the APK file
set APK_PATH=android\app\build\outputs\apk\release

if not exist %APK_PATH% (
    echo ERROR: Release APK directory not found
    echo Please build the release APK first using build-release.bat
    pause
    exit /b 1
)

echo Available APK files:
dir /B %APK_PATH%\*.apk
echo.

REM Try to find arm64-v8a APK first (most common)
if exist %APK_PATH%\app-arm64-v8a-release.apk (
    set APK_FILE=%APK_PATH%\app-arm64-v8a-release.apk
    echo Installing arm64-v8a APK...
) else if exist %APK_PATH%\app-armeabi-v7a-release.apk (
    set APK_FILE=%APK_PATH%\app-armeabi-v7a-release.apk
    echo Installing armeabi-v7a APK...
) else if exist %APK_PATH%\app-release.apk (
    set APK_FILE=%APK_PATH%\app-release.apk
    echo Installing universal APK...
) else (
    echo ERROR: No APK file found
    echo Please build the release APK first using build-release.bat
    pause
    exit /b 1
)

echo.
echo Installing: %APK_FILE%
echo.

adb install -r %APK_FILE%

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Installation Successful!
    echo ========================================
    echo.
    echo The app is now installed on your device.
    echo You can find it in the app drawer as "41 Day Quit Smoking"
    echo.
    echo Next Steps:
    echo 1. Open the app on your device
    echo 2. Complete testing using TASK_25.3_TESTING_CHECKLIST.md
    echo 3. Monitor logcat for any errors: adb logcat
    echo.
) else (
    echo.
    echo ========================================
    echo Installation Failed!
    echo ========================================
    echo.
    echo Common issues:
    echo - Device not connected or unauthorized
    echo - Insufficient storage on device
    echo - Conflicting app signature (uninstall old version first)
    echo.
    echo To uninstall old version:
    echo adb uninstall com.quitsmokingapp
    echo.
)

pause
