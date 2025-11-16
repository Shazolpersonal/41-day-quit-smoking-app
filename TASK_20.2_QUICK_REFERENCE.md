# Task 20.2 - Haptic Feedback Quick Reference

## 🚀 Quick Start

### Install
```bash
npm install react-native-haptic-feedback
cd ios && pod install && cd ..
```

### Use in Component
```typescript
import { useHaptic } from '../hooks/useHaptic';

const MyComponent = () => {
  const haptic = useHaptic();
  
  const handlePress = () => {
    haptic.buttonPress();
    // Your code
  };
};
```

## 📋 Haptic Methods

| Method | Use Case | Intensity |
|--------|----------|-----------|
| `light()` | Button press, navigation | Light |
| `medium()` | Selections, confirmations | Medium |
| `heavy()` | Important actions, SOS | Heavy |
| `success()` | Task completion, saves | Success |
| `warning()` | Warnings, deletions | Warning |
| `error()` | Error states | Error |
| `selection()` | Toggles, sliders | Selection |

## 🎯 Specialized Methods

| Method | Description |
|--------|-------------|
| `buttonPress()` | All button interactions |
| `taskCompleted()` | Daily task completion |
| `milestoneAchieved()` | Milestone celebrations (3-stage) |
| `sosButtonPress()` | Emergency SOS button |
| `toggleSwitch()` | Toggle switches |
| `cravingLogged()` | Craving log entries |
| `journalSaved()` | Journal saves |

## 🔧 Settings Integration

```typescript
// Automatically respects user settings
const haptic = useHaptic();

// Settings location: Settings > Appearance > Haptic Feedback
settings.appearance.hapticEnabled // boolean
```

## 📍 Integration Points

✅ **Button Component** - All buttons
✅ **TaskItem** - Task completion
✅ **MilestoneCelebration** - Milestone achievement
✅ **QuickActions** - SOS and action buttons

## 🧪 Testing

```bash
npm test src/services/__tests__/haptic.service.test.ts
```

## 📱 Platform Support

- iOS 10+ ✅
- Android API 21+ ✅
- Simulator/Emulator ❌ (Use real device)

## 🎨 Milestone Pattern

```typescript
haptic.milestoneAchieved();
// Triggers:
// 1. Success (immediate)
// 2. Medium (100ms)
// 3. Success (200ms)
```

## ⚠️ Important Notes

1. **Test on Device**: Haptic doesn't work in simulators
2. **Check Settings**: Ensure haptic is enabled
3. **Permissions**: Android needs VIBRATE permission
4. **Don't Overuse**: Use appropriately for best UX

## 📚 Documentation

- Full docs: `src/services/README_HAPTIC.md`
- Installation: `TASK_20.2_INSTALLATION.md`
- Complete report: `TASK_20.2_COMPLETE.md`
