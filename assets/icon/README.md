# App Icon Assets

This directory contains the app icon assets for the 41-day quit smoking app.

## Icon Design

### Theme
- **Islamic-themed** with crescent and star
- **Green color** (#2E7D32) - represents Islam and nature
- **Gold accents** (#D4AF37) - represents purity and value
- **Clean and modern** design

### Concept
The app icon features:
- Islamic crescent moon and star symbol (☪️)
- Green background (primary brand color)
- White circular container for the symbol
- Clean, minimalist design
- Easily recognizable at all sizes

## Required Sizes

### Android
Create the following sizes for Android:

```
android/app/src/main/res/
├── mipmap-mdpi/ic_launcher.png (48x48)
├── mipmap-hdpi/ic_launcher.png (72x72)
├── mipmap-xhdpi/ic_launcher.png (96x96)
├── mipmap-xxhdpi/ic_launcher.png (144x144)
├── mipmap-xxxhdpi/ic_launcher.png (192x192)
└── mipmap-xxxhdpi/ic_launcher_round.png (192x192)
```

### iOS (if needed in future)
```
ios/QuitSmokingApp/Images.xcassets/AppIcon.appiconset/
├── Icon-20@2x.png (40x40)
├── Icon-20@3x.png (60x60)
├── Icon-29@2x.png (58x58)
├── Icon-29@3x.png (87x87)
├── Icon-40@2x.png (80x80)
├── Icon-40@3x.png (120x120)
├── Icon-60@2x.png (120x120)
├── Icon-60@3x.png (180x180)
├── Icon-1024.png (1024x1024)
```

## Design Specifications

### Colors
- **Background:** #2E7D32 (Primary Green)
- **Icon Container:** #FFFFFF (White)
- **Symbol:** ☪️ (Crescent and Star emoji)
- **Accent:** #D4AF37 (Gold)

### Typography
- **App Name:** ৪১ দিনে ধূমপান মুক্তি
- **Subtitle:** ইসলামিক পথনির্দেশনা সহ

### Layout
```
┌─────────────────────┐
│                     │
│    ┌─────────┐     │
│    │         │     │
│    │   ☪️    │     │  ← White circle with crescent
│    │         │     │
│    └─────────┘     │
│                     │
│  ৪১ দিনে ধূমপান    │  ← App name in Bangla
│      মুক্তি         │
│                     │
└─────────────────────┘
```

## Creating Icons

### Option 1: Using Design Tools
1. Use Figma, Adobe Illustrator, or Sketch
2. Create a 1024x1024 canvas
3. Add green background (#2E7D32)
4. Add white circle (centered)
5. Add crescent and star symbol
6. Export at required sizes

### Option 2: Using Icon Generator
1. Create base 1024x1024 icon
2. Use online tools:
   - [App Icon Generator](https://appicon.co/)
   - [MakeAppIcon](https://makeappicon.com/)
   - [Icon Kitchen](https://icon.kitchen/)

### Option 3: Using React Native Asset Generator
```bash
# Install generator
npm install -g react-native-asset

# Generate icons from base image
react-native-asset
```

## Implementation

### Android Configuration

Update `android/app/src/main/AndroidManifest.xml`:
```xml
<application
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:label="৪১ দিনে ধূমপান মুক্তি">
```

### Adaptive Icons (Android 8.0+)

Create adaptive icon layers:
```
android/app/src/main/res/
├── mipmap-anydpi-v26/
│   ├── ic_launcher.xml
│   └── ic_launcher_round.xml
├── drawable/
│   ├── ic_launcher_background.xml
│   └── ic_launcher_foreground.xml
```

## Testing

### Test Icon Visibility
1. Install app on device
2. Check home screen icon
3. Verify icon in app drawer
4. Check notification icon
5. Test on different Android versions
6. Verify on different screen densities

### Checklist
- [ ] Icon visible on home screen
- [ ] Icon clear at all sizes
- [ ] Colors match brand
- [ ] Islamic theme appropriate
- [ ] Bangla text readable (if included)
- [ ] Round icon variant created
- [ ] Adaptive icon configured

## Brand Guidelines

### Do's
✅ Use official brand colors
✅ Maintain Islamic theme
✅ Keep design simple and clean
✅ Ensure good contrast
✅ Test on real devices

### Don'ts
❌ Don't use copyrighted images
❌ Don't make icon too complex
❌ Don't use low-quality images
❌ Don't ignore platform guidelines
❌ Don't forget round icon variant

## Resources

- [Android Icon Guidelines](https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher)
- [Material Design Icons](https://material.io/design/iconography)
- [Islamic Symbols](https://en.wikipedia.org/wiki/Star_and_crescent)
- [App Icon Generator Tools](https://appicon.co/)

## Notes

- The crescent and star (☪️) is a widely recognized Islamic symbol
- Green is the traditional color of Islam
- The design should be respectful and appropriate
- Consider cultural sensitivities
- Test with target audience for feedback
