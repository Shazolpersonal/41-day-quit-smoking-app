# Accessibility Components

This directory contains accessible UI components that follow WCAG 2.1 Level AA guidelines.

## Components

### AccessibleText
Text component with automatic font scaling and accessibility support.

**Features:**
- Automatic font scaling based on system settings
- Support for bold text preference
- Proper accessibility labels
- Multiple text variants (h1, h2, h3, body, caption, label)

**Usage:**
```tsx
<AccessibleText variant="h1" bold>
  হোম স্ক্রিন
</AccessibleText>

<AccessibleText variant="body" color={colors.text.secondary}>
  আপনার অগ্রগতি দেখুন
</AccessibleText>
```

### AccessibleTouchable
Touchable component with proper accessibility support and minimum touch target size.

**Features:**
- Minimum touch target size (44x44 points)
- Proper hit slop for easier tapping
- Accessibility role and labels
- Disabled state support

**Usage:**
```tsx
<AccessibleTouchable
  accessibilityLabel="জরুরি সাহায্য"
  accessibilityHint="ক্রেভিং ম্যানেজমেন্ট স্ক্রিন খুলতে ট্যাপ করুন"
  onPress={handleSOSPress}>
  <Icon name="sos" />
</AccessibleTouchable>
```

### Button (Enhanced)
Button component with full accessibility support.

**Features:**
- Minimum touch target sizes for all sizes
- Accessibility labels and hints
- Loading state announcements
- Disabled state support
- Haptic feedback

**Usage:**
```tsx
<Button
  title="সংরক্ষণ করুন"
  onPress={handleSave}
  accessibilityLabel="জার্নাল এন্ট্রি সংরক্ষণ করুন"
  accessibilityHint="সংরক্ষণ করতে দুইবার ট্যাপ করুন"
/>
```

### Card (Enhanced)
Card component with optional touch interaction and accessibility.

**Features:**
- Proper accessibility labels for interactive cards
- Touch target optimization
- Accessibility role support

**Usage:**
```tsx
<Card
  onPress={handlePress}
  accessibilityLabel="দৈনিক কাজ"
  accessibilityHint="বিস্তারিত দেখতে ট্যাপ করুন"
  accessibilityRole="button">
  <Text>কার্ড কন্টেন্ট</Text>
</Card>
```

### ProgressBar (Enhanced)
Progress bar with accessibility announcements.

**Features:**
- Accessibility value announcements
- Reduced motion support
- Proper progress labels in Bangla
- Font scaling support

**Usage:**
```tsx
<ProgressBar
  progress={0.75}
  total={41}
  current={31}
  showPercentage
  accessibilityLabel="৪১ দিনের যাত্রা"
/>
```

## Accessibility Features

### 1. Touch Target Sizes
All interactive elements meet the minimum touch target size of 44x44 points (WCAG 2.1 Success Criterion 2.5.5).

### 2. Color Contrast
All text and UI components meet WCAG 2.1 Level AA contrast ratios:
- Normal text: 4.5:1
- Large text: 3:1
- UI components: 3:1

### 3. Font Scaling
All text components support system font size settings up to 200%.

### 4. Screen Reader Support
All components have proper:
- Accessibility labels in Bangla
- Accessibility hints
- Accessibility roles
- Accessibility states

### 5. Reduced Motion
Components respect the user's reduced motion preference:
- Animations are shortened or disabled
- Transitions are simplified

### 6. Keyboard Navigation
All interactive elements are keyboard accessible (for future Android TV support).

## Testing Accessibility

### Screen Reader Testing
1. Enable TalkBack on Android
2. Navigate through the app
3. Verify all elements are announced correctly
4. Check that hints are helpful

### Font Scaling Testing
1. Go to Settings > Display > Font size
2. Set to largest size
3. Verify all text is readable
4. Check that layouts don't break

### Color Contrast Testing
Use tools like:
- WebAIM Contrast Checker
- Colour Contrast Analyser
- Chrome DevTools

### Touch Target Testing
1. Use Android's "Show layout bounds" in Developer Options
2. Verify all interactive elements are at least 44x44 points
3. Check spacing between touch targets

## Accessibility Constants

See `src/constants/accessibility.ts` for:
- Touch target sizes
- Contrast ratios
- Font scale limits
- Animation durations
- Accessibility labels in Bangla
- Accessibility hints in Bangla

## Accessibility Utilities

See `src/utils/accessibility.ts` for helper functions:
- `getProgressLabel()` - Format progress for screen readers
- `getDayCounterLabel()` - Format day counter
- `getMoneySavedLabel()` - Format money amounts
- `getTimeDurationLabel()` - Format time durations
- `getTaskCompletionLabel()` - Format task completion
- `getMilestoneBadgeLabel()` - Format milestone badges
- `getCravingIntensityLabel()` - Format craving intensity
- `announceForAccessibility()` - Announce to screen reader

## Best Practices

1. **Always provide accessibility labels** for interactive elements
2. **Use semantic roles** (button, link, header, etc.)
3. **Provide helpful hints** for complex interactions
4. **Test with TalkBack** regularly during development
5. **Support font scaling** in all text components
6. **Ensure sufficient contrast** for all text and UI elements
7. **Meet minimum touch target sizes** for all interactive elements
8. **Respect reduced motion** preferences
9. **Use proper heading hierarchy** for screen readers
10. **Test with real users** who use assistive technologies

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Android Accessibility](https://developer.android.com/guide/topics/ui/accessibility)
- [Material Design Accessibility](https://material.io/design/usability/accessibility.html)
