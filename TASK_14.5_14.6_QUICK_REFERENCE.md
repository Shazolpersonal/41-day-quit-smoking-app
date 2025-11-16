# Quick Reference Guide - Tasks 14.5 & 14.6

## 🎯 Overview

This guide provides quick access to the newly implemented Data Management and Privacy & Security features.

## 📊 Task 14.5: Data Management

### Export Data
**Location**: Settings → Data Management → Export Data

**Function**: `handleExportData()`

**What it does**:
- Collects all app data (user, progress, journal, tasks, settings, cravings)
- Formats as JSON with version and timestamp
- Opens native share dialog
- Allows saving or sharing the backup

**Usage**:
```typescript
// User taps: ডেটা এক্সপোর্ট করুন
// System calls: storageService.exportAllData()
// Result: Share dialog with JSON data
```

**Error Handling**:
- Shows error if export fails
- Shows success message on completion

---

### Reset Data
**Location**: Settings → Data Management → Reset Data

**Function**: `handleResetData()`

**What it does**:
- Shows confirmation dialog with warning
- Clears all app data if confirmed
- Irreversible action

**Usage**:
```typescript
// User taps: সমস্ত ডেটা মুছে ফেলুন
// System shows: Warning dialog
// User confirms: clearUser() called
// Result: All data deleted
```

**Warning Message**:
> "আপনি কি নিশ্চিত যে আপনি সমস্ত ডেটা মুছে ফেলতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।"

---

### App Version
**Location**: Settings → About → App Version

**Display**: Shows current app version (1.0.0)

**Implementation**:
```typescript
<Text style={styles.versionText}>1.0.0</Text>
```

---

### Help
**Location**: Settings → About → Help

**Function**: `handleHelp()`

**What it does**:
- Shows dialog with app usage instructions
- Explains main features
- Provides support information

**Content**:
- Home screen explanation
- Daily tasks explanation
- Journal feature
- Progress tracking
- SOS feature

---

## 🔒 Task 14.6: Privacy & Security

### PIN Lock
**Location**: Settings → Privacy & Security → PIN Lock

**Function**: `handlePinLockToggle(value)`

**What it does**:
- Enables/disables PIN lock
- Shows PIN setup form when enabling
- Removes PIN when disabling

**PIN Requirements**:
- 4-6 digits
- Numeric only
- Must be confirmed

**Usage**:
```typescript
// Enable:
// 1. Toggle ON
// 2. Setup form appears
// 3. Enter PIN
// 4. Confirm PIN
// 5. Save

// Disable:
// 1. Toggle OFF
// 2. PIN removed
// 3. Biometric disabled
```

---

### PIN Setup
**Location**: Settings → Privacy & Security → PIN Setup Form

**Function**: `handleSavePin()`

**Validation Rules**:
1. Length: 4-6 digits
2. Format: Numeric only
3. Match: PIN must equal confirmation

**Error Messages**:
- "পিন ৪-৬ সংখ্যার হতে হবে" (Length error)
- "পিন শুধুমাত্র সংখ্যা হতে হবে" (Format error)
- "পিন মিলছে না" (Mismatch error)

**Implementation**:
```typescript
// Validation
if (!newPin || newPin.length < 4 || newPin.length > 6) {
  Alert.alert('ত্রুটি', 'পিন ৪-৬ সংখ্যার হতে হবে');
  return;
}

if (!/^\d+$/.test(newPin)) {
  Alert.alert('ত্রুটি', 'পিন শুধুমাত্র সংখ্যা হতে হবে');
  return;
}

if (newPin !== confirmPin) {
  Alert.alert('ত্রুটি', 'পিন মিলছে না');
  return;
}
```

---

### Biometric Authentication
**Location**: Settings → Privacy & Security → Biometric Authentication

**Function**: `handleBiometricToggle(value)`

**Prerequisites**:
- PIN lock must be enabled first

**What it does**:
- Enables/disables biometric authentication
- Requires PIN as fallback
- Supports fingerprint and face ID

**Usage**:
```typescript
// Enable:
// 1. Ensure PIN is enabled
// 2. Toggle ON
// 3. Save to settings

// Disable:
// 1. Toggle OFF
// 2. Save to settings
```

**Warning**:
> "বায়োমেট্রিক সক্রিয় করতে প্রথমে পিন লক সক্রিয় করুন"

---

## 🎨 UI Components

### Action Button
```typescript
<TouchableOpacity style={styles.actionButton}>
  <Text style={styles.actionButtonText}>
    📤 ডেটা এক্সপোর্ট করুন
  </Text>
  <Text style={styles.actionButtonDescription}>
    আপনার সমস্ত ডেটা ব্যাকআপ হিসেবে সংরক্ষণ করুন
  </Text>
</TouchableOpacity>
```

