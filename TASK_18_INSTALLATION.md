# 📦 Task 18.1 Installation Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Audio Libraries

```bash
npm install react-native-sound@^0.11.2 react-native-track-player@^4.0.1
```

### 3. Link Native Modules (iOS)

```bash
cd ios
pod install
cd ..
```

### 4. Setup Audio Files

#### For Android:

```bash
# Create raw resources directory
mkdir -p android/app/src/main/res/raw

# Copy audio files (when available)
# cp assets/audio/*.mp3 android/app/src/main/res/raw/
```

#### For iOS:

1. Open Xcode project
2. Right-click on project → "Add Files to [ProjectName]"
3. Select audio files from `assets/audio/`
4. Check "Copy items if needed"
5. Add to target: QuitSmokingApp

### 5. Run the App

```bash
# Android
npm run android

# iOS
npm run ios
```

## Testing the Feature

### 1. Navigate to Duas

From Home Screen → Tap "দোয়া" button

### 2. Browse Duas

- View all 10 duas
- Search by keyword
- Filter by category
- Tap any dua to view details

### 3. Test Audio Player

- Tap play button (UI only, audio files needed)
- Test pause/stop controls
- Check progress bar

## Troubleshooting

### Audio Not Playing

**Issue:** Audio player shows but doesn't play sound

**Solution:** Audio files need to be added to the project. See audio setup instructions in `assets/audio/README.md`

### Build Errors

**Issue:** Native module linking errors

**Solution:**
```bash
# Clean and rebuild
cd android && ./gradlew clean && cd ..
npm run android

# For iOS
cd ios && pod install && cd ..
npm run ios
```

### Navigation Errors

**Issue:** Cannot navigate to DuaList

**Solution:** Ensure RootNavigator is properly configured and app is restarted

## Next Steps

1. Add actual audio files to `assets/audio/`
2. Implement actual audio playback in `audio.service.ts`
3. Test audio playback on device
4. Implement share functionality
5. Add favorites persistence

## Support

For issues or questions, refer to:
- `TASK_18.1_COMPLETE.md` - Full documentation
- `assets/audio/README.md` - Audio setup guide
- `src/components/islamic/README.md` - Component documentation
