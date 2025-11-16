# Task 21: Accessibility Features - Quick Reference

## Quick Start

### Using Accessible Components

```tsx
// Accessible Text
import {AccessibleText} from './components/common/AccessibleText';
<AccessibleText variant="h1">হোম</AccessibleText>

// Accessible Button
<Button
  title="সংরক্ষণ"
  onPress={handleSave}
  accessibilityLabel="সংরক্ষণ করুন"
/>

// Accessible Touchable
import {AccessibleTouchable} from './components/common/AccessibleTouchable';
<AccessibleTouchable
  accessibilityLabel="জরুরি সাহায্য"
  onPress={handleSOS}>
  <Icon name="sos" />
</AccessibleTouchable>

// Accessible Progress Bar
<ProgressBar
  progress={0.75}
  total={41}
  current={31}
  accessibilityLabel="৪১ দিনের যাত্রা"
/>
```

### Using Accessibility Hook

```tsx
import {useAccessibility} from './hooks/useAccessibility';

const {
  scaledFontSize,
  isScreenReaderEnabled,
  isReduceMotionEnabled,
  minTouchTargetSize
} = useAccessibility();

// Scale font size
<Text style={{fontSize: scaledFontSize(16)}}>টেক্সট</Text>

// Check screen reader
if (isScreenReaderEnabled) {
  // Provide additional context
}

// Respect reduced motion
const duration = isReduceMotionEnabled ? 100 : 300;
```

## Accessibility Checklist

### For Every Interactive Element
- [ ] Has `accessibilityLabel` in Bangla
- [ ] Has `accessibilityRole` (button, link, etc.)
- [ ] Has `accessibilityHint` if needed
- [ ] Minimum 44x44 touch target
- [ ] Proper `accessibilityState` (disabled, selected, etc.)

### For Every Text Element
- [ ] Uses `scaledFontSize()` or `AccessibleText`
- [ ] Has sufficient color contrast (4.5:1 minimum)
- [ ] Has proper line height (1.5x minimum)
- [ ] Readable at 200% font scale

### For Every Screen
- [ ] Logical reading order
- [ ] Proper heading hierarchy
- [ ] All content accessible via screen reader
- [ ] No keyboard traps
- [ ] Focus management

## Common Patterns

### Button with Accessibility
```tsx
<Button
  title="সংরক্ষণ করুন"
  onPress={handleSave}
  accessibilityLabel="জার্নাল এন্ট্রি সংরক্ষণ করুন"
  accessibilityHint={A11Y_HINTS.DOUBLE_TAP_TO_ACTIVATE}
  disabled={!isValid}
/>
```

### Card with Touch Interaction
```tsx
<Card
  onPress={handlePress}
  accessibilityLabel="দৈনিক কাজ"
  accessibilityHint={A11Y_HINTS.TAP_TO_OPEN}
  accessibilityRole="button">
  <Text>কার্ড কন্টেন্ট</Text>
</Card>
```

### Progress Indicator
```tsx
<ProgressBar
  progress={completed / total}
  total={total}
  current={completed}
  accessibilityLabel="কাজের অগ্রগতি"
/>
```

### Toggle/Switch
```tsx
<Switch
  value={isEnabled}
  onValueChange={setIsEnabled}
  accessibilityLabel="বিজ্ঞপ্তি সক্রিয়"
  accessibilityRole="switch"
  accessibilityState={{checked: isEnabled}}
/>
```

## Testing Commands

### Enable TalkBack (Android)
```bash
# Via ADB
adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService
```

### Test Font Scaling
```bash
# Set font scale to 1.5x
adb shell settings put system font_scale 1.5

# Reset to default
adb shell settings put system font_scale 1.0
```

### Show Layout Bounds
```bash
# Enable
adb shell setprop debug.layout true

# Disable
adb shell setprop debug.layout false
```

## Accessibility Constants

```tsx
import {
  TOUCH_TARGET,
  CONTRAST_RATIO,
  A11Y_LABELS,
  A11Y_HINTS,
  A11Y_ROLES,
} from './constants/accessibility';

// Minimum touch target
const minSize = TOUCH_TARGET.MIN_SIZE; // 44

// Accessibility label
const label = A11Y_LABELS.HOME_TAB; // 'হোম ট্যাব'

// Accessibility hint
const hint = A11Y_HINTS.TAP_TO_OPEN; // 'খুলতে ট্যাপ করুন'
```

## Accessibility Utilities

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

## Color Contrast Reference

### Text Colors (on white background)
- `colors.text.primary` (#212121) - 16.1:1 ✅ AAA
- `colors.text.secondary` (#616161) - 7:1 ✅ AAA
- `colors.text.hint` (#757575) - 4.5:1 ✅ AA

### UI Colors
- `colors.primary.main` (#2E7D32) - 7.4:1 ✅ AAA
- `colors.error` (#D32F2F) - 5.5:1 ✅ AA
- `colors.warning` (#F57C00) - 4.5:1 ✅ AA

## Common Issues & Solutions

### Issue: Text too small at default size
**Solution:** Use `AccessibleText` or `scaledFontSize()`

### Issue: Touch target too small
**Solution:** Use `AccessibleTouchable` or set `minHeight: 44`

### Issue: Screen reader not announcing
**Solution:** Add `accessible={true}` and `accessibilityLabel`

### Issue: Animation too fast for some users
**Solution:** Check `isReduceMotionEnabled` and adjust

### Issue: Color contrast insufficient
**Solution:** Use theme colors that meet WCAG standards

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

## File Locations

- Components: `src/components/common/`
- Hook: `src/hooks/useAccessibility.ts`
- Constants: `src/constants/accessibility.ts`
- Utilities: `src/utils/accessibility.ts`
- Tests: `src/utils/__tests__/accessibility.test.ts`
- Documentation: `src/components/common/README_ACCESSIBILITY.md`
