# Bangla Font Setup Guide

## Noto Sans Bengali Font Installation

This app uses **Noto Sans Bengali** font for proper Bangla text rendering.

### Step 1: Download Fonts

1. Visit [Google Fonts - Noto Sans Bengali](https://fonts.google.com/noto/specimen/Noto+Sans+Bengali)
2. Click "Download family" button
3. Extract the downloaded ZIP file

### Step 2: Copy Font Files

Copy the following font files to `src/assets/fonts/`:

- `NotoSansBengali-Regular.ttf`
- `NotoSansBengali-Medium.ttf`
- `NotoSansBengali-Bold.ttf`

You can find these files in the extracted folder under `static/` directory.

### Step 3: Link Fonts to Native Projects

After placing the font files, run:

```bash
npx react-native-asset
```

This command will automatically link the fonts to both Android and iOS projects.

### Step 4: Verify Installation

#### For Android:
Check that font files are copied to:
- `android/app/src/main/assets/fonts/`

#### For iOS:
1. Check that fonts are listed in `ios/QuitSmokingApp/Info.plist` under `UIAppFonts`
2. Verify fonts are added to Xcode project

### Step 5: Use Fonts in Code

```typescript
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  text: {
    fontFamily: 'NotoSansBengali-Regular',
  },
  boldText: {
    fontFamily: 'NotoSansBengali-Bold',
  },
  mediumText: {
    fontFamily: 'NotoSansBengali-Medium',
  },
});
```

### Troubleshooting

If fonts don't appear correctly:

1. **Clean and rebuild:**
   ```bash
   # Android
   cd android && ./gradlew clean && cd ..
   npm run android
   
   # iOS
   cd ios && pod install && cd ..
   npm run ios
   ```

2. **Verify font names:**
   - Font family names must match exactly (case-sensitive)
   - Use the actual font name, not the file name

3. **Check file placement:**
   - Ensure fonts are in `src/assets/fonts/`
   - Verify `react-native.config.js` includes the fonts path

## Alternative: System Fonts

If you encounter issues with custom fonts, you can temporarily use system fonts:

```typescript
// For Android
fontFamily: 'sans-serif'

// For iOS
fontFamily: 'System'
```

However, custom Bangla fonts are recommended for better text rendering.
