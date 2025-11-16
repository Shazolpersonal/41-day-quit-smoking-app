# Task 19: Data Privacy and Security - Installation Guide

## Quick Start

The security features are implemented and ready to use. Follow these steps to integrate them into your app.

## Step 1: Add Security Provider

Update your `App.tsx` to include the SecurityProvider:

```typescript
import React from 'react';
import {SecurityProvider} from './src/context/SecurityContext';
import {UserProvider} from './src/context/UserContext';
import {ProgressProvider} from './src/context/ProgressContext';
import {SettingsProvider} from './src/context/SettingsContext';
import {JournalProvider} from './src/context/JournalContext';
import RootNavigator from './src/navigation/RootNavigator';

function App() {
  return (
    <SecurityProvider>
      <UserProvider>
        <ProgressProvider>
          <SettingsProvider>
            <JournalProvider>
              <RootNavigator />
            </JournalProvider>
          </SettingsProvider>
        </ProgressProvider>
      </UserProvider>
    </SecurityProvider>
  );
}

export default App;
```

## Step 2: Update Root Navigator

Add PIN lock screen to your navigation:

```typescript
// src/navigation/RootNavigator.tsx
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useSecurity} from '../context/SecurityContext';
import PinLockScreen from '../screens/PinLockScreen';
import MainTabNavigator from './MainTabNavigator';

const Stack = createStackNavigator();

function RootNavigator() {
  const {isLocked, isAuthenticated, loading} = useSecurity();

  // Show loading screen while initializing
  if (loading) {
    return null; // or a loading component
  }

  // Show PIN lock screen if locked
  if (isLocked && !isAuthenticated) {
    return (
      <PinLockScreen
        mode="verify"
        onSuccess={() => {
          // Navigation will update automatically
        }}
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
```

## Step 3: Add Security Settings to Navigation

Update your navigation types:

```typescript
// src/types/navigation.ts
export type RootStackParamList = {
  Main: undefined;
  SecuritySettings: undefined;
  // ... other screens
};
```

Add the screen to your stack navigator:

```typescript
// In your stack navigator
import SecuritySettingsScreen from '../screens/SecuritySettingsScreen';

<Stack.Screen
  name="SecuritySettings"
  component={SecuritySettingsScreen}
  options={{
    title: 'নিরাপত্তা ও গোপনীয়তা',
    headerBackTitle: 'ফিরে যান',
  }}
/>
```

## Step 4: Add Link to Settings Screen

Update your SettingsScreen to include a link to security settings:

```typescript
// src/screens/SettingsScreen.tsx
import {useNavigation} from '@react-navigation/native';

function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView>
      {/* Other settings */}
      
      <TouchableOpacity
        style={styles.settingItem}
        onPress={() => navigation.navigate('SecuritySettings')}
      >
        <Text style={styles.settingIcon}>🔒</Text>
        <View style={styles.settingInfo}>
          <Text style={styles.settingLabel}>নিরাপত্তা ও গোপনীয়তা</Text>
          <Text style={styles.settingDescription}>
            পিন লক, বায়োমেট্রিক, ডেটা এক্সপোর্ট
          </Text>
        </View>
        <Text style={styles.settingArrow}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

## Step 5: Test the Implementation

### Test PIN Lock
1. Navigate to Settings → Security & Privacy
2. Enable PIN lock
3. Set a 6-digit PIN
4. Confirm the PIN
5. Close and reopen the app
6. Verify PIN lock screen appears

### Test Biometric
1. Enable PIN lock first
2. Enable biometric authentication
3. Close and reopen the app
4. Test biometric authentication

### Test Data Export
1. Navigate to Security Settings
2. Tap "Export Data"
3. Confirm export
4. Verify success message

### Test Data Deletion
1. Navigate to Security Settings
2. Tap "Delete All Data"
3. Confirm twice
4. Verify data is deleted

## Optional: Install Production Libraries

For production use, install these optional libraries:

### 1. AES Encryption
```bash
npm install react-native-aes-crypto
cd ios && pod install && cd ..
```

### 2. Biometric Authentication
```bash
npm install react-native-touch-id
cd ios && pod install && cd ..
```

Or use the newer library:
```bash
npm install react-native-biometrics
cd ios && pod install && cd ..
```

### 3. Secure Storage
```bash
npm install react-native-keychain
cd ios && pod install && cd ..
```

### 4. File System
```bash
npm install react-native-fs
cd ios && pod install && cd ..
```

## Configuration

### iOS Configuration

Add to `ios/YourApp/Info.plist`:

```xml
<key>NSFaceIDUsageDescription</key>
<string>আপনার পরিচয় যাচাই করতে Face ID ব্যবহার করুন</string>
```

### Android Configuration

Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.USE_FINGERPRINT" />
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Troubleshooting

### PIN Lock Not Showing
- Check that SecurityProvider is wrapping your app
- Verify PIN is enabled in security settings
- Check console for errors

### Biometric Not Working
- Ensure device has biometric hardware
- Check permissions are granted
- Verify PIN is enabled first

### Data Export Failing
- Check storage permissions (Android)
- Verify data exists
- Check console for errors

### Tests Failing
```bash
# Clear cache and run tests
npm test -- --clearCache
npm test -- --testPathPattern=security
```

## Verification

Run these commands to verify installation:

```bash
# Run all security tests
npm test -- --testPathPattern=security
npm test -- --testPathPattern=encryption
npm test -- --testPathPattern=dataExport

# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint
```

## Next Steps

1. ✅ Security features are installed
2. ✅ Test all functionality
3. ✅ Review security documentation
4. ⏭️ (Optional) Install production libraries
5. ⏭️ Deploy to production

## Support

For issues or questions:
1. Check `src/services/README_SECURITY.md`
2. Review test files for examples
3. Check console logs for errors
4. Verify all steps were followed

## Security Checklist

Before deploying to production:

- [ ] SecurityProvider added to App.tsx
- [ ] PIN lock screen integrated
- [ ] Security settings accessible
- [ ] All tests passing
- [ ] Permissions configured (iOS/Android)
- [ ] (Optional) Production libraries installed
- [ ] Security features tested on device
- [ ] Data export tested
- [ ] Data deletion tested
- [ ] Privacy policy reviewed

---

**Installation Complete!** 🎉

Your app now has comprehensive security and privacy features.
