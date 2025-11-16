# Screens

This directory contains all screen components for the 41-Day Quit Smoking App.

## Structure

```
screens/
├── OnboardingScreen.tsx    # Initial setup screen ✅
├── HomeScreen.tsx          # Main dashboard ✅
├── DailyScreen.tsx         # Daily content and tasks (to be implemented)
├── ProgressScreen.tsx      # Progress tracking (to be implemented)
├── JournalScreen.tsx       # Journal entries (to be implemented)
├── SettingsScreen.tsx      # App settings (to be implemented)
├── __tests__/              # Test files
│   ├── OnboardingScreen.test.tsx ✅
│   └── HomeScreen.test.tsx ✅
└── README.md
```

## Implemented Screens

### 1. OnboardingScreen ✅

The onboarding screen is the first screen users see when they launch the app for the first time.

**Features:**
- Islamic greeting (Assalamu Alaikum)
- Quit date picker with validation
- Cigarettes per day input
- Price per pack input
- Prayer notification preference toggle
- Form validation
- Data persistence to AsyncStorage
- Navigation to home screen after completion

**Props:**
- Uses `OnboardingScreenProps` from navigation types

**State Management:**
- Local state for form inputs
- Validation errors
- Submission status

**Data Flow:**
1. User fills in the form
2. Form validation on submit
3. Create User model with UserModel.create()
4. Create Settings model with SettingsModel.createDefault()
5. Save both to AsyncStorage
6. Navigate to MainTabs (Home screen)

**Validation Rules:**
- Quit date cannot be in the future
- Cigarettes per day: 1-100
- Price per pack: 1-10000 BDT
- All fields are required

### 2. HomeScreen ✅

The main dashboard displaying user progress and daily content.

**Features:**
- Day counter with smoke-free time breakdown
- Money saved calculation with Bengali currency
- 41-day journey progress bar
- Today's task summary with completion tracking
- Daily affirmation with Islamic themes
- Quick action buttons (SOS, Journal, Progress, Tips)
- Pull-to-refresh functionality
- Loading and empty states
- Smooth animations

**Props:**
- Uses `HomeScreenProps` from navigation types

**State Management:**
- UserContext for user data
- ProgressContext for progress calculations
- Local state for refresh status

**Data Flow:**
1. Load user data from UserContext
2. Calculate progress in ProgressContext
3. Fetch today's content from dailyContent
4. Display all metrics and content
5. Handle navigation to other screens
6. Refresh data on pull-to-refresh

**Components Used:**
- `DayCounter` - Animated day counter
- `MoneySaved` - Financial savings display
- `ProgressBar` - Visual progress indicator
- `Affirmation` - Daily motivational content
- `QuickActions` - Action buttons
- `Card` - Content containers
- `Header` - Screen header

**Navigation:**
- `CravingSOS` - Emergency help screen
- `Journal` - Journal entries screen
- `Progress` - Detailed progress screen
- `Daily` - Today's tasks and content

**Calculations:**
- Smoke-free time: Based on quit date
- Money saved: cigarettesPerDay × days × (pricePerPack / cigarettesPerPack)
- Cigarettes not smoked: cigarettesPerDay × days
- Current day: Days since quit date (1-41)
- Task completion: Completed tasks / total tasks

## Screen Navigation Flow

```
OnboardingScreen (first launch)
    ↓
MainTabs
    ├── HomeScreen ✅
    │   ├── → CravingSOS
    │   ├── → Journal
    │   ├── → Progress
    │   └── → Daily
    ├── DailyScreen
    ├── ProgressScreen
    ├── JournalScreen
    └── SettingsScreen
```

## Usage Examples

### OnboardingScreen
```typescript
import {OnboardingScreen} from './screens/OnboardingScreen';

<Stack.Screen 
  name="Onboarding" 
  component={OnboardingScreen}
  options={{headerShown: false}}
/>
```

### HomeScreen
```typescript
import {HomeScreen} from './screens/HomeScreen';

<Tab.Screen 
  name="Home" 
  component={HomeScreen}
  options={{
    headerShown: false,
    tabBarLabel: 'হোম',
    tabBarIcon: ({color}) => <HomeIcon color={color} />,
  }}
/>
```

## Testing

Each screen has comprehensive test coverage:

### OnboardingScreen Tests
- Component rendering
- Form input handling
- Validation logic
- Data submission
- Navigation flow

### HomeScreen Tests
- Component rendering
- Day counter display
- Progress bar display
- Money saved display
- Task summary display
- Affirmation display
- Quick actions display
- Navigation functionality

## Dependencies

### Common Dependencies
- React Native core components
- React Navigation
- TypeScript
- Theme constants
- String constants

### OnboardingScreen Dependencies
- @react-native-community/datetimepicker
- User and Settings models
- Storage service

### HomeScreen Dependencies
- UserContext
- ProgressContext
- Daily content data
- Home components (DayCounter, MoneySaved, QuickActions)
- Daily components (Affirmation)
- Common components (Card, Header, ProgressBar)

## Best Practices

### Code Quality
1. Use TypeScript for type safety
2. Follow established theme and styling patterns
3. Implement proper error handling
4. Use AsyncStorage through storage service
5. Validate all user inputs
6. Provide clear error messages in Bengali

### User Experience
7. Handle loading states
8. Add empty states
9. Implement pull-to-refresh where appropriate
10. Use smooth animations
11. Support Bengali language
12. Follow Islamic design principles

### State Management
13. Use Context API for global state
14. Use local state for UI state
15. Implement proper data flow
16. Handle async operations properly

### Testing
17. Write comprehensive tests
18. Test user interactions
19. Test navigation flows
20. Mock contexts and services

## Screen Guidelines

### Component Structure
```typescript
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScreenNameProps} from '../types/navigation';

export const ScreenName: React.FC<ScreenNameProps> = ({navigation}) => {
  // State and hooks
  
  // Event handlers
  
  // Render
  return (
    <SafeAreaView style={styles.container}>
      {/* Screen content */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
});
```

### Required Features
- Loading states
- Error handling
- Empty states
- Pull-to-refresh (where appropriate)
- Smooth animations
- Bengali language support
- Islamic theme
- Accessibility support
- Responsive design

## Documentation

Each screen includes:
1. **Main Component** (`.tsx`) - Implementation
2. **Test Suite** (`__tests__/*.test.tsx`) - Tests
3. **Example File** (`.example.tsx`) - Usage examples
4. **Completion Doc** (`TASK_*.md`) - Implementation details

## Progress Tracking

| Screen | Status | Tests | Docs | Features |
|--------|--------|-------|------|----------|
| Onboarding | ✅ | ✅ | ✅ | Complete |
| Home | ✅ | ✅ | ✅ | Complete |
| Daily | ⏳ | ⏳ | ⏳ | Planned |
| CravingSOS | ⏳ | ⏳ | ⏳ | Planned |
| Journal | ⏳ | ⏳ | ⏳ | Planned |
| Progress | ⏳ | ⏳ | ⏳ | Planned |
| Settings | ⏳ | ⏳ | ⏳ | Planned |

Legend:
- ✅ Complete
- ⏳ Planned
- 🔄 In Progress

## Resources

### Related Documentation
- `src/types/navigation.ts` - Navigation types
- `src/constants/theme.ts` - Theme constants
- `src/context/` - Context providers
- `src/components/` - Reusable components
- `src/data/` - Static content data

### External Resources
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)

## Support

For questions or issues:
1. Review screen example files (`.example.tsx`)
2. Check test files for usage patterns
3. Refer to completion documentation (`TASK_*.md`)
4. Review component documentation in `src/components/`
5. Check context documentation in `src/context/`