### Danger Button
```typescript
<TouchableOpacity 
  style={[styles.actionButton, styles.dangerButton]}>
  <Text style={[styles.actionButtonText, styles.dangerText]}>
    🗑️ সমস্ত ডেটা মুছে ফেলুন
  </Text>
</TouchableOpacity>
```

### PIN Setup Form
```typescript
<View style={styles.contactForm}>
  <Text style={styles.formTitle}>পিন সেট করুন</Text>
  <TextInput
    style={styles.input}
    value={newPin}
    onChangeText={setNewPin}
    placeholder="নতুন পিন (৪-৬ সংখ্যা)"
    keyboardType="numeric"
    secureTextEntry
    maxLength={6}
  />
  <TextInput
    style={styles.input}
    value={confirmPin}
    onChangeText={setConfirmPin}
    placeholder="পিন নিশ্চিত করুন"
    keyboardType="numeric"
    secureTextEntry
    maxLength={6}
  />
</View>
```

---

## 🔧 State Management

### State Variables
```typescript
// Privacy & Security
const [pinLock, setPinLock] = useState(false);
const [biometric, setBiometric] = useState(false);
const [showPinSetup, setShowPinSetup] = useState(false);
const [newPin, setNewPin] = useState('');
const [confirmPin, setConfirmPin] = useState('');
```

### Context Methods
```typescript
// Settings Context
const {updatePrivacy} = useSettings();

// User Context
const {clearUser} = useUser();

// Storage Service
storageService.exportAllData();
```

---

## 📱 User Flows

### Export Flow
```
Tap Export → Collect Data → Share Dialog → Save/Share → Success
```

### Reset Flow
```
Tap Reset → Warning → Confirm → Clear Data → Success
```

### PIN Setup Flow
```
Toggle ON → Form → Enter PIN → Confirm → Validate → Save → Success
```

### Biometric Flow
```
Check PIN → Toggle ON → Save → Success
```

---

## 🧪 Testing

### Test Export
```typescript
it('exports data successfully', async () => {
  const {getByText} = render(<SettingsScreen />);
  const exportButton = getByText(/ডেটা এক্সপোর্ট করুন/);
  fireEvent.press(exportButton);
  await waitFor(() => {
    expect(mockShare).toHaveBeenCalled();
  });
});
```

### Test PIN Setup
```typescript
it('saves PIN successfully', async () => {
  const {getByPlaceholderText, getByText} = render(<SettingsScreen />);
  fireEvent.changeText(getByPlaceholderText(/নতুন পিন/), '1234');
  fireEvent.changeText(getByPlaceholderText(/পিন নিশ্চিত/), '1234');
  fireEvent.press(getByText('সংরক্ষণ করুন'));
  await waitFor(() => {
    expect(mockUpdatePrivacy).toHaveBeenCalledWith({
      pinLock: true,
      pin: '1234',
    });
  });
});
```

---

## 🌐 Bangla Text Reference

| English | Bangla |
|---------|--------|
| Data Management | ডেটা ম্যানেজমেন্ট |
| Export Data | ডেটা এক্সপোর্ট করুন |
| Delete All Data | সমস্ত ডেটা মুছে ফেলুন |
| Privacy & Security | প্রাইভেসি ও নিরাপত্তা |
| PIN Lock | পিন লক |
| Biometric Authentication | বায়োমেট্রিক প্রমাণীকরণ |
| New PIN | নতুন পিন |
| Confirm PIN | পিন নিশ্চিত করুন |
| App Version | অ্যাপ ভার্সন |
| Help | সাহায্য |
| Success | সফল |
| Error | ত্রুটি |
| Warning | সতর্কতা |
| Cancel | বাতিল |
| Save | সংরক্ষণ করুন |

---

## 📞 Quick Troubleshooting

### Export not working?
- Check Share API permissions
- Verify storageService.exportAllData() returns data
- Check console for errors

### Reset not clearing data?
- Verify clearUser() is called
- Check AsyncStorage permissions
- Verify confirmation dialog works

### PIN not saving?
- Check validation logic
- Verify updatePrivacy() is called
- Check SettingsContext

### Biometric disabled?
- Ensure PIN lock is enabled first
- Check warning message displays
- Verify toggle state

---

## ✅ Checklist

Quick verification checklist:

- [ ] Export data works
- [ ] Reset shows confirmation
- [ ] App version displays
- [ ] Help dialog works
- [ ] PIN setup form appears
- [ ] PIN validation works
- [ ] PIN saves successfully
- [ ] Biometric requires PIN
- [ ] All text in Bangla
- [ ] Error handling works

---

**Quick Reference Version**: 1.0
**Last Updated**: November 16, 2025
**Tasks**: 14.5 & 14.6
