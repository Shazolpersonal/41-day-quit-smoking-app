# Haptic Feedback Service

## Overview

The Haptic Feedback Service provides tactile feedback throughout the app to enhance user experience and provide physical confirmation of actions.

## Features

- **Configurable**: Respects user's haptic feedback settings
- **Multiple Feedback Types**: Different haptic patterns for different actions
- **Cross-platform**: Works on both iOS and Android
- **Graceful Degradation**: Falls back to vibration on unsupported devices

## Usage

### Basic Usage

```typescript
import { useHaptic } from '../hooks/useHaptic';

const MyComponent = () => {
  const haptic = useHaptic();

  const handlePress = () => {
    haptic.buttonPress();
    // Your action here
  };

  return <Button onPress={handlePress} title="Press Me" />;
};
```

### Available Haptic Methods

#### Basic Haptic Types
- `light()` - Light haptic feedback
- `medium()` - Medium haptic feedback
- `heavy()` - Heavy haptic feedback
- `success()` - Success notification haptic
- `warning()` - Warning notification haptic
- `error()` - Error notification haptic
- `selection()` - Selection haptic feedback

#### Specialized Methods
- `buttonPress()` - For button presses (light)
- `sosButtonPress()` - For SOS/emergency button (heavy)
- `taskCompleted()` - For task completion (success)
- `milestoneAchieved()` - For milestone achievement (celebratory pattern)
- `toggleSwitch()` - For toggle switches (selection)
- `sliderChange()` - For slider interactions (selection)
- `navigate()` - For navigation actions (light)
- `cravingLogged()` - For craving log entries (medium)
- `journalSaved()` - For journal entry saves (success)
- `dataDeleted()` - For data deletion (warning)

## Integration Points

### 1. Button Component
All buttons automatically trigger light haptic feedback on press.

```typescript
// Automatically handled in Button component
<Button title="Save" onPress={handleSave} />
```

### 2. Task Completion
Task items trigger success haptic when completed.

```typescript
// Automatically handled in TaskItem component
<TaskItem task={task} onToggle={handleToggle} />
```

### 3. Milestone Achievement
Milestone celebrations trigger a celebratory haptic pattern.

```typescript
// Automatically handled in MilestoneCelebration component
<MilestoneCelebration visible={true} milestone={milestone} onClose={handleClose} />
```

### 4. SOS Button
The SOS button triggers heavy haptic feedback for urgency.

```typescript
// Automatically handled in QuickActions component
<QuickActions onSOSPress={handleSOS} />
```

## Settings Integration

Haptic feedback respects the user's settings:

```typescript
// In SettingsContext
settings.appearance.hapticEnabled // boolean

// Automatically synced via useHaptic hook
const haptic = useHaptic(); // Respects settings
```

Users can enable/disable haptic feedback in Settings > Appearance.

## Implementation Details

### Haptic Service

The service uses `react-native-haptic-feedback` library with fallback to vibration:

```typescript
const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};
```

### Milestone Celebration Pattern

The milestone achievement creates a celebratory pattern:
1. Success haptic (immediate)
2. Medium haptic (after 100ms)
3. Success haptic (after 200ms)

### Error Handling

All haptic triggers are wrapped in try-catch blocks and log warnings on failure without crashing the app.

## Testing

Run tests with:
```bash
npm test src/services/__tests__/haptic.service.test.ts
```

## Platform Support

- **iOS**: Full support for all haptic types
- **Android**: Supported with vibration fallback
- **Minimum Requirements**: 
  - iOS 10+
  - Android API 21+

## Best Practices

1. **Use Appropriate Feedback**: Match haptic type to action importance
2. **Don't Overuse**: Too much haptic can be annoying
3. **Respect Settings**: Always check if haptic is enabled
4. **Test on Device**: Haptic feedback doesn't work in simulators

## Future Enhancements

- Custom haptic patterns
- Intensity customization
- Haptic feedback for more UI interactions
- Advanced pattern sequences
