# Task 19: Data Privacy and Security - Quick Reference

## 🔐 Security Services

### Encryption Service

```typescript
import {encryptionService} from './services/encryption.service';

// Initialize with PIN
await encryptionService.initialize('123456');

// Encrypt data
const encrypted = await encryptionService.encrypt('Sensitive data');

// Decrypt data
const decrypted = await encryptionService.decrypt(encrypted);

// Check if initialized
const isReady = encryptionService.isInitialized();

// Change encryption key
await encryptionService.changeKey('oldPin', 'newPin');

// Clear key
await encryptionService.clearKey();
```

### Security Service

```typescript
import {securityService} from './services/security.service';

// Setup PIN
await securityService.setupPin('123456');

// Verify PIN
const isValid = await securityService.verifyPin('123456');

// Change PIN
await securityService.changePin('oldPin', 'newPin');

// Disable PIN
await securityService.disablePin('123456');

// Check if PIN is enabled
const enabled = await securityService.isPinEnabled();

// Enable biometric
await securityService.enableBiometric();

// Authenticate with biometric
const success = await securityService.authenticateWithBiometric();

// Check if locked
const locked = securityService.isLocked();

// Get security settings
const settings = await securityService.getSecuritySettings();
```

### Data Export Service

```typescript
import {dataExportService} from './services/dataExport.service';

// Export data
const data = await dataExportService.exportData();

// Export with confirmation
const data = await dataExportService.exportDataWithConfirmation();

// Save to file
await dataExportService.saveToFile(data, 'backup.json');

// Delete all data
await dataExportService.deleteAllDataWithConfirmation();

// Delete specific data type
await dataExportService.deleteDataTypeWithConfirmation('journal');

// Get data size
const size = await dataExportService.getDataSize();

// Verify data integrity
const result = await dataExportService.verifyDataIntegrity();
```

## 🎯 Security Context

```typescript
import {useSecurity} from './context/SecurityContext';

function MyComponent() {
  const {
    isLocked,
    isAuthenticated,
    securitySettings,
    loading,
    setupPin,
    verifyPin,
    changePin,
    disablePin,
    enableBiometric,
    disableBiometric,
    authenticateWithBiometric,
    lock,
    unlock,
    refreshSecuritySettings,
  } = useSecurity();

  // Use security features
  const handleSetupPin = async () => {
    const success = await setupPin('123456');
    if (success) {
      console.log('PIN setup successful');
    }
  };

  return (
    // Your component
  );
}
```

## 📱 Components

### PIN Lock Screen

```typescript
import PinLockScreen from './screens/PinLockScreen';

// Setup mode
<PinLockScreen
  mode="setup"
  onSuccess={() => console.log('PIN setup')}
  onCancel={() => console.log('Cancelled')}
/>

// Verify mode
<PinLockScreen
  mode="verify"
  onSuccess={() => console.log('Authenticated')}
/>

// Change mode
<PinLockScreen
  mode="change"
  onSuccess={() => console.log('PIN changed')}
  onCancel={() => console.log('Cancelled')}
/>
```

### Security Settings Screen

```typescript
import SecuritySettingsScreen from './screens/SecuritySettingsScreen';

// In navigation
<Stack.Screen
  name="SecuritySettings"
  component={SecuritySettingsScreen}
  options={{title: 'নিরাপত্তা ও গোপনীয়তা'}}
/>
```

## 🔒 Common Patterns

### Protect Sensitive Data

```typescript
// When saving journal entry
const encryptedContent = await encryptionService.encrypt(entry.content);
await storageService.saveJournalEntry({
  ...entry,
  content: encryptedContent,
});

// When reading journal entry
const entry = await storageService.getJournalEntryById(id);
const decryptedContent = await encryptionService.decrypt(entry.content);
```

### Check Authentication

```typescript
const {isAuthenticated, isLocked} = useSecurity();

if (!isAuthenticated || isLocked) {
  // Show PIN lock screen
  return <PinLockScreen mode="verify" />;
}

// Show protected content
return <ProtectedScreen />;
```

### Handle Auto-Lock

```typescript
import {AppState} from 'react-native';

useEffect(() => {
  const subscription = AppState.addEventListener('change', async (state) => {
    if (state === 'background') {
      await securityService.updateLastActivity();
    } else if (state === 'active') {
      const shouldLock = await securityService.shouldAutoLock();
      if (shouldLock) {
        lock();
      }
    }
  });

  return () => subscription.remove();
}, []);
```

