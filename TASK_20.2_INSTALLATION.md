# Task 20.2 - Haptic Feedback Installation Guide

## Installation Steps

### 1. Install Dependencies

```bash
npm install react-native-haptic-feedback
# or
yarn add react-native-haptic-feedback
```

### 2. iOS Setup

For iOS, install pods:

```bash
cd ios
pod install
cd ..
```

### 3. Android Setup

No additional setup required for Android. The library works out of the box.

### 4. Permissions

#### Android
Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.VIBRATE" />
```

#### iOS
No permissions required.

### 5. Verify Installation

Run the app and test haptic feedback:

```bash
npm run android
# or
npm run ios
```

## Testing Haptic Feedback

1. **Button Press**: Tap any button in the app
2. **Task Completion**: Complete a daily task
3. **Milestone Achievement**: Reach a milestone day
4. **SOS Button**: Press the SOS button on home screen

## Troubleshooting

### Haptic Not Working

1. **Check Settings**: Ensure haptic is enabled in Settings > Appearance
2. **Device Support**: Test on a real device (not simulator/emulator)
3. **System Settings**: Check device's haptic/vibration settings
4. **Permissions**: Verify VIBRATE permission is granted on Android

### Build Errors

If you encounter build errors:

```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..

# For iOS
cd ios
pod deintegrate
pod install
cd ..
```

## Configuration

Haptic feedback can be configured in:
- **Settings Screen**: Toggle haptic on/off
- **SettingsContext**: Programmatically enable/disable
- **Haptic Service**: Customize feedback types

## Files Created/Modified

### New Files
- `src/services/haptic.service.ts` - Haptic feedback service
- `src/services/__tests__/haptic.service.test.ts` - Service tests
- `src/hooks/useHaptic.ts` - Haptic hook with settings integration
- `src/services/README_HAPTIC.md` - Documentation

### Modified Files
- `package.json` - Added react-native-haptic-feedback dependency
- `src/components/common/Button.tsx` - Added haptic on button press
- `src/components/daily/TaskItem.tsx` - Added haptic on task completion
- `src/components/home/MilestoneCelebration.tsx` - Added haptic on milestone
- `src/components/home/QuickActions.tsx` - Added haptic on SOS and actions

## Next Steps

After installation:
1. Test all haptic feedback points
2. Adjust haptic intensity if needed
3. Gather user feedback on haptic experience
4. Consider adding more haptic feedback points
