# Task 25.3: Build and Test Release APK - Complete Guide

## Overview
This guide covers building a signed release APK, testing on real devices, and verifying all features work correctly in the release build.

## Prerequisites Checklist

### Required Software
- ✅ Node.js (v16 or higher)
- ✅ React Native CLI
- ✅ Android Studio with SDK
- ✅ Java Development Kit (JDK 11 or higher)
- ✅ Physical Android device or emulator

### Verify Installation
```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check Java
java -version

# Check Android SDK
echo %ANDROID_HOME%
```

## Step 1: Generate Signed Release Keystore

### Option A: Create Production Keystore (Recommended for Play Store)

1. Open Command Prompt or PowerShell
2. Navigate to project directory:
```bash
cd "D:\Kiro\41 Day Quit smoking"
```

3. Generate keystore:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore android/app/release.keystore -alias quitsmokingapp -keyalg RSA -keysize 2048 -validity 10000
```

4. You'll be prompted for:
   - **Keystore password**: Choose a strong password (e.g., `QuitSmoking@2024`)
   - **Key password**: Use same as keystore password
   - **Name**: Quit Smoking App Team
   - **Organization**: Quit Smoking App
   - **City**: Dhaka
   - **State**: Dhaka
   - **Country**: BD

5. **CRITICAL**: Backup the keystore file immediately!
   - Copy `android/app/release.keystore` to a secure location
   - Store passwords in a password manager
   - Never commit keystore to Git

### Option B: Use Debug Keystore (For Testing Only)

The project is currently configured to use debug keystore for release builds. This is acceptable for testing but **NOT for Play Store submission**.

## Step 2: Configure Keystore Properties

### Create keystore.properties file

Create `android/keystore.properties`:

```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=quitsmokingapp
storeFile=release.keystore
```

**IMPORTANT**: This file is already in .gitignore. Never commit it!

### Update build.gradle (if using production keystore)

The `android/app/build.gradle` needs to be updated to use the keystore.properties file:

```gradle
// Add at the top of the file
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            } else {
                // Fallback to debug keystore for testing
                storeFile file('debug.keystore')
                storePassword 'android'
                keyAlias 'androiddebugkey'
                keyPassword 'android'
            }
        }
    }
}
```

## Step 3: Build Release APK

### Method 1: Using npm script (Recommended)

```bash
npm run android:build
```

This will:
- Clean previous builds
- Run Gradle assembleRelease
- Generate APK at: `android/app/build/outputs/apk/release/`

### Method 2: Using Gradle directly

```bash
cd android
gradlew assembleRelease
cd ..
```

### Method 3: Build App Bundle (for Play Store)

```bash
npm run android:bundle
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

### Expected Build Output

You should see multiple APK files (if split APKs are enabled):
- `app-armeabi-v7a-release.apk` (~15-20 MB)
- `app-arm64-v8a-release.apk` (~15-20 MB)
- `app-x86-release.apk` (~15-20 MB)
- `app-x86_64-release.apk` (~15-20 MB)

Or a single universal APK:
- `app-release.apk` (~50-60 MB)

## Step 4: Verify APK Signature

### Check APK is signed correctly

```bash
# Using keytool
keytool -list -printcert -jarfile android/app/build/outputs/apk/release/app-release.apk

# Using apksigner (from Android SDK)
apksigner verify --verbose android/app/build/outputs/apk/release/app-release.apk
```

### Expected Output
- Certificate fingerprints (SHA-256, SHA-1)
- Signer information
- "Verified using v1 scheme (JAR signing): true"
- "Verified using v2 scheme (APK Signature Scheme v2): true"

## Step 5: Install APK on Real Device

### Prepare Device
1. Enable Developer Options:
   - Go to Settings → About Phone
   - Tap "Build Number" 7 times
   
2. Enable USB Debugging:
   - Settings → Developer Options → USB Debugging

3. Connect device via USB

4. Verify connection:
```bash
adb devices
```

### Install APK

```bash
# Install specific architecture APK
adb install android/app/build/outputs/apk/release/app-arm64-v8a-release.apk

# Or install universal APK
adb install android/app/build/outputs/apk/release/app-release.apk

# Force reinstall (if already installed)
adb install -r android/app/build/outputs/apk/release/app-arm64-v8a-release.apk
```

### Alternative: Manual Installation
1. Copy APK to device (via USB, email, or cloud storage)
2. Open APK file on device
3. Allow installation from unknown sources if prompted
4. Install the app

## Step 6: Comprehensive Testing Checklist

### 6.1 Initial Launch Testing
- [ ] App launches without crashes
- [ ] Splash screen displays correctly
- [ ] No debug logs visible in logcat
- [ ] App icon displays correctly in launcher
- [ ] App name shows correctly

### 6.2 Onboarding Flow
- [ ] Welcome screen displays properly
- [ ] Bangla text renders correctly
- [ ] Date picker works for quit date selection
- [ ] Cigarette consumption input accepts valid numbers
- [ ] Price per pack input works correctly
- [ ] Prayer notification toggle functions
- [ ] Form validation works (prevents invalid inputs)
- [ ] Data saves successfully
- [ ] Navigation to home screen works

