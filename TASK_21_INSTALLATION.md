# Task 21: Accessibility Features - Installation Guide

## Overview
This guide explains how to use the accessibility features implemented in Task 21.

## No Installation Required! ✅

All accessibility features are **built-in** and work automatically. No additional packages or configuration needed.

## Features Available

### 1. Automatic Font Scaling
The app automatically respects the system font size setting.

**How to test:**
1. Go to Android Settings > Display > Font size
2. Change the font size
3. Open the app - text will scale automatically

### 2. Screen Reader Support
The app works with Android TalkBack.

**How to enable TalkBack:**
1. Go to Settings > Accessibility > TalkBack
2. Turn on TalkBack
3. Navigate the app using swipe gestures

### 3. High Contrast Colors
All colors meet WCAG 2.1 Level AA standards automatically.

**No configuration needed** - colors are optimized by default.

### 4. Large Touch Targets
All buttons and interactive elements are at least 44x44 points.

**No configuration needed** - all components use proper sizes.

### 5. Reduced Motion
The app respects the system's reduce motion preference.

**How to enable (if available):**
1. Go to Settings > Accessibility
2. Look for "Remove animations" or similar
3. Enable it - animations will be reduced

## For Developers

### Using Accessible Components

#### 1. AccessibleText
Replace regular `Text` with `AccessibleText` for automatic scaling:

```tsx
import {AccessibleText} from './components/common/AccessibleText';

// Before
<Text style={{fontSize: 16}}>হোম</Text>

// After
<AccessibleText variant="body">হোম</AccessibleText>
```

**Variants:**
- `h1` - Large heading (32px)
- `h2` - Medium heading (24px)
- `h3` - Small heading (20px)
- `body` - Body text (16px)
- `caption` - Small text (14px)
- `label` - Tiny text (12px)

#### 2. AccessibleTouchable
Use for custom touchable elements:

```tsx
import {AccessibleTouchable} from './components/common/AccessibleTouchable';

<AccessibleTouchable
  accessibilityLabel="জরুরি সাহায্য"
  accessibilityHint="ক্রেভিং ম্যানেজমেন্ট খুলতে ট্যাপ করুন"
  onPress={handlePress}>
  <Icon name="sos" />
</AccessibleTouchable>
```

#### 3. Enhanced Button
The Button component now has full accessibility:

```tsx
<Button
  title="সংরক্ষণ করুন"
  onPress={handleSave}
  accessibilityLabel="জার্নাল এন্ট্রি সংরক্ষণ করুন"
  accessibilityHint="সংরক্ষণ করতে দুইবার ট্যাপ করুন"
/>
```

#### 4. useAccessibility Hook
Access accessibility features in your components:

```tsx
import {useAccessibility} from './hooks/useAccessibility';

const MyComponent = () => {
  const {
    scaledFontSize,
    isScreenReaderEnabled,
    isReduceMotionEnabled,
    minTouchTargetSize
  } = useAccessibility();

  return (
    <Text style={{fontSize: scaledFontSize(16)}}>
      Scaled text
    </Text>
  );
};
```

### Accessibility Constants

```tsx
import {
  TOUCH_TARGET,
  A11Y_LABELS,
  A11Y_HINTS,
} from './constants/accessibility';

// Minimum touch target size
const minSize = TOUCH_TARGET.MIN_SIZE; // 44

// Accessibility labels
const label = A11Y_LABELS.HOME_TAB; // 'হোম ট্যাব'

// Accessibility hints
const hint = A11Y_HINTS.TAP_TO_OPEN; // 'খুলতে ট্যাপ করুন'
```

### Accessibility Utilities

```tsx
import {
  getProgressLabel,
  getDayCounterLabel,
  getMoneySavedLabel,
  announceForAccessibility,
} from './utils/accessibility';

// Format progress for screen reader
const label = getProgressLabel(5, 10);
// "5 এর মধ্যে 10 সম্পূর্ণ, 50 শতাংশ"

// Announce to screen reader
announceForAccessibility('কাজ সম্পূর্ণ হয়েছে');
```

## Testing Accessibility

### Test with TalkBack

1. **Enable TalkBack:**
   ```bash
   adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService
   ```

2. **Navigate the app:**
   - Swipe right to move forward
   - Swipe left to move backward
   - Double tap to activate
   - Listen to announcements

3. **Disable TalkBack:**
   ```bash
   adb shell settings put secure enabled_accessibility_services ""
   ```

