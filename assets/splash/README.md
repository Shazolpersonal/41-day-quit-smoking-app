# Splash Screen Assets

This directory contains splash screen assets for the 41-day quit smoking app.

## Splash Screen Design

### Layout
```
┌─────────────────────────────────┐
│                                 │
│                                 │
│         ┌─────────┐            │
│         │         │            │
│         │   ☪️    │            │  ← Logo (white circle)
│         │         │            │
│         └─────────┘            │
│                                 │
│    ৪১ দিনে ধূমপান মুক্তি       │  ← App name
│    ইসলামিক পথনির্দেশনা সহ      │  ← Subtitle
│                                 │
│    আল্লাহর সাহায্যে সফলতা      │  ← Tagline
│                                 │
│                                 │
│         সংস্করণ ১.০.০          │  ← Version
└─────────────────────────────────┘
```

### Colors
- **Background:** #2E7D32 (Primary Green)
- **Logo Container:** #FFFFFF (White)
- **Text:** #FFFFFF (White)
- **Tagline:** #D4AF37 (Gold)

### Typography
- **App Name:** 32px, Bold, White
- **Subtitle:** 16px, Regular, White (90% opacity)
- **Tagline:** 16px, Semibold, Gold
- **Version:** 12px, Regular, White (70% opacity)

## Implementation

### React Native Splash Screen

The splash screen is implemented as a React component in `src/screens/SplashScreen.tsx`.

**Features:**
- Animated logo entrance
- Fade-in effect
- Scale animation
- Configurable timeout
- Callback on finish

**Usage:**
```tsx
<SplashScreen
  onFinish={() => {
    // Navigate to main app
  }}
  timeout={2500}
/>
```

### Native Splash Screen (Android)

For instant splash screen on app launch, configure native splash screen:

#### 1. Install Package
```bash
npm install react-native-splash-screen
```

#### 2. Android Configuration

**android/app/src/main/res/drawable/launch_screen.xml:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_logo"/>
    </item>
</layer-list>
```

**android/app/src/main/res/values/colors.xml:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splash_background">#2E7D32</color>
</resources>
```

**android/app/src/main/res/values/styles.xml:**
```xml
<resources>
    <style name="SplashTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:windowBackground">@drawable/launch_screen</item>
        <item name="android:statusBarColor">@color/splash_background</item>
    </style>
</resources>
```

**android/app/src/main/AndroidManifest.xml:**
```xml
<activity
    android:name=".SplashActivity"
    android:theme="@style/SplashTheme"
    android:label="@string/app_name">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
<activity
    android:name=".MainActivity"
    android:label="@string/app_name">
</activity>
```

## Animation Details

### Logo Animation
- **Duration:** 800ms
- **Type:** Parallel (fade + scale)
- **Fade:** 0 → 1 opacity
- **Scale:** 0.8 → 1.0
- **Easing:** Spring animation

### Timeout
- **Default:** 2500ms (2.5 seconds)
- **Minimum:** 1500ms (1.5 seconds)
- **Maximum:** 3000ms (3 seconds)

## Accessibility

### Screen Reader Support
```tsx
<View
  accessible={true}
  accessibilityLabel="৪১ দিনে ধূমপান মুক্তি অ্যাপ লোড হচ্ছে"
  accessibilityRole="none">
```

### Reduced Motion
The splash screen respects the user's reduced motion preference:
```tsx
const shouldAnimate = !isReduceMotionEnabled;
```

## Testing

### Test Checklist
- [ ] Splash screen displays correctly
- [ ] Logo animates smoothly
- [ ] Text is readable
- [ ] Colors match brand
- [ ] Timeout works correctly
- [ ] Transitions to main app
- [ ] Works on different screen sizes
- [ ] Works on different Android versions

### Test Scenarios
1. **First Launch:** Splash → Onboarding
2. **Subsequent Launch:** Splash → Home
3. **Slow Device:** Ensure smooth animation
4. **Fast Device:** Ensure minimum display time

## Assets Required

### Logo Image
- **Size:** 512x512px
- **Format:** PNG with transparency
- **Content:** White circle with crescent and star
- **Location:** `assets/splash/logo.png`

### Background
- **Color:** #2E7D32 (solid color, no image needed)

## Platform-Specific Notes

### Android
- Use native splash screen for instant display
- Configure theme in styles.xml
- Use layer-list drawable for layout
- Support different screen densities

### iOS (Future)
- Use LaunchScreen.storyboard
- Configure in Xcode
- Support different device sizes
- Use asset catalog for images

## Performance

### Optimization Tips
1. **Keep it simple** - Avoid complex animations
2. **Use native splash** - For instant display
3. **Optimize images** - Compress logo image
4. **Minimize timeout** - Don't keep users waiting
5. **Preload data** - Use splash time to initialize

### Loading Strategy
```tsx
useEffect(() => {
  // Preload data during splash
  Promise.all([
    loadUser(),
    loadSettings(),
    loadProgress(),
  ]).then(() => {
    onFinish();
  });
}, []);
```

## Branding

### App Name
- **Primary:** ৪১ দিনে ধূমপান মুক্তি
- **English:** 41 Days Quit Smoking
- **Short:** ধূমপান মুক্তি

### Tagline Options
- আল্লাহর সাহায্যে সফলতা (Success with Allah's help)
- ইসলামিক পথনির্দেশনা সহ (With Islamic guidance)
- স্বাস্থ্যকর জীবনের শুরু (Start of healthy life)

## Updates

### Version Updates
Update version number in:
1. Splash screen component
2. package.json
3. android/app/build.gradle
4. About screen

### Design Updates
When updating splash screen:
1. Update component
2. Update native splash
3. Test on devices
4. Update screenshots
5. Update documentation

## Resources

- [React Native Splash Screen](https://github.com/crazycodeboy/react-native-splash-screen)
- [Android Splash Screens](https://developer.android.com/guide/topics/ui/splash-screen)
- [Material Design Launch Screen](https://material.io/design/communication/launch-screen.html)