### 6.3 Home Screen Features
- [ ] Day counter displays correct smoke-free days
- [ ] Money saved calculation is accurate
- [ ] Progress bar shows correct percentage
- [ ] Daily affirmation displays
- [ ] SOS button is prominent and clickable
- [ ] Quick actions work
- [ ] Milestone celebrations trigger correctly
- [ ] All Bangla text displays properly

### 6.4 Daily Content Screen
- [ ] Current day content displays correctly
- [ ] Task list shows all tasks
- [ ] Task completion checkboxes work
- [ ] Task completion persists after app restart
- [ ] Affirmations display properly
- [ ] Islamic reminders show correctly
- [ ] Navigation to previous days works
- [ ] Future days are locked/disabled
- [ ] Bangla content renders properly

### 6.5 Craving SOS Screen
- [ ] Encouragement messages display
- [ ] Breathing exercise animation works smoothly
- [ ] 4-4-4 breathing timer functions correctly
- [ ] Coping strategies list displays
- [ ] Islamic duas show correctly
- [ ] Dhikr suggestions display
- [ ] Emergency contacts list shows
- [ ] Call functionality works (if contacts added)
- [ ] Craving intensity slider works
- [ ] Craving log saves successfully

### 6.6 Journal Screen
- [ ] Journal entry form displays
- [ ] Text input works smoothly
- [ ] Mood selector functions
- [ ] Trigger category selection works
- [ ] Date picker works
- [ ] Entry saves successfully
- [ ] Calendar view displays entries
- [ ] Entry list shows all entries
- [ ] Entry detail view works
- [ ] Edit functionality works
- [ ] Delete functionality works with confirmation
- [ ] Trigger analysis displays correctly

### 6.7 Progress Screen
- [ ] Smoke-free time breakdown is accurate
- [ ] Money saved breakdown displays correctly
- [ ] Cigarettes not smoked count is correct
- [ ] Progress charts render properly
- [ ] Health timeline displays
- [ ] Achieved benefits are marked
- [ ] Upcoming benefits show correctly
- [ ] Milestone badges display
- [ ] Achieved badges are highlighted
- [ ] Craving analysis chart works
- [ ] Trigger analysis displays

### 6.8 Settings Screen
- [ ] Profile settings display current data
- [ ] Quit date can be edited
- [ ] Cigarette data can be updated
- [ ] Price per pack can be modified
- [ ] Changes save and persist
- [ ] Notification settings toggle works
- [ ] Daily reminder time picker works
- [ ] Prayer notification toggle functions
- [ ] Font size adjustment works
- [ ] Sound effects toggle works
- [ ] Haptic feedback toggle works
- [ ] Emergency contacts can be added
- [ ] Emergency contacts can be edited
- [ ] Emergency contacts can be deleted
- [ ] Export data functionality works
- [ ] Reset data shows confirmation
- [ ] Reset data clears all data
- [ ] App version displays correctly

### 6.9 Islamic Content Features
- [ ] Dua list displays correctly
- [ ] Dua audio playback works (if implemented)
- [ ] Quran verses display with proper Arabic text
- [ ] Translations show correctly
- [ ] Hadith displays properly
- [ ] Prayer times show correctly
- [ ] Next prayer time is highlighted
- [ ] Prayer time widget updates

### 6.10 Notification System
- [ ] App requests notification permissions
- [ ] Daily reminder notifications send
- [ ] Notification content is correct
- [ ] Tapping notification opens app
- [ ] Prayer time notifications work (if enabled)
- [ ] Milestone notifications trigger
- [ ] Inactivity reminder works (after 24 hours)
- [ ] Notifications display in Bangla

### 6.11 Offline Functionality
- [ ] App works without internet connection
- [ ] All daily content accessible offline
- [ ] User data saves offline
- [ ] Progress calculations work offline
- [ ] Journal entries save offline
- [ ] Settings changes persist offline
- [ ] Islamic content accessible offline

### 6.12 Security Features
- [ ] PIN lock can be enabled
- [ ] PIN setup flow works
- [ ] PIN verification works on app launch
- [ ] Biometric authentication works (if device supports)
- [ ] Journal data is encrypted
- [ ] Data export is secure

### 6.13 Performance Testing
- [ ] App launches quickly (< 3 seconds)
- [ ] Screen transitions are smooth
- [ ] Scrolling is smooth (60 FPS)
- [ ] No lag when typing in text inputs
- [ ] Animations run smoothly
- [ ] No memory leaks (check with Android Profiler)
- [ ] Battery usage is reasonable
- [ ] App doesn't overheat device

### 6.14 UI/UX Testing
- [ ] All text is readable
- [ ] Bangla font displays correctly
- [ ] Colors match Islamic theme
- [ ] Touch targets are adequate size (min 44x44 dp)
- [ ] Buttons provide visual feedback
- [ ] Loading states display when needed
- [ ] Error messages are user-friendly in Bangla
- [ ] Accessibility labels work with TalkBack
- [ ] App works in portrait orientation
- [ ] App works on different screen sizes

