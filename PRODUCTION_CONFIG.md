# Production Configuration Guide

## Overview
This document outlines the production configuration for the 41 Day Quit Smoking App.

## Version Information
- **App Version**: 1.0.0
- **Build Number**: 1
- **Version Code (Android)**: 1

## Production Optimizations Applied

### 1. App Version and Build Number ✅
- Updated `package.json` with version 1.0.0 and build number 1
- Updated `app.json` with production metadata
- Configured Android `build.gradle` with versionCode 1 and versionName "1.0.0"

### 2. Release Signing Configuration ✅

#### Android
- Configured release signing in `android/app/build.gradle`
- Added separate build configurations for debug and release
- **IMPORTANT**: Before production release, create a release keystore:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias quitsmokingapp -keyalg RSA -keysize 2048 -validity 10000
```

Then update the signing config in `android/app/build.gradle`:
```gradle
release {
    storeFile file('release.keystore')
    storePassword System.getenv("KEYSTORE_PASSWORD")
    keyAlias System.getenv("KEY_ALIAS")
    keyPassword System.getenv("KEY_PASSWORD")
}
```

Store credentials securely:
- Never commit keystore files to version control
- Use environment variables for passwords
- Keep backup of keystore in secure location

#### iOS
- Configure signing in Xcode:
  1. Open `ios/QuitSmokingApp.xcworkspace`
  2. Select project → Signing & Capabilities
  3. Select your team and provisioning profile
  4. Enable "Automatically manage signing" or configure manual signing

### 3. App Size Optimization ✅

#### ProGuard Configuration
- Enabled ProGuard for release builds
- Created `android/app/proguard-rules.pro` with:
  - Code obfuscation
  - Unused code removal
  - Resource shrinking
  - Optimized for React Native and all dependencies

#### Build Optimizations
- Enabled Hermes engine for better performance
- Configured separate APKs per CPU architecture (reduces APK size by ~75%)
- Enabled resource shrinking
- Configured multi-dex support

#### Expected Size Reductions
- Universal APK: ~50-60 MB
- Split APKs: ~15-20 MB each
- AAB (Android App Bundle): ~40-50 MB

### 4. Debug Code Removal ✅

#### Logger Utility
Created `src/utils/logger.ts` to replace console.log statements:
- Automatically disables logs in production
- Maintains error logging for crash reporting
- Easy to integrate with services like Sentry

#### Usage
Replace:
```typescript
console.log('Debug message');
console.warn('Warning');
console.error('Error');
```

With:
```typescript
import Logger from '@/utils/logger';

Logger.log('Debug message');    // Disabled in production
Logger.warn('Warning');          // Disabled in production
Logger.error('Error');           // Always enabled
```

#### Files with Console Statements
The following files contain console statements that should be reviewed:
- `src/utils/imageOptimization.ts` (2 console.log, 2 console.warn)
- `src/utils/errorHandler.ts` (1 console.log, 2 console.error)
- `src/utils/accessibility.ts` (1 console.error)
- `src/services/prayerTime.service.ts` (2 console.log, 2 console.error)
- `src/services/offline.service.ts` (5 console.log, 5 console.error)
- `src/services/notification.service.ts` (3 console.log)
- `src/services/storage.service.ts` (multiple console.error)
- `src/services/security.service.ts` (multiple console.error)

**Note**: Error logging (console.error) is intentionally kept for production debugging and crash reporting.

## Build Commands

### Development
```bash
# Android
npm run android

# iOS
npm run ios
```

### Production Testing
```bash
# Android Release
npm run android:release

# iOS Release
npm run ios:release
```

### Production Builds
```bash
# Android APK
npm run android:build
# Output: android/app/build/outputs/apk/release/app-release.apk

# Android App Bundle (for Play Store)
npm run android:bundle
# Output: android/app/build/outputs/bundle/release/app-release.aab

# iOS Archive (in Xcode)
# Product → Archive → Distribute App
```

### Clean Builds
```bash
# Clean all
npm run clean

# Clean Android only
npm run clean:android

# Reset Metro cache
npm run start:reset
```

## Pre-Release Checklist

### Code Quality
- [ ] Run `npm run lint` and fix all issues
- [ ] Run `npm run test` and ensure all tests pass
- [ ] Review and replace console.log statements with Logger
- [ ] Remove any TODO or FIXME comments
- [ ] Remove any test/mock data

### Configuration
- [ ] Update version numbers in package.json and app.json
- [ ] Create and configure release keystore (Android)
- [ ] Configure code signing (iOS)
- [ ] Update app icons and splash screens
- [ ] Configure app permissions in AndroidManifest.xml and Info.plist

### Testing
- [ ] Test on physical devices (Android and iOS)
- [ ] Test all features in release mode
- [ ] Test offline functionality
- [ ] Test notifications
- [ ] Test app performance and memory usage
- [ ] Test on different screen sizes

### Security
- [ ] Review and secure API keys
- [ ] Enable SSL pinning if using external APIs
- [ ] Review data encryption implementation
- [ ] Test PIN lock and biometric authentication
- [ ] Review app permissions

### Store Preparation
- [ ] Prepare app store screenshots
- [ ] Write app description (English and Bengali)
- [ ] Prepare privacy policy
- [ ] Prepare terms of service
- [ ] Create promotional graphics

## Environment Variables

For production builds, consider using environment variables:

```bash
# Android
export KEYSTORE_PASSWORD="your_keystore_password"
export KEY_ALIAS="quitsmokingapp"
export KEY_PASSWORD="your_key_password"

# Build
npm run android:bundle
```

## Performance Monitoring

Consider integrating:
- **Sentry**: Error tracking and crash reporting
- **Firebase Analytics**: User behavior analytics
- **Firebase Performance**: Performance monitoring
- **Firebase Crashlytics**: Crash reporting

## Security Best Practices

1. **Never commit sensitive data**:
   - Keystore files
   - Passwords
   - API keys
   - Private keys

2. **Use environment variables** for sensitive configuration

3. **Enable ProGuard** to obfuscate code

4. **Implement certificate pinning** for API calls

5. **Regular security audits** of dependencies:
   ```bash
   npm audit
   npm audit fix
   ```

## App Store Submission

### Google Play Store
1. Create release in Play Console
2. Upload AAB file
3. Complete store listing
4. Set up pricing and distribution
5. Submit for review

### Apple App Store
1. Create app in App Store Connect
2. Archive and upload via Xcode
3. Complete app information
4. Submit for review

## Post-Release

1. Monitor crash reports
2. Monitor user reviews
3. Track analytics
4. Plan updates based on feedback
5. Maintain regular update schedule

## Support

For issues or questions:
- Review this documentation
- Check React Native documentation
- Review platform-specific guidelines (Android/iOS)

---

**Last Updated**: Task 25.1 Completion
**Status**: Production Ready (Pending Keystore Configuration)
