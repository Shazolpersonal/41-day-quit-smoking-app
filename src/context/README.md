# Context Providers

This directory contains React Context providers for global state management.

## Available Contexts

### UserContext

Manages user profile data and provides CRUD operations.

**Features:**
- User profile state management
- Create, read, update operations for user data
- Specialized methods for updating quit date and cigarette data
- Integration with StorageService for data persistence
- Error handling and validation
- Loading states

**Usage:**
```typescript
import {UserProvider, useUser} from './context/UserContext';

// Wrap your app with the provider
<UserProvider>
  <App />
</UserProvider>

// Use the hook in components
const {user, loading, error, updateUser, updateQuitDate} = useUser();
```

**Available Methods:**
- `createUser(data)` - Create a new user profile
- `updateUser(updates)` - Update user profile with partial data
- `updateQuitDate(quitDate)` - Update the quit date
- `updateCigaretteData(cigarettesPerDay, pricePerPack, cigarettesPerPack)` - Update cigarette consumption data
- `refreshUser()` - Reload user data from storage
- `clearUser()` - Clear all user data

### ProgressContext

Manages progress tracking, calculations, and milestone achievements.

**Features:**
- Real-time progress calculations (smoke-free time, money saved, cigarettes not smoked)
- Automatic milestone tracking and achievement
- Health benefits timeline based on time elapsed
- Current day calculation (1-41)
- Integration with UserContext for user-specific calculations
- Automatic updates when user data changes

**Usage:**
```typescript
import {ProgressProvider, useProgress} from './context/ProgressContext';

// Wrap your app with the provider (after UserProvider)
<UserProvider>
  <ProgressProvider>
    <App />
  </ProgressProvider>
</UserProvider>

// Use the hook in components
const {
  progress,
  loading,
  error,
  calculateProgress,
  getNextMilestone,
  getAchievedHealthBenefits
} = useProgress();
```

**Available Methods:**
- `calculateProgress()` - Calculate and update all progress metrics
- `updateMilestone(milestoneId, achieved)` - Update milestone achievement status
- `refreshProgress()` - Reload progress data from storage
- `clearProgress()` - Clear all progress data
- `getNextMilestone()` - Get the next unachieved milestone
- `getAchievedMilestones()` - Get all achieved milestones
- `getNextHealthBenefit()` - Get the next unachieved health benefit
- `getAchievedHealthBenefits()` - Get all achieved health benefits

**Progress Metrics:**
- **Smoke-free time**: Days, hours, minutes, seconds since quit date
- **Money saved**: Calculated based on cigarette consumption and price
- **Cigarettes not smoked**: Total cigarettes avoided since quit date
- **Current day**: Current day in the 41-day journey (1-41)
- **Milestones**: Key achievements at days 1, 3, 7, 14, 21, 30, 41
- **Health benefits**: Timeline of health improvements based on medical research

### SettingsContext

Manages app configuration, notification preferences, appearance settings, privacy options, and emergency contacts.

**Features:**
- Notification settings management (daily reminders, prayer times, milestones)
- Appearance customization (font size, theme, sound effects, haptic feedback)
- Privacy settings (PIN lock, biometric authentication, data encryption)
- Emergency contacts management (add, update, remove up to 5 contacts)
- Automatic initialization with default settings
- Validation for all settings updates
- Integration with StorageService for data persistence

**Usage:**
```typescript
import {SettingsProvider, useSettings} from './context/SettingsContext';

// Wrap your app with the provider
<SettingsProvider>
  <App />
</SettingsProvider>

// Use the hook in components
const {
  settings,
  loading,
  error,
  updateNotifications,
  updateAppearance,
  addEmergencyContact
} = useSettings();
```

**Available Methods:**
- `initializeSettings()` - Initialize settings with default values
- `updateNotifications(notifications)` - Update notification preferences
- `updateAppearance(appearance)` - Update appearance settings
- `updatePrivacy(privacy)` - Update privacy settings
- `addEmergencyContact(contact)` - Add a new emergency contact
- `updateEmergencyContact(contactId, updates)` - Update an existing emergency contact
- `removeEmergencyContact(contactId)` - Remove an emergency contact
- `updateSettings(updates)` - Update settings with partial updates
- `refreshSettings()` - Reload settings from storage
- `resetSettings()` - Reset all settings to default values

**Settings Structure:**
- **Notifications**: Enable/disable notifications, daily reminder time, prayer times, milestones, encouragement
- **Appearance**: Font size (small/medium/large), theme (light/dark), sound effects, haptic feedback
- **Privacy**: PIN lock, biometric authentication, data encryption
- **Emergency Contacts**: Up to 5 contacts with name, phone, and relationship

## Future Contexts

- **JournalContext** - Manage journal entries and craving logs

## Best Practices

1. Always wrap your app with required providers
2. Use the custom hooks (e.g., `useUser`) instead of `useContext` directly
3. Handle loading and error states in your components
4. Validate data before updating context
5. Keep context focused on specific domains