### 6.15 Edge Cases
- [ ] App handles date changes correctly (midnight)
- [ ] App handles timezone changes
- [ ] App handles low storage situations
- [ ] App handles permission denials gracefully
- [ ] App handles background/foreground transitions
- [ ] App handles app updates correctly
- [ ] App handles system language changes

## Step 7: Check App Size and Performance

### Analyze APK Size

```bash
# Check APK file size
dir android\app\build\outputs\apk\release\

# Analyze APK contents
bundletool build-apks --bundle=android/app/build/outputs/bundle/release/app-release.aab --output=app.apks --mode=universal
```

### Expected Sizes
- **Split APKs**: 15-20 MB each
- **Universal APK**: 50-60 MB
- **App Bundle (AAB)**: 40-50 MB

### Performance Metrics to Check

1. **App Launch Time**: Should be < 3 seconds
2. **Memory Usage**: Should be < 150 MB during normal use
3. **Battery Drain**: Should be minimal (< 2% per hour of active use)
4. **Frame Rate**: Should maintain 60 FPS during animations

### Use Android Profiler
1. Open Android Studio
2. Run → Profile 'app'
3. Select release APK
4. Monitor:
   - CPU usage
   - Memory allocation
   - Network activity (should be minimal/none)
   - Energy consumption

## Step 8: Test on Multiple Devices

### Recommended Test Devices

1. **Low-end device** (2GB RAM, Android 8.0)
   - Verify performance on older hardware
   - Check memory usage

2. **Mid-range device** (4GB RAM, Android 10)
   - Standard user experience testing

3. **High-end device** (8GB+ RAM, Android 12+)
   - Verify all features work on latest Android

### Different Screen Sizes
- Small (< 5 inches)
- Medium (5-6 inches)
- Large (6+ inches)
- Tablet (if applicable)

## Step 9: Logcat Monitoring

### Monitor for errors during testing

```bash
# Clear logcat
adb logcat -c

# Monitor app logs
adb logcat | findstr "QuitSmokingApp"

# Save logs to file
adb logcat > release_test_logs.txt
```

### What to Look For
- ❌ No ERROR level logs
- ❌ No crash reports
- ❌ No "console.log" statements (should be removed)
- ✅ Only INFO and WARN logs (if any)

## Step 10: Final Verification

### Pre-Release Checklist
- [ ] APK builds successfully without errors
- [ ] APK is properly signed
- [ ] App installs on real devices
- [ ] All features tested and working
- [ ] No crashes or critical bugs
- [ ] Performance is acceptable
- [ ] App size is within limits
- [ ] No debug code or logs
- [ ] Bangla text displays correctly everywhere
- [ ] Islamic content is accurate and respectful
- [ ] Notifications work correctly
- [ ] Offline functionality works
- [ ] Security features work
- [ ] Data persistence works
- [ ] All 41 days content is correct

### Known Issues to Document
- List any minor issues found
- Document workarounds if applicable
- Plan fixes for next version

## Troubleshooting

### Build Fails

**Error**: "Execution failed for task ':app:packageRelease'"
- **Solution**: Clean build and try again
```bash
cd android
gradlew clean
gradlew assembleRelease
```

**Error**: "Keystore was tampered with, or password was incorrect"
- **Solution**: Verify keystore password in keystore.properties
- Check keystore file path is correct

### Installation Fails

**Error**: "INSTALL_FAILED_UPDATE_INCOMPATIBLE"
- **Solution**: Uninstall existing app first
```bash
adb uninstall com.quitsmokingapp
adb install android/app/build/outputs/apk/release/app-release.apk
```

**Error**: "INSTALL_FAILED_INSUFFICIENT_STORAGE"
- **Solution**: Free up space on device

### App Crashes on Launch

1. Check logcat for crash logs:
```bash
adb logcat | findstr "AndroidRuntime"
```

2. Common causes:
   - Missing native libraries
   - ProGuard removed required code
   - Missing permissions in AndroidManifest.xml

3. Solution: Review proguard-rules.pro and add keep rules

### Performance Issues

1. Enable ProGuard (already enabled)
2. Use split APKs (already configured)
3. Optimize images and assets
4. Remove unused dependencies

## Success Criteria

Task 25.3 is complete when:

✅ Release APK builds successfully
✅ APK is properly signed with keystore
✅ APK installs on multiple real devices
✅ All features tested and working in release build
✅ No crashes or critical bugs found
✅ Performance is acceptable (smooth, responsive)
✅ App size is within acceptable limits (< 60 MB)
✅ All test checklist items pass
✅ Documentation is complete

## Next Steps

After completing Task 25.3:
1. Mark task as complete in tasks.md
2. Create completion documentation
3. Proceed to Task 25.4: Create user documentation
4. Prepare for Play Store submission

## Additional Resources

- [Android Developer Guide - Build Your App](https://developer.android.com/studio/build)
- [React Native - Publishing to Google Play Store](https://reactnative.dev/docs/signed-apk-android)
- [Android App Bundle](https://developer.android.com/guide/app-bundle)

---

**Document Version**: 1.0
**Last Updated**: Task 25.3 Implementation
**Status**: Ready for Testing
