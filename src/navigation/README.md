# Navigation System

This directory contains the complete navigation setup for the Quit Smoking App.

## Structure

### RootNavigator.tsx
The main stack navigator that handles all top-level navigation including:
- Onboarding flow
- Main app tabs
- Modal screens (Craving SOS)
- Detail screens (Journal entries)

### MainTabNavigator.tsx
Bottom tab navigator with 5 main sections:
- **Home**: Dashboard with quit progress
- **Daily**: Daily content and tasks
- **Progress**: Charts and health timeline
- **Journal**: Craving journal entries
- **Settings**: App configuration

### navigationService.ts
Utility functions for programmatic navigation:
- `navigate()`: Navigate to any screen
- `goBack()`: Go back one screen
- `reset()`: Reset navigation stack
- `getCurrentRoute()`: Get current route info

### linking.ts
Deep linking configuration for:
- URL schemes: `quitsmokingapp://`
- Web URLs: `https://quitsmokingapp.com`
- Notification deep links
- Route parameter parsing

### animations.ts
Custom transition animations:
- Fade transitions
- Slide from right/bottom
- Modal presentations
- Scale animations

## Usage Examples

### Basic Navigation
```typescript
import {useNavigation} from '@react-navigation/native';
import {RootStackScreenProps} from '../types/navigation';

function MyScreen() {
  const navigation = useNavigation<RootStackScreenProps<'Home'>['navigation']>();
  
  // Navigate to another screen
  navigation.navigate('CravingSOS');
  
  // Navigate with parameters
  navigation.navigate('JournalDetail', {entryId: '123'});
}
```

### Programmatic Navigation
```typescript
import {navigate, goBack} from '../navigation/navigationService';

// Navigate from anywhere (e.g., notification handler)
navigate('CravingSOS');
navigate('JournalDetail', {entryId: '123'});

// Go back
goBack();
```

### Deep Linking
The app supports these URL patterns:
- `quitsmokingapp://home`
- `quitsmokingapp://daily/5` (day 5)
- `quitsmokingapp://journal/abc123` (journal entry)
- `quitsmokingapp://craving-sos`

### Tab Navigation
```typescript
import {useNavigation} from '@react-navigation/native';
import {MainTabScreenProps} from '../types/navigation';

function HomeScreen() {
  const navigation = useNavigation<MainTabScreenProps<'Home'>['navigation']>();
  
  // Switch to another tab
  navigation.navigate('Progress');
  
  // Navigate to tab with params
  navigation.navigate('Daily', {day: 5});
}
```

## Screen Transitions

Different screen types use appropriate animations:
- **Tab switches**: Fade animation
- **Stack navigation**: Slide from right
- **Modals**: Slide from bottom
- **Onboarding**: Fade transition

## Integration with Services

### Notifications
The notification service can trigger navigation:
```typescript
// In notification handler
navigate('CravingSOS');
navigate('Daily', {day: currentDay});
```

### Storage
Navigation state can be persisted:
```typescript
// Save navigation state on app close
// Restore on app launch
```

## Type Safety

All navigation is fully typed using TypeScript:
- Route names are type-checked
- Parameters are validated
- Screen props are inferred automatically

## Testing

Navigation can be tested using:
```typescript
import {NavigationContainer} from '@react-navigation/native';
import {render} from '@testing-library/react-native';

const navigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

render(
  <NavigationContainer>
    <MyScreen navigation={navigation} />
  </NavigationContainer>
);
```
