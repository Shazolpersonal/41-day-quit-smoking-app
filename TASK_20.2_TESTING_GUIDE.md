# Task 20.2 - Haptic Feedback Testing Guide

## 🧪 Testing Checklist

Use this guide to verify all haptic feedback functionality is working correctly.

## Prerequisites

✅ App installed on a **real device** (haptic doesn't work in simulators)
✅ Device haptic/vibration is enabled in system settings
✅ App haptic feedback is enabled in Settings > Appearance

## Test Cases

### 1. Button Press Haptic ✅

**Test**: Tap any button in the app

**Expected**: Light haptic feedback on every button press

**Test Locations**:
- [ ] Home screen buttons
- [ ] Settings screen buttons
- [ ] Daily content screen buttons
- [ ] Journal screen buttons
- [ ] Progress screen buttons

**Result**: ___________

---

### 2. Task Completion Haptic ✅

**Test**: Complete a daily task

**Steps**:
1. Go to Daily Content screen
2. Tap on an uncompleted task checkbox
3. Feel for haptic feedback

**Expected**: Success haptic feedback when task is marked complete

**Test Cases**:
- [ ] Complete first task
- [ ] Complete multiple tasks
- [ ] Uncomplete a task (should not trigger haptic)

**Result**: ___________

---

### 3. Milestone Achievement Haptic ✅

**Test**: Reach a milestone day

**Steps**:
1. Reach a milestone day (1, 3, 7, 14, 21, 30, 41)
2. Open the app
3. Milestone celebration modal should appear
4. Feel for celebratory haptic pattern

**Expected**: 3-stage haptic pattern:
- Success (immediate)
- Medium (after 100ms)
- Success (after 200ms)

**Test Cases**:
- [ ] Day 1 milestone
- [ ] Day 3 milestone
- [ ] Day 7 milestone

**Result**: ___________

---

### 4. SOS Button Haptic ✅

**Test**: Press the SOS button

**Steps**:
1. Go to Home screen
2. Tap the red SOS button
3. Feel for heavy haptic feedback
4. Tap "হ্যাঁ, সাহায্য চাই" in alert
5. Feel for medium haptic feedback

**Expected**: 
- Heavy haptic on SOS button press
- Medium haptic on confirmation

**Test Cases**:
- [ ] SOS button press
- [ ] Confirmation button press
- [ ] Cancel button (no haptic)

**Result**: ___________

---

### 5. Quick Action Buttons Haptic ✅

**Test**: Tap quick action buttons on home screen

**Steps**:
1. Go to Home screen
2. Tap each quick action button (Journal, Progress, Tips, Dua)
3. Feel for light haptic feedback

**Expected**: Light haptic on each button press

**Test Cases**:
- [ ] Journal button
- [ ] Progress button
- [ ] Tips button
- [ ] Dua button

**Result**: ___________

---

### 6. Settings Toggle Haptic ✅

**Test**: Toggle haptic feedback setting

**Steps**:
1. Go to Settings > Appearance
2. Toggle "Haptic Feedback" switch
3. Test any button
4. Verify haptic is disabled
5. Toggle back on
6. Test any button
7. Verify haptic is enabled

**Expected**: 
- Haptic disabled when toggle is off
- Haptic enabled when toggle is on

**Test Cases**:
- [ ] Disable haptic
- [ ] Test button (no haptic)
- [ ] Enable haptic
- [ ] Test button (haptic works)

**Result**: ___________

---

### 7. Journal Save Haptic ✅

**Test**: Save a journal entry

**Steps**:
1. Go to Journal screen
2. Create a new entry
3. Tap Save button
4. Feel for success haptic

**Expected**: Success haptic on save

**Test Cases**:
- [ ] Save new entry
- [ ] Edit existing entry

**Result**: ___________

---

### 8. Craving Log Haptic ✅

**Test**: Log a craving

**Steps**:
1. Go to Craving SOS screen
2. Log a craving
3. Feel for medium haptic

**Expected**: Medium haptic when craving is logged

**Test Cases**:
- [ ] Log craving with intensity
- [ ] Save craving log

**Result**: ___________

---

## Platform-Specific Tests

### iOS Testing

- [ ] Test on iPhone 8 or newer (haptic engine)
- [ ] Test on older iPhone (vibration fallback)
- [ ] Verify different haptic types feel distinct
- [ ] Check system haptic settings don't interfere

### Android Testing

- [ ] Test on Android 8.0+
- [ ] Verify vibration fallback works
- [ ] Check VIBRATE permission is granted
- [ ] Test on different manufacturers (Samsung, Google, etc.)

## Edge Cases

### 1. Rapid Button Presses
- [ ] Tap button rapidly multiple times
- [ ] Verify haptic triggers for each press
- [ ] No lag or missed haptics

### 2. Settings Change During Use
- [ ] Disable haptic while using app
- [ ] Verify haptic stops immediately
- [ ] Enable haptic again
- [ ] Verify haptic resumes immediately

### 3. Background/Foreground
- [ ] Trigger haptic
- [ ] Background the app
- [ ] Foreground the app
- [ ] Trigger haptic again
- [ ] Verify it still works

### 4. Low Battery Mode
- [ ] Enable low battery mode
- [ ] Test haptic feedback
- [ ] Verify it respects system settings

## Performance Tests

- [ ] Haptic doesn't cause UI lag
- [ ] Haptic doesn't drain battery excessively
- [ ] Multiple haptics in sequence work smoothly
- [ ] No memory leaks from haptic service

## Accessibility Tests

- [ ] Haptic works with VoiceOver/TalkBack enabled
- [ ] Haptic intensity is appropriate
- [ ] Haptic doesn't interfere with screen readers

## Error Handling Tests

- [ ] Haptic fails gracefully on unsupported devices
- [ ] No crashes if haptic library fails
- [ ] Console warnings logged appropriately

## Test Results Summary

| Test Case | Status | Notes |
|-----------|--------|-------|
| Button Press | ⬜ | |
| Task Completion | ⬜ | |
| Milestone Achievement | ⬜ | |
| SOS Button | ⬜ | |
| Quick Actions | ⬜ | |
| Settings Toggle | ⬜ | |
| Journal Save | ⬜ | |
| Craving Log | ⬜ | |

## Sign-Off

- [ ] All tests passed
- [ ] No critical issues found
- [ ] Performance is acceptable
- [ ] Ready for production

**Tested By**: ___________
**Date**: ___________
**Device**: ___________
**OS Version**: ___________

## Notes

_Add any additional observations or issues here:_

---

## Quick Test Commands

```bash
# Run unit tests
npm test src/services/__tests__/haptic.service.test.ts

# Run all tests
npm test

# Check for TypeScript errors
npm run lint
```

## Troubleshooting

### Haptic Not Working

1. **Check device**: Must be real device, not simulator
2. **Check settings**: Ensure haptic enabled in app settings
3. **Check system**: Verify device haptic/vibration is on
4. **Check permissions**: Android needs VIBRATE permission
5. **Restart app**: Try force-closing and reopening

### Haptic Too Weak/Strong

- iOS: Check system haptic strength in Settings
- Android: Check vibration intensity in system settings
- Consider adjusting haptic types in code

### Haptic Delayed

- Check for UI thread blocking
- Verify no heavy operations during haptic trigger
- Test on different device

---

**Testing Guide Version**: 1.0
**Last Updated**: November 16, 2025
