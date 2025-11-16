# Task 25.1 Quick Reference

## Production Build Commands

### Android
```bash
# Build Release APK
npm run android:build

# Build App Bundle (for Play Store)
npm run android:bundle

# Test Release Build
npm run android:release

# Clean Build
npm run clean:android
```

### iOS
```bash
# Test Release Build
npm run ios:release

# Archive (in Xcode)
# Product → Archive → Distribute App
```

## Version Information
- **Version**: 1.0.0
- **Build Number**: 1
- **Version Code**: 1

## Update Version
1. Update `package.json`: `"version": "1.0.0"`
2. Update `app.json`: `"version": "1.0.0"`
3. Update `android/app/build.gradle`: `versionCode` and `versionName`
4. Update iOS in Xcode: Version and Build number

## Keystore Setup (First Time Only)
```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias quitsmokingapp -keyalg RSA -keysize 2048 -validity 10000
```

See `KEYSTORE_SETUP_GUIDE.md` for detailed instructions.

## Pre-Release Checklist
- [ ] Update version numbers
- [ ] Create release keystore (Android)
- [ ] Configure code signing (iOS)
- [ ] Run tests: `npm test`
- [ ] Run linter: `npm run lint`
- [ ] Test on physical devices
- [ ] Test release builds
- [ ] Review console.log statements
- [ ] Verify ProGuard configuration
- [ ] Test offline functionality
- [ ] Test notifications

## Build Output Locations

### Android
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### iOS
- Archive: Created via Xcode → Product → Archive

## Logger Usage
Replace console statements:
```typescript
import Logger from '@/utils/logger';

Logger.log('Debug');    // Disabled in production
Logger.warn('Warning'); // Disabled in production
Logger.error('Error');  // Always enabled
```

## Optimizations Applied
✅ ProGuard enabled (code obfuscation, shrinking)
✅ Resource shrinking enabled
✅ Hermes engine enabled
✅ Split APKs per architecture
✅ Multi-dex support
✅ Production logger utility

## Important Files
- `PRODUCTION_CONFIG.md` - Complete production guide
- `KEYSTORE_SETUP_GUIDE.md` - Keystore creation guide
- `android/app/proguard-rules.pro` - ProGuard configuration
- `src/utils/logger.ts` - Production logger

## Security Notes
- Never commit keystore files
- Use environment variables for passwords
- Backup keystore in multiple secure locations
- Keep credentials in password manager

## Support
For detailed information, see:
- `PRODUCTION_CONFIG.md`
- `KEYSTORE_SETUP_GUIDE.md`
- React Native documentation
- Android/iOS developer guides