### Export User Data

```typescript
const handleExport = async () => {
  const data = await dataExportService.exportDataWithConfirmation();
  if (data) {
    const filename = `backup_${Date.now()}.json`;
    await dataExportService.saveToFile(data, filename);
  }
};
```

### Delete User Data

```typescript
const handleDelete = async () => {
  const success = await dataExportService.deleteAllDataWithConfirmation();
  if (success) {
    // Navigate to onboarding
    navigation.reset({
      index: 0,
      routes: [{name: 'Onboarding'}],
    });
  }
};
```

## 🧪 Testing

### Test Encryption

```typescript
import {encryptionService} from '../encryption.service';

test('should encrypt and decrypt data', async () => {
  await encryptionService.initialize('123456');
  
  const plainText = 'Sensitive data';
  const encrypted = await encryptionService.encrypt(plainText);
  const decrypted = await encryptionService.decrypt(encrypted);
  
  expect(decrypted).toBe(plainText);
});
```

### Test Security

```typescript
import {securityService} from '../security.service';

test('should verify correct PIN', async () => {
  await securityService.setupPin('123456');
  const isValid = await securityService.verifyPin('123456');
  
  expect(isValid).toBe(true);
});
```

### Test Context

```typescript
import {renderHook, act} from '@testing-library/react-native';
import {SecurityProvider, useSecurity} from '../SecurityContext';

test('should setup PIN', async () => {
  const wrapper = ({children}) => (
    <SecurityProvider>{children}</SecurityProvider>
  );
  
  const {result} = renderHook(() => useSecurity(), {wrapper});
  
  await act(async () => {
    const success = await result.current.setupPin('123456');
    expect(success).toBe(true);
  });
});
```

## 📊 Security Settings

### Default Settings

```typescript
{
  pinEnabled: false,
  biometricEnabled: false,
  autoLockEnabled: false,
  autoLockTimeout: 300000, // 5 minutes
}
```

### Security Levels

```typescript
// Level 1: No security
{
  pinEnabled: false,
  biometricEnabled: false,
}

// Level 2: PIN only
{
  pinEnabled: true,
  biometricEnabled: false,
}

// Level 3: PIN + Biometric
{
  pinEnabled: true,
  biometricEnabled: true,
}
```

## 🎨 UI Strings (Bengali)

```typescript
const strings = {
  // PIN Lock
  enterPin: 'পিন দিয়ে প্রবেশ করুন',
  setupPin: 'পিন সেট করুন',
  confirmPin: 'পিন নিশ্চিত করুন',
  changePin: 'পিন পরিবর্তন করুন',
  wrongPin: 'ভুল পিন',
  pinMismatch: 'পিন মিলছে না',
  
  // Biometric
  useBiometric: 'বায়োমেট্রিক দিয়ে প্রবেশ করুন',
  
  // Data
  exportData: 'ডেটা এক্সপোর্ট করুন',
  deleteData: 'ডেটা মুছুন',
  deleteAllData: 'সমস্ত ডেটা মুছুন',
  
  // Security
  security: 'নিরাপত্তা ও গোপনীয়তা',
  pinLock: 'পিন লক',
  biometric: 'বায়োমেট্রিক',
};
```

## 🔧 Configuration

### Timeouts

```typescript
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes
const AUTO_LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes
```

### Storage Keys

```typescript
const STORAGE_KEYS = {
  PIN_HASH: '@quit_smoking_pin_hash',
  PIN_ENABLED: '@quit_smoking_pin_enabled',
  BIOMETRIC_ENABLED: '@quit_smoking_biometric_enabled',
  ENCRYPTION_KEY: '@quit_smoking_encryption_key',
};
```

## 📖 Documentation

- **Full Guide:** `src/services/README_SECURITY.md`
- **Installation:** `TASK_19_INSTALLATION.md`
- **Completion:** `TASK_19_COMPLETE.md`

## 🚀 Quick Commands

```bash
# Run security tests
npm test -- --testPathPattern=security

# Run encryption tests
npm test -- --testPathPattern=encryption

# Run all tests
npm test

# Type check
npx tsc --noEmit

# Lint
npm run lint
```

---

**Quick Reference Complete!** 📚
