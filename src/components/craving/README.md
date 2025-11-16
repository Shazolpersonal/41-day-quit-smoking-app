# Craving Management Components

This directory contains components for managing cravings and providing immediate support during difficult moments.

## Components

### BreathingExercise
Animated breathing exercise component using the 4-4-4 technique (4 seconds inhale, 4 seconds hold, 4 seconds exhale).

**Features:**
- Animated circle that expands and contracts with breathing phases
- Visual countdown timer
- Cycle counter to track completed breathing cycles
- Start/stop controls
- Bangla instructions

**Props:**
- `onComplete?: () => void` - Callback when exercise is stopped after completing cycles

**Usage:**
```tsx
<BreathingExercise onComplete={() => console.log('Exercise completed')} />
```

### CopingStrategies
Quick action buttons for various coping strategies to manage cravings.

**Features:**
- 8 different coping strategies with icons
- Scrollable list of strategy cards
- Each strategy has title, description, and emoji
- Tap to select a strategy

**Props:**
- `onStrategySelect: (strategy: CopingStrategyType) => void` - Callback when a strategy is selected

**Strategies:**
- Breathing exercises
- Dua (prayer)
- Dhikr (remembrance)
- Drink water
- Take a walk
- Call someone
- Distraction
- Other

**Usage:**
```tsx
<CopingStrategies 
  onStrategySelect={(strategy) => console.log('Selected:', strategy)} 
/>
```

### EmergencyContacts
Display and call emergency contacts for support during cravings.

**Features:**
- List of emergency contacts with name, relationship, and phone
- Quick call functionality with confirmation dialog
- Empty state with add contact prompt
- Add more contacts button

**Props:**
- `contacts: EmergencyContact[]` - Array of emergency contacts
- `onAddContact?: () => void` - Callback to add new contact

**Usage:**
```tsx
<EmergencyContacts 
  contacts={emergencyContacts}
  onAddContact={() => navigation.navigate('AddContact')}
/>
```

## Integration

These components are designed to be used in the Craving SOS screen to provide immediate support:

```tsx
import {
  BreathingExercise,
  CopingStrategies,
  EmergencyContacts,
} from '../components/craving';

// In your Craving SOS screen
<ScrollView>
  <BreathingExercise onComplete={handleExerciseComplete} />
  <CopingStrategies onStrategySelect={handleStrategySelect} />
  <EmergencyContacts 
    contacts={settings.emergencyContacts}
    onAddContact={handleAddContact}
  />
</ScrollView>
```

## Requirements Fulfilled

- **4.2**: Quick coping strategies with actionable buttons
- **4.3**: Breathing exercise with animated visual guide
- **4.4**: Islamic coping methods (dua, dhikr) integrated in strategies
- **4.5**: Wudu and Salah reminders can be added to strategies
- **4.7**: Emergency contacts with call functionality

## Styling

All components use the Islamic-themed color palette and follow the app's design system with:
- Primary green color for main actions
- Bangla text throughout
- Consistent spacing and typography
- Shadow effects for depth
- Smooth animations
