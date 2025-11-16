# Task 17: Offline Functionality - Installation Guide

## 📦 Dependencies

### Required Package
The offline functionality requires the NetInfo package for network status monitoring.

### Installation

#### Step 1: Install NetInfo Package
```bash
npm install @react-native-community/netinfo
```

#### Step 2: Link Native Dependencies (iOS)
```bash
cd ios
pod install
cd ..
```

#### Step 3: Verify Installation
```bash
npm list @react-native-community/netinfo
```

Expected output:
```
@react-native-community/netinfo@11.0.0
```

## 🔧 Configuration

### Android Configuration
No additional configuration needed. NetInfo works out of the box on Android.

### iOS Configuration
No additional configuration needed. NetInfo works out of the box on iOS after pod install.

### Permissions
NetInfo automatically handles network state permissions on both platforms.

## ✅ Verification

### Step 1: Check Package Installation
```bash
npm list @react-native-community/netinfo
```

### Step 2: Build the App
```bash
# For Android
npm run android

# For iOS
npm run ios
```

### Step 3: Test Offline Functionality
1. Open the app
2. Turn off WiFi/mobile data
3. Verify offline indicator appears
4. Test app features work offline
5. Turn on internet
6. Verify indicator disappears

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run Specific Tests
```bash
# Test offline service
npm test offline.service.test

# Test offline indicator
npm test OfflineIndicator.test

# Test network status hook
npm test useNetworkStatus.test
```

### Expected Test Results
```
PASS  src/services/__tests__/offline.service.test.ts
PASS  src/components/common/__tests__/OfflineIndicator.test.tsx
PASS  src/hooks/__tests__/useNetworkStatus.test.ts

Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
```

## 📱 Platform-Specific Notes

### Android
- **Minimum SDK:** 21 (Android 5.0)
- **Permissions:** Automatically handled
- **Network Types:** WiFi, Mobile Data, Ethernet
- **Testing:** Use airplane mode or disable WiFi

### iOS
- **Minimum Version:** iOS 11.0
- **Permissions:** Automatically handled
- **Network Types:** WiFi, Cellular, Ethernet
- **Testing:** Use airplane mode or disable WiFi

## 🔍 Troubleshooting

### Issue: NetInfo not found
**Solution:**
```bash
# Reinstall package
npm install @react-native-community/netinfo

# For iOS, reinstall pods
cd ios
pod install
cd ..

# Rebuild app
npm run android  # or npm run ios
```

### Issue: Offline indicator not showing
**Solution:**
1. Verify NetInfo is installed
2. Check App.tsx includes OfflineIndicator
3. Test network connectivity changes
4. Check console for errors

### Issue: Tests failing
**Solution:**
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules
npm install

# Run tests again
npm test
```

### Issue: Build errors on iOS
**Solution:**
```bash
# Clean and reinstall pods
cd ios
rm -rf Pods
rm Podfile.lock
pod install
cd ..

# Clean build
cd ios
xcodebuild clean
cd ..

# Rebuild
npm run ios
```

### Issue: Build errors on Android
**Solution:**
```bash
# Clean gradle cache
cd android
./gradlew clean
cd ..

# Rebuild
npm run android
```

## 📋 Installation Checklist

### Pre-Installation
- [ ] Node.js installed (v16+)
- [ ] React Native environment setup
- [ ] Project dependencies installed

### Installation Steps
- [ ] Install NetInfo package
- [ ] Link native dependencies (iOS)
- [ ] Verify package installation
- [ ] Build app for testing

### Post-Installation
- [ ] Run unit tests
- [ ] Test offline functionality
- [ ] Verify offline indicator
- [ ] Test on real device

## 🚀 Quick Start After Installation

### 1. Import Services
```typescript
import {offlineService} from './src/services/offline.service';
import {useNetworkStatus} from './src/hooks/useNetworkStatus';
```

### 2. Check Offline Status
```typescript
const isReady = await offlineService.isOfflineReady();
console.log('App is offline ready:', isReady);
```

### 3. Monitor Network
```typescript
const {isConnected} = useNetworkStatus();
console.log('Network connected:', isConnected);
```

### 4. Use Offline Indicator
```typescript
import OfflineIndicator from './src/components/common/OfflineIndicator';

// Add to your app
<OfflineIndicator />
```

## 📚 Additional Resources

### Documentation
- `src/services/README_OFFLINE.md` - Complete offline guide
- `TASK_17_COMPLETE.md` - Implementation details
- `TASK_17_SUMMARY.md` - Summary document
- `TASK_17_QUICK_REFERENCE.md` - Quick reference

### NetInfo Documentation
- Official Docs: https://github.com/react-native-netinfo/react-native-netinfo
- API Reference: https://github.com/react-native-netinfo/react-native-netinfo/blob/master/README.md

### Support
- Check console logs for errors
- Review test files for examples
- Refer to troubleshooting section
- Check NetInfo GitHub issues

## ⚙️ Advanced Configuration

### Custom Network Monitoring
```typescript
import NetInfo from '@react-native-community/netinfo';

// Configure NetInfo
NetInfo.configure({
  reachabilityUrl: 'https://clients3.google.com/generate_204',
  reachabilityTest: async (response) => response.status === 204,
  reachabilityLongTimeout: 60 * 1000, // 60s
  reachabilityShortTimeout: 5 * 1000, // 5s
  reachabilityRequestTimeout: 15 * 1000, // 15s
});
```

### Custom Offline Indicator
```typescript
// Show indicator even when online (for testing)
<OfflineIndicator showWhenOnline={true} />
```

## 🎯 Production Deployment

### Before Release
1. Verify all tests pass
2. Test on multiple devices
3. Test offline functionality thoroughly
4. Check app size impact
5. Review console logs

### Release Checklist
- [ ] NetInfo properly installed
- [ ] All tests passing
- [ ] Offline functionality verified
- [ ] Documentation complete
- [ ] No console errors
- [ ] Performance optimized

## 📊 Package Information

### NetInfo Package
- **Name:** @react-native-community/netinfo
- **Version:** 11.0.0
- **License:** MIT
- **Size:** ~50KB
- **Dependencies:** None

### Impact on App
- **Bundle Size:** +50KB
- **Performance:** Minimal impact
- **Battery:** Negligible impact
- **Permissions:** None required

## ✅ Verification Commands

### Check Installation
```bash
npm list @react-native-community/netinfo
```

### Check App Build
```bash
# Android
npm run android

# iOS
npm run ios
```

### Run Tests
```bash
npm test
```

### Check for Errors
```bash
# Check TypeScript
npx tsc --noEmit

# Check ESLint
npm run lint
```

## 🎉 Success Indicators

### Installation Successful When:
- ✅ NetInfo package installed
- ✅ No build errors
- ✅ All tests passing
- ✅ Offline indicator works
- ✅ Network monitoring active
- ✅ App works offline

### Ready for Production When:
- ✅ All verification steps complete
- ✅ Tested on real devices
- ✅ No console errors
- ✅ Performance acceptable
- ✅ Documentation reviewed

---

**Installation Guide for Task 17: Offline Functionality**
**Date:** November 16, 2025
**Status:** COMPLETE ✅

For questions or issues, refer to the troubleshooting section or check the full documentation in `src/services/README_OFFLINE.md`.
