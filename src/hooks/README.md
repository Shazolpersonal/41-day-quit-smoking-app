# Custom Hooks

This directory contains custom React hooks used throughout the application.

## Available Hooks

### useNotificationSync

Automatically syncs notification settings with the notification service.

**Features:**
- Monitors notification settings changes
- Schedules/cancels daily reminders automatically
- Handles permission checks
- Includes personalized messages based on current day

**Usage:**
```typescript
import {useNotificationSync} from '../hooks/useNotificationSync';

function MyComponent() {
  useNotificationSync(); // Call in a component that's always mounted
  
  return <View>...</View>;
}
```

**Dependencies:**
- SettingsContext (for notification settings)
- ProgressContext (for current day)
- notificationService (for scheduling)

**When it runs:**
- On component mount
- When daily reminder setting changes
- When daily reminder time changes

**What it does:**
1. Checks if notifications are enabled globally
2. Checks if daily reminders are enabled
3. Verifies notification permissions
4. Schedules or cancels daily reminder accordingly
5. Includes current day in notification message

---

### usePrayerNotifications

Automatically manages prayer time notifications based on location and settings.

**Features:**
- Calculates prayer times based on device location
- Schedules notifications for each prayer
- Respects user's notification preferences
- Automatically reschedules daily at midnight

**Usage:**
```typescript
import {usePrayerNotifications} from '../hooks/usePrayerNotifications';

function MyComponent() {
  usePrayerNotifications(); // Call in a component that's always mounted
  
  return <View>...</View>;
}
```

**Dependencies:**
- SettingsContext (for prayer notification settings)
- prayerTimeService (for calculating prayer times)
- notificationService (for scheduling)

**When it runs:**
- On component mount
- When prayer time setting changes
- Daily at midnight (automatic rescheduling)

**What it does:**
1. Checks if prayer time notifications are enabled
2. Gets device location (with permission)
3. Calculates prayer times for today
4. Schedules notifications for each prayer
5. Reschedules automatically at midnight

**Prayer times scheduled:**
- Fajr (🌅)
- Dhuhr (☀️)
- Asr (🌤️)
- Maghrib (🌆)
- Isha (🌙)

---

### useMilestoneNotifications

Automatically sends notifications when milestones are achieved.

**Features:**
- Monitors progress for milestone achievements
- Sends celebratory notifications
- Respects user's notification preferences
- Tracks milestone days (1, 3, 7, 14, 21, 28, 35, 41)

**Usage:**
```typescript
import {useMilestoneNotifications} from '../hooks/useMilestoneNotifications';

function MyComponent() {
  useMilestoneNotifications(); // Call in a component that's always mounted
  
  return <View>...</View>;
}
```

**Dependencies:**
- ProgressContext (for current day tracking)
- SettingsContext (for milestone notification settings)
- notificationService (for sending notifications)

**When it runs:**
- On component mount
- When current day changes
- When milestone setting changes

**What it does:**
1. Checks if milestone notifications are enabled
2. Monitors current day progress
3. Detects when a milestone day is reached
4. Sends celebratory notification
5. Includes milestone-specific message

**Milestone days:**
- Day 1: First day complete
- Day 3: 3 days smoke-free
- Day 7: 1 week complete
- Day 14: 2 weeks complete
- Day 21: 3 weeks complete
- Day 28: 4 weeks complete
- Day 35: 5 weeks complete
- Day 41: Journey complete!

---

### useInactivityTracking

Tracks app usage and sends reminders if app hasn't been opened for 24 hours.

**Features:**
- Monitors app state (active/background)
- Tracks last active timestamp
- Schedules reminder after 24 hours of inactivity
- Cancels reminder when app is opened
- Respects user's notification preferences

**Usage:**
```typescript
import {useInactivityTracking} from '../hooks/useInactivityTracking';

function MyComponent() {
  useInactivityTracking(); // Call in a component that's always mounted
  
  return <View>...</View>;
}
```

**Dependencies:**
- SettingsContext (for encouragement notification settings)
- notificationService (for scheduling reminders)
- storageService (for storing last active timestamp)
- AppState (React Native API)

**When it runs:**
- On component mount
- When app state changes (active/background)
- When encouragement setting changes

**What it does:**
1. Listens to app state changes
2. Updates last active timestamp when app opens
3. Cancels existing inactivity reminder
4. Schedules new reminder for 24 hours later
5. Sends friendly reminder if 24 hours pass

**Helper functions:**
```typescript
// Get last active timestamp
const lastActive = await getLastActiveTimestamp();

// Check if inactive for 24+ hours
const isInactive = await isInactiveFor24Hours();
```

---

## Integration

All hooks are integrated in `RootNavigator.tsx`:

```typescript
const RootNavigator: React.FC = () => {
  useNotificationSync(); // Daily reminders
  usePrayerNotifications(); // Prayer time notifications
  useMilestoneNotifications(); // Milestone achievements
  useInactivityTracking(); // App inactivity tracking

  return <Stack.Navigator>...</Stack.Navigator>;
};
```

## Best Practices

1. **Always mount in root component**: These hooks should be called in a component that's always mounted (like RootNavigator)
2. **Don't call conditionally**: Hooks must be called unconditionally at the top level
3. **Let hooks handle permissions**: Hooks check permissions internally
4. **Trust automatic synchronization**: Hooks sync automatically when settings change
5. **Check console logs**: Hooks log their actions for debugging
