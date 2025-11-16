# Task 23: Splash Screen and App Icon - Quick Reference

## Quick Start

### Use Splash Screen
```tsx
import {SplashScreen} from './screens/SplashScreen';

<SplashScreen
  onFinish={() => navigation.replace('Home')}
  timeout={2500}
/>
```

### Custom Timeout
```tsx
<SplashScreen
  onFinish={handleFinish}
  timeout={3000} // 3 seconds
/>
```

### With Data Loading
```tsx
<SplashScreen
  onFinish={async () => {
    await loadData();
    navigation.replace('Home');
  }}
/>
```

## Design Specifications

### App Icon
- **Symbol:** ☪️ (Crescent and Star)
- **Background:** #2E7D32 (Green)
- **Container:** #FFFFFF (White circle)
- **Size:** 1024x1024 base

### Splash Screen
- **Background:** #2E7D32 (Green)
- **Logo:** White circle with ☪️
- **Text:** White
- **Tagline:** #D4AF37 (Gold)

## Colors

```tsx
Primary Green: #2E7D32
Secondary Gold: #D4AF37
White: #FFFFFF
Text: #FFFFFF
```

## Text Content

### App Name
```
৪১ দিনে ধূমপান মুক্তি
```

### Subtitle
```
ইসলামিক পথনির্দেশনা সহ
```

### Tagline
```
আল্লাহর সাহায্যে সফলতা
```

### Version
```
সংস্করণ ১.০.০
```

## Animation

### Logo Animation
- **Duration:** 800ms
- **Fade:** 0 → 1
- **Scale:** 0.8 → 1.0
- **Type:** Spring

### Timing
- **Animation:** 800ms
- **Total Display:** 2500ms
- **Min:** 1500ms
- **Max:** 3000ms

## Android Icon Sizes

```
mipmap-mdpi/ic_launcher.png (48x48)
mipmap-hdpi/ic_launcher.png (72x72)
mipmap-xhdpi/ic_launcher.png (96x96)
mipmap-xxhdpi/ic_launcher.png (144x144)
mipmap-xxxhdpi/ic_launcher.png (192x192)
```

## Android Configuration

### strings.xml
```xml
<string name="app_name">৪১ দিনে ধূমপান মুক্তি</string>
```

### colors.xml
```xml
<color name="splash_background">#2E7D32</color>
```

### styles.xml
```xml
<style name="SplashTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="android:windowBackground">@drawable/launch_screen</item>
</style>
```

## Component Props

```tsx
interface SplashScreenProps {
  onFinish: () => void;
  timeout?: number; // default: 2500
}
```

## Testing

### Run Tests
```bash
npm test -- SplashScreen.test.tsx
```

### Test Cases
- ✅ Renders correctly
- ✅ Displays logo
- ✅ Shows text content
- ✅ Calls onFinish after timeout
- ✅ Cleans up timer

## Icon Creation

### 1. Design Tool
- Create 1024x1024 canvas
- Add green background
- Add white circle
- Add crescent symbol
- Export PNG

### 2. Generate Sizes
Use online tools:
- [appicon.co](https://appicon.co/)
- [makeappicon.com](https://makeappicon.com/)

### 3. Add to Project
```
android/app/src/main/res/
├── mipmap-mdpi/
├── mipmap-hdpi/
├── mipmap-xhdpi/
├── mipmap-xxhdpi/
└── mipmap-xxxhdpi/
```

## File Locations

- Component: `src/screens/SplashScreen.tsx`
- Tests: `src/screens/__tests__/SplashScreen.test.tsx`
- Icon Guide: `assets/icon/README.md`
- Splash Guide: `assets/splash/README.md`
- Android Strings: `android/app/src/main/res/values/strings.xml`
- Android Colors: `android/app/src/main/res/values/colors.xml`
- Android Styles: `android/app/src/main/res/values/styles.xml`

## Common Issues

### Splash Not Showing
**Problem:** Splash screen doesn't display

**Solution:** Check timeout and onFinish callback:
```tsx
<SplashScreen
  onFinish={() => console.log('Finished')}
  timeout={2500}
/>
```

### Animation Not Smooth
**Problem:** Animation stutters

**Solution:** Use `useNativeDriver: true`:
```tsx
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 800,
  useNativeDriver: true,
}).start();
```

### Text Not Visible
**Problem:** Bangla text not rendering

**Solution:** Ensure Bangla font is configured

## Best Practices

1. ✅ Keep timeout reasonable (2-3 seconds)
2. ✅ Use simple animations
3. ✅ Preload data during splash
4. ✅ Test on real devices
5. ✅ Optimize logo image
6. ✅ Support all screen sizes
7. ✅ Use native splash for instant display

## Resources

- Icon Guide: `assets/icon/README.md`
- Splash Guide: `assets/splash/README.md`
- Complete Report: `TASK_23_COMPLETE.md`
- Android Guidelines: [developer.android.com](https://developer.android.com/guide/topics/ui/splash-screen)
