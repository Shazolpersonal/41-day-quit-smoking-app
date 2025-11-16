# Home Screen Components

Home screen components for the 41-Day Quit Smoking App.

## Components

### DayCounter
Displays the current day progress with animated numbers and time breakdown.

**Features:**
- Large animated day counter
- Progress bar showing completion percentage
- Time breakdown (days, hours, minutes)
- Smooth animations on mount and updates
- Bengali text labels

**Props:**
- `currentDay`: Current day number (1-41)
- `totalDays`: Total days in program (default: 41)
- `smokeFreeTime`: Object with days, hours, minutes, seconds

**Usage:**
```tsx
import {DayCounter} from './components/home';

<DayCounter
  currentDay={7}
  smokeFreeTime={{days: 7, hours: 12, minutes: 30, seconds: 45}}
/>
```

### MoneySaved
Shows money saved and cigarettes not smoked with currency formatting.

**Features:**
- Animated money display
- Bengali number formatting
- Currency symbol support (default: ৳)
- Cigarettes not smoked counter
- Motivational message
- Smooth animations on updates

**Props:**
- `amount`: Money saved amount
- `cigarettesNotSmoked`: Number of cigarettes avoided
- `currency`: Currency symbol (default: '৳')

**Usage:**
```tsx
import {MoneySaved} from './components/home';

<MoneySaved
  amount={1500}
  cigarettesNotSmoked={140}
  currency="৳"
/>
```

### QuickActions
Provides quick access buttons including prominent SOS button.

**Features:**
- Large SOS emergency button with confirmation
- Secondary action buttons (Journal, Progress, Tips)
- Grid layout for secondary actions
- Touch feedback animations
- Bengali labels

**Props:**
- `onSOSPress`: Handler for SOS button (required)
- `onJournalPress`: Handler for journal button (optional)
- `onProgressPress`: Handler for progress button (optional)
- `onTipsPress`: Handler for tips button (optional)

**Usage:**
```tsx
import {QuickActions} from './components/home';

<QuickActions
  onSOSPress={() => navigation.navigate('SOS')}
  onJournalPress={() => navigation.navigate('Journal')}
  onProgressPress={() => navigation.navigate('Progress')}
  onTipsPress={() => navigation.navigate('Tips')}
/>
```

## Design Principles

1. **Islamic Theme**: Uses green and gold colors from the theme
2. **Bengali Language**: All text in Bengali for target audience
3. **Animations**: Smooth, spring-based animations for engagement
4. **Accessibility**: Large touch targets and clear visual hierarchy
5. **Responsive**: Adapts to different screen sizes

## Integration

These components are designed to work with:
- `UserContext` for user data
- `ProgressContext` for progress calculations
- Theme constants for consistent styling
- Common Card component for layout