### Test Font Scaling

1. **Set large font:**
   ```bash
   adb shell settings put system font_scale 1.5
   ```

2. **Test the app** - verify text scales properly

3. **Reset font:**
   ```bash
   adb shell settings put system font_scale 1.0
   ```

### Test Color Contrast

Use online tools:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)

All theme colors already meet WCAG AA standards.

### Test Touch Targets

1. **Enable layout bounds:**
   ```bash
   adb shell setprop debug.layout true
   ```

2. **Verify** all interactive elements are at least 44x44 points

3. **Disable layout bounds:**
   ```bash
   adb shell setprop debug.layout false
   ```

## Accessibility Checklist

When adding new features, ensure:

- [ ] All interactive elements have `accessibilityLabel`
- [ ] All interactive elements have `accessibilityRole`
- [ ] Touch targets are at least 44x44 points
- [ ] Text uses `scaledFontSize()` or `AccessibleText`
- [ ] Colors meet 4.5:1 contrast ratio
- [ ] Animations respect `isReduceMotionEnabled`
- [ ] Screen reader can navigate logically
- [ ] All states are announced (loading, error, success)

## Best Practices

### 1. Always Provide Labels
```tsx
// ❌ Bad
<TouchableOpacity onPress={handlePress}>
  <Icon name="home" />
</TouchableOpacity>

// ✅ Good
<TouchableOpacity
  onPress={handlePress}
  accessibilityLabel="হোম"
  accessibilityRole="button">
  <Icon name="home" />
</TouchableOpacity>
```

### 2. Use Semantic Roles
```tsx
<TouchableOpacity
  accessibilityRole="button"  // or 'link', 'header', etc.
  accessibilityLabel="সংরক্ষণ করুন">
  ...
</TouchableOpacity>
```

### 3. Provide Helpful Hints
```tsx
<Button
  title="মুছে ফেলুন"
  accessibilityLabel="জার্নাল এন্ট্রি মুছে ফেলুন"
  accessibilityHint="এই ক্রিয়া পূর্বাবস্থায় ফেরানো যাবে না"
/>
```

### 4. Scale All Text
```tsx
// ❌ Bad
<Text style={{fontSize: 16}}>টেক্সট</Text>

// ✅ Good
<AccessibleText variant="body">টেক্সট</AccessibleText>

// ✅ Also Good
const {scaledFontSize} = useAccessibility();
<Text style={{fontSize: scaledFontSize(16)}}>টেক্সট</Text>
```

### 5. Ensure Minimum Touch Targets
```tsx
// ❌ Bad
<TouchableOpacity style={{width: 30, height: 30}}>
  <Icon name="close" />
</TouchableOpacity>

// ✅ Good
<AccessibleTouchable
  accessibilityLabel="বন্ধ করুন"
  minSize={44}>
  <Icon name="close" />
</AccessibleTouchable>
```

## Troubleshooting

### Text Not Scaling
**Problem:** Text doesn't scale with system settings

**Solution:** Use `AccessibleText` or `scaledFontSize()`:
```tsx
import {useAccessibility} from './hooks/useAccessibility';
const {scaledFontSize} = useAccessibility();
<Text style={{fontSize: scaledFontSize(16)}}>টেক্সট</Text>
```

### Screen Reader Not Announcing
**Problem:** TalkBack doesn't announce element

**Solution:** Add accessibility props:
```tsx
<View
  accessible={true}
  accessibilityLabel="বর্ণনা"
  accessibilityRole="button">
  ...
</View>
```

### Touch Target Too Small
**Problem:** Element hard to tap

**Solution:** Use `AccessibleTouchable` or increase size:
```tsx
<TouchableOpacity
  style={{minWidth: 44, minHeight: 44}}
  hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
  ...
</TouchableOpacity>
```

## Resources

- **Documentation:** `src/components/common/README_ACCESSIBILITY.md`
- **Quick Reference:** `TASK_21_QUICK_REFERENCE.md`
- **Complete Report:** `TASK_21_COMPLETE.md`

### External Resources
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)

## Support

For questions or issues:
1. Check the documentation in `src/components/common/README_ACCESSIBILITY.md`
2. Review examples in `TASK_21_QUICK_REFERENCE.md`
3. Test with TalkBack to verify behavior

---

**All accessibility features are ready to use!** 🎉

No installation or configuration required - just use the accessible components and follow the best practices.
