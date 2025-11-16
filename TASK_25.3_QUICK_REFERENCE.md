# Task 25.3: Quick Reference Guide

## Quick Build Commands

### Build Release APK
```bash
# Windows
build-release.bat

# Or manually
cd android
gradlew assembleRelease
cd ..
```

### Build App Bundle (for Play Store)
```bash
# Windows
build-bundle.bat

# Or manually
cd android
gradlew bundleRelease
cd ..
```

### Install on Device
```bash
# Windows
install-release.bat

# Or manually
adb install android/app/build/outputs/apk/release/app-arm64-v8a-release.apk
```

## Output Locations

- **APK Files**: `android/app/build/outputs/apk/release/`
- **App Bundle**: `android/app/build/outputs/bundle/release/app-release.aab`
- **Build Logs**: `android/app/build/outputs/logs/`

## Expected File Sizes

- Split APKs: 15-20 MB each
- Universal APK: 50-60 MB
- App Bundle (AAB): 40-50 MB

## Quick Testing Commands

### Check Connected Devices
```bash
adb devices
```

### Install APK
```bash
adb install -r android/app/build/outputs/apk/release/app-arm64-v8a-release.apk
```

### Uninstall App
```bash
adb uninstall com.quitsmokingapp
```

### Monitor Logs
```bash
# All logs
adb logcat

# App logs only
adb logcat | findstr "QuitSmokingApp"

# Clear logs
adb logcat -c
```

### Check App Info
```bash
# Get app info
adb shell dumpsys package com.quitsmokingapp

# Check app size
adb shell pm path com.quitsmokingapp
adb shell du -h /data/app/com.quitsmokingapp*
```

## Verify APK Signature

```bash
# Using keytool
keytool -list -printcert -jarfile android/app/build/outputs/apk/release/app-release.apk

# Using apksigner (if available)
apksigner verify --verbose android/app/build/outputs/apk/release/app-release.apk
```

## Performance Testing

### Launch Time
```bash
# Clear app data
adb shell pm clear com.quitsmokingapp

# Launch and measure
adb shell am start -W -n com.quitsmokingapp/.MainActivity
```

### Memory Usage
```bash
# Check memory
adb shell dumpsys meminfo com.quitsmokingapp
```

### Battery Usage
```bash
# Check battery stats
adb shell dumpsys batterystats com.quitsmokingapp
```

## Troubleshooting

### Build Fails
```bash
# Clean and rebuild
cd android
gradlew clean
gradlew assembleRelease
cd ..
```

### Installation Fails
```bash
# Uninstall old version
adb uninstall com.quitsmokingapp

# Install fresh
adb install android/app/build/outputs/apk/release/app-arm64-v8a-release.apk
```

### App Crashes
```bash
# View crash logs
adb logcat | findstr "AndroidRuntime"

# View all errors
adb logcat *:E
```

## Critical Test Areas

1. **Onboarding Flow** - Must work perfectly
2. **Home Screen** - Day counter and money saved accuracy
3. **Daily Content** - All 41 days accessible
4. **Craving SOS** - Breathing exercise and emergency contacts
5. **Journal** - CRUD operations and persistence
6. **Progress** - Calculations and charts
7. **Settings** - All toggles and data management
8. **Notifications** - Daily reminders and prayer times
9. **Offline** - All features work without internet
10. **Performance** - Smooth, no lag, < 3s launch

## Success Criteria Checklist

- [ ] APK builds without errors
- [ ] APK is properly signed
- [ ] Installs on real devices
- [ ] All features work in release build
- [ ] No crashes or critical bugs
- [ ] Performance is acceptable
- [ ] App size < 60 MB
- [ ] All Bangla text displays correctly
- [ ] Offline functionality works
- [ ] Notifications work correctly

## Files Created for Task 25.3

1. `TASK_25.3_BUILD_GUIDE.md` - Complete build and test guide
2. `TASK_25.3_TESTING_CHECKLIST.md` - Detailed testing checklist
3. `TASK_25.3_QUICK_REFERENCE.md` - This quick reference
4. `build-release.bat` - Build APK script
5. `build-bundle.bat` - Build AAB script
6. `install-release.bat` - Install APK script
7. Updated `android/app/build.gradle` - Keystore configuration

## Next Steps After Testing

1. Document all test results in TASK_25.3_TESTING_CHECKLIST.md
2. Fix any critical bugs found
3. Create TASK_25.3_COMPLETE.md with results
4. Mark task as complete in tasks.md
5. Proceed to Task 25.4: Create user documentation

---

**Quick Tip**: Use `build-release.bat` to build and `install-release.bat` to install on device!
