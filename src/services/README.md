# Services

This directory contains service modules that handle data persistence, API calls, and other business logic.

## Storage Service

The Storage Service provides a wrapper around AsyncStorage with error handling and data validation.

### Features

- **User Management**: Save, retrieve, and update user data
- **Progress Tracking**: Save, retrieve, and update progress data
- **Journal Entries**: Save, retrieve, and manage journal entries with date filtering
- **Task Completions**: Track and manage daily task completions
- **Settings Management**: Save, retrieve, and update app settings
- **Craving Logs**: Track and manage craving incidents with filtering
- **Data Export**: Export all app data for backup purposes
- **Data Management**: Clear all data for reset functionality
- **Data Validation**: Validates data before saving to ensure integrity
- **Error Handling**: Comprehensive error handling with console logging
- **Type Safety**: Full TypeScript support with proper type definitions

### Usage

```typescript
import { storageService } from '../services/storage.service';

// Save user data
const user: User = {
  id: 'user_123',
  quitDate: '2024-01-01T00:00:00.000Z',
  cigarettesPerDay: 20,
  pricePerPack: 350,
  cigarettesPerPack: 20,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

const success = await storageService.saveUser(user);

// Get user data
const retrievedUser = await storageService.getUser();

// Update user data
const updated = await storageService.updateUser({
  cigarettesPerDay: 15,
});

// Save progress data
const progress: Progress = {
  smokeFreeTime: {
    days: 5,
    hours: 12,
    minutes: 30,
    seconds: 45,
    totalSeconds: 476445,
  },
  moneySaved: 875,
  cigarettesNotSmoked: 100,
  currentDay: 6,
  milestones: [],
  healthBenefits: [],
  lastUpdated: '2024-01-06T12:30:45.000Z',
};

await storageService.saveProgress(progress);

// Get progress data
const retrievedProgress = await storageService.getProgress();

// Update progress data
await storageService.updateProgress({
  currentDay: 7,
  moneySaved: 1050,
});

// Utility methods
const hasUser = await storageService.hasUser();
const hasProgress = await storageService.hasProgress();

// Clear all data (use with caution)
await storageService.clearAll();

// Save journal entry
const journalEntry: JournalEntry = {
  id: 'journal_123',
  date: '2024-01-05T10:30:00.000Z',
  content: 'আজ খুব ভালো লাগছে। ধূমপান ছাড়ার ৫ দিন হয়ে গেছে।',
  mood: 'happy',
  triggers: ['stress', 'work'],
  cravingIntensity: 3,
  createdAt: '2024-01-05T10:30:00.000Z',
  updatedAt: '2024-01-05T10:30:00.000Z',
};

await storageService.saveJournalEntry(journalEntry);

// Get all journal entries
const allEntries = await storageService.getJournalEntries();

// Get journal entries with date filtering
const filteredEntries = await storageService.getJournalEntries(
  '2024-01-01T00:00:00.000Z',
  '2024-01-10T00:00:00.000Z',
);

// Get specific journal entry
const entry = await storageService.getJournalEntryById('journal_123');

// Delete journal entry
await storageService.deleteJournalEntry('journal_123');

// Save task completion
const taskCompletion: TaskCompletion = {
  taskId: 'task_day1_1',
  day: 1,
  completed: true,
  completedAt: '2024-01-01T14:30:00.000Z',
};

await storageService.saveTaskCompletion(taskCompletion);

// Get all task completions
const allCompletions = await storageService.getTaskCompletions();

// Get task completions for specific day
const dayCompletions = await storageService.getTaskCompletions(1);

// Get specific task completion
const completion = await storageService.getTaskCompletion('task_day1_1', 1);

// Get completed tasks for a day
const completedTasks = await storageService.getCompletedTasksForDay(1);

// Save settings
const settings: Settings = {
  notifications: {
    enabled: true,
    dailyReminder: true,
    dailyReminderTime: '08:00',
    prayerTimes: true,
    milestones: true,
    encouragement: true,
  },
  appearance: {
    fontSize: 'medium',
    theme: 'light',
    soundEffects: true,
    hapticFeedback: true,
  },
  privacy: {
    pinLock: false,
    biometric: false,
    dataEncryption: false,
  },
  emergencyContacts: [],
  updatedAt: new Date().toISOString(),
};

await storageService.saveSettings(settings);

// Get settings
const retrievedSettings = await storageService.getSettings();

// Update settings
await storageService.updateSettings({
  appearance: {
    ...settings.appearance,
    fontSize: 'large',
  },
});

// Save craving log
const cravingLog: CravingLog = {
  id: 'craving_123',
  timestamp: '2024-01-05T15:30:00.000Z',
  intensity: 7,
  duration: 180,
  triggers: ['stress', 'work'],
  copingStrategy: 'breathing',
  notes: 'কাজের চাপে ক্রেভিং হয়েছিল',
  overcome: true,
};

await storageService.saveCravingLog(cravingLog);

// Get all craving logs
const allLogs = await storageService.getCravingLogs();

// Get craving logs with date filtering
const filteredLogs = await storageService.getCravingLogs(
  '2024-01-01T00:00:00.000Z',
  '2024-01-10T00:00:00.000Z',
);

// Export all data for backup
const exportData = await storageService.exportAllData();
if (exportData) {
  // Save to file or share
  console.log('Data exported successfully');
}

// Clear all data (reset app)
const cleared = await storageService.clearAllData();
if (cleared) {
  console.log('All data cleared successfully');
}
```

### Methods

#### User Methods

- `saveUser(user: User): Promise<boolean>` - Save user data to storage
- `getUser(): Promise<User | null>` - Retrieve user data from storage
- `updateUser(updates: Partial<User>): Promise<boolean>` - Update specific user fields

#### Progress Methods

- `saveProgress(progress: Progress): Promise<boolean>` - Save progress data to storage
- `getProgress(): Promise<Progress | null>` - Retrieve progress data from storage
- `updateProgress(updates: Partial<Progress>): Promise<boolean>` - Update specific progress fields

#### Journal Entry Methods

- `saveJournalEntry(entry: JournalEntry): Promise<boolean>` - Save or update a journal entry
- `getJournalEntries(startDate?: string, endDate?: string): Promise<JournalEntry[]>` - Get all journal entries with optional date filtering
- `getJournalEntryById(id: string): Promise<JournalEntry | null>` - Get a specific journal entry by ID
- `deleteJournalEntry(id: string): Promise<boolean>` - Delete a journal entry by ID

#### Task Completion Methods

- `saveTaskCompletion(completion: TaskCompletion): Promise<boolean>` - Save or update a task completion
- `getTaskCompletions(day?: number): Promise<TaskCompletion[]>` - Get all task completions with optional day filtering
- `getTaskCompletion(taskId: string, day: number): Promise<TaskCompletion | null>` - Get a specific task completion
- `getCompletedTasksForDay(day: number): Promise<TaskCompletion[]>` - Get all completed tasks for a specific day

#### Settings Methods

- `saveSettings(settings: Settings): Promise<boolean>` - Save settings data to storage
- `getSettings(): Promise<Settings | null>` - Retrieve settings data from storage
- `updateSettings(updates: Partial<Settings>): Promise<boolean>` - Update specific settings fields

#### Craving Log Methods

- `saveCravingLog(log: CravingLog): Promise<boolean>` - Save or update a craving log
- `getCravingLogs(startDate?: string, endDate?: string): Promise<CravingLog[]>` - Get all craving logs with optional date filtering

#### Data Management Methods

- `exportAllData(): Promise<string | null>` - Export all app data as JSON string for backup
- `clearAllData(): Promise<boolean>` - Clear all app data from storage (reset functionality)

#### Utility Methods

- `hasUser(): Promise<boolean>` - Check if user data exists
- `hasProgress(): Promise<boolean>` - Check if progress data exists
- `hasSettings(): Promise<boolean>` - Check if settings data exists

### Data Validation

The service validates data before saving:

**User Validation:**
- `id` must be a non-empty string
- `quitDate` must be a valid ISO date string
- `cigarettesPerDay` must be a non-negative number
- `pricePerPack` must be a non-negative number
- `cigarettesPerPack` must be a positive number
- `createdAt` and `updatedAt` must be valid ISO date strings

**Progress Validation:**
- `currentDay` must be a non-negative number
- `moneySaved` must be a non-negative number
- `cigarettesNotSmoked` must be a non-negative number
- `smokeFreeTime` must be a valid object
- `milestones` and `healthBenefits` must be arrays
- `lastUpdated` must be a valid ISO date string

**Journal Entry Validation:**
- `id` must be a non-empty string
- `date` must be a valid ISO date string
- `content` must be a string
- `mood` must be a valid MoodType
- `triggers` must be an array
- `cravingIntensity` (if provided) must be between 1 and 10
- `createdAt` and `updatedAt` must be valid ISO date strings

**Task Completion Validation:**
- `taskId` must be a non-empty string
- `day` must be between 1 and 41
- `completed` must be a boolean
- `completedAt` (if provided) must be a valid ISO date string

**Settings Validation:**
- `notifications` must be a valid object with required boolean fields
- `appearance.fontSize` must be 'small', 'medium', or 'large'
- `appearance.theme` must be 'light' or 'dark'
- `privacy` must be a valid object with required boolean fields
- `emergencyContacts` must be an array
- `updatedAt` must be a valid ISO date string

**Craving Log Validation:**
- `id` must be a non-empty string
- `timestamp` must be a valid ISO date string
- `intensity` must be between 1 and 10
- `triggers` must be an array
- `overcome` must be a boolean

### Error Handling

All methods return `false` or `null` on error and log errors to the console. This allows graceful error handling without throwing exceptions.

```typescript
const success = await storageService.saveUser(user);
if (!success) {
  // Handle error - check console for details
  console.log('Failed to save user data');
}
```

### Storage Keys

The service uses the following storage keys:
- `@quit_smoking_user` - User data
- `@quit_smoking_progress` - Progress data
- `@quit_smoking_journal_entries` - Journal entries
- `@quit_smoking_task_completions` - Task completions
- `@quit_smoking_settings` - App settings
- `@quit_smoking_craving_logs` - Craving logs

These keys are internal to the service and should not be accessed directly.

### Date Filtering

Journal entries support date-based filtering:

```typescript
// Get entries from a specific date range
const entries = await storageService.getJournalEntries(
  '2024-01-01T00:00:00.000Z', // Start date
  '2024-01-31T23:59:59.999Z', // End date
);

// Get entries from a start date onwards
const recentEntries = await storageService.getJournalEntries(
  '2024-01-15T00:00:00.000Z',
);

// Get entries up to an end date
const oldEntries = await storageService.getJournalEntries(
  undefined,
  '2024-01-15T00:00:00.000Z',
);
```

Entries are automatically sorted by date (newest first) when retrieved.

### Data Export and Backup

The `exportAllData` method creates a complete backup of all app data:

```typescript
const exportData = await storageService.exportAllData();
if (exportData) {
  // The export data is a JSON string containing:
  // - version: Export format version
  // - exportDate: Timestamp of export
  // - data: All app data (user, progress, journal, tasks, settings, cravings)
  
  // You can save this to a file or share it
  const parsed = JSON.parse(exportData);
  console.log('Export version:', parsed.version);
  console.log('Export date:', parsed.exportDate);
}
```

The exported data structure:
```json
{
  "version": "1.0",
  "exportDate": "2024-01-15T10:30:00.000Z",
  "data": {
    "user": { ... },
    "progress": { ... },
    "journalEntries": [ ... ],
    "taskCompletions": [ ... ],
    "settings": { ... },
    "cravingLogs": [ ... ]
  }
}
```

### Data Reset

The `clearAllData` method removes all app data from storage:

```typescript
// Clear all data (use with caution!)
const success = await storageService.clearAllData();
if (success) {
  console.log('All data has been cleared');
  // User will need to go through onboarding again
}
```

This is useful for:
- App reset functionality in settings
- Testing and development
- User-requested data deletion

**Warning:** This action is irreversible. Always confirm with the user before calling this method.


## Progress Calculator Service

The Progress Calculator Service provides methods to calculate smoke-free time, money saved, health benefits, and milestones based on user's quit date and smoking habits.

### Features

- **Smoke-Free Time Calculation**: Calculate days, hours, minutes, and seconds since quitting
- **Money Saved Calculation**: Calculate total money saved with daily, weekly, monthly, and yearly breakdowns
- **Health Benefits Tracking**: Get achieved and upcoming health benefits based on quit timeline
- **Next Milestone**: Get the next health milestone with progress percentage and time remaining
- **Cigarettes Not Smoked**: Calculate total cigarettes avoided since quitting
- **Current Day Calculation**: Calculate current day in the 41-day program
- **Milestone Management**: Get all program milestones with achievement status

### Usage

```typescript
import { progressCalculatorService } from '../services/progressCalculator.service';

const user: User = {
  id: 'user_123',
  quitDate: '2024-01-01T00:00:00.000Z',
  cigarettesPerDay: 20,
  pricePerPack: 350,
  cigarettesPerPack: 20,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

// Calculate smoke-free time
const smokeFreeTime = progressCalculatorService.calculateSmokeFreeTime(user.quitDate);
console.log(`${smokeFreeTime.days} days, ${smokeFreeTime.hours} hours`);
// Output: { days: 5, hours: 12, minutes: 30, seconds: 45, totalSeconds: 476445 }

// Calculate money saved
const moneySaved = progressCalculatorService.calculateMoneySaved(user);
console.log(`Total saved: ${moneySaved.total} BDT`);
// Output: { total: 1750, daily: 350, weekly: 2450, monthly: 10500, yearly: 127750 }

// Get health benefits
const healthBenefits = progressCalculatorService.getHealthBenefits(user.quitDate);
console.log(`Achieved: ${healthBenefits.achieved.length}, Upcoming: ${healthBenefits.upcoming.length}`);
// Output: { achieved: [...], upcoming: [...], total: 16 }

// Get next milestone
const nextMilestone = progressCalculatorService.getNextMilestone(user.quitDate);
if (nextMilestone) {
  console.log(`Next: ${nextMilestone.milestone.title}`);
  console.log(`Progress: ${nextMilestone.progress}%`);
  console.log(`Time remaining: ${nextMilestone.timeRemaining.days} days`);
}

// Calculate cigarettes not smoked
const cigarettesNotSmoked = progressCalculatorService.calculateCigarettesNotSmoked(user);
console.log(`Cigarettes avoided: ${cigarettesNotSmoked}`);

// Calculate current day
const currentDay = progressCalculatorService.calculateCurrentDay(user.quitDate);
console.log(`Current day: ${currentDay}`);

// Get all milestones
const milestones = progressCalculatorService.getMilestones(user.quitDate);
const achievedMilestones = milestones.filter(m => m.achieved);
console.log(`Achieved milestones: ${achievedMilestones.length}`);
```

### Methods

#### calculateSmokeFreeTime(quitDate: string): SmokeFreeTime

Calculates the time elapsed since the quit date.

**Parameters:**
- `quitDate` - ISO date string of when user quit smoking

**Returns:**
```typescript
{
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}
```

**Example:**
```typescript
const smokeFreeTime = progressCalculatorService.calculateSmokeFreeTime('2024-01-01T00:00:00.000Z');
// After 5 days, 12 hours, 30 minutes, 45 seconds:
// { days: 5, hours: 12, minutes: 30, seconds: 45, totalSeconds: 476445 }
```

#### calculateMoneySaved(user: User, quitDate?: string): MoneySavedBreakdown

Calculates money saved based on user's smoking habits.

**Parameters:**
- `user` - User object with smoking habits (cigarettesPerDay, pricePerPack, cigarettesPerPack)
- `quitDate` - Optional quit date (uses user.quitDate if not provided)

**Returns:**
```typescript
{
  total: number;      // Total money saved since quitting
  daily: number;      // Daily cost of smoking
  weekly: number;     // Weekly cost of smoking
  monthly: number;    // Monthly cost of smoking
  yearly: number;     // Yearly cost of smoking
}
```

**Example:**
```typescript
const moneySaved = progressCalculatorService.calculateMoneySaved(user);
// User smokes 20 cigarettes/day, 350 BDT/pack, 20 cigarettes/pack
// After 5 days: { total: 1750, daily: 350, weekly: 2450, monthly: 10500, yearly: 127750 }
```

#### getHealthBenefits(quitDate: string): { achieved: HealthBenefit[], upcoming: HealthBenefit[], total: number }

Gets achieved and upcoming health benefits based on quit timeline.

**Parameters:**
- `quitDate` - ISO date string of when user quit smoking

**Returns:**
```typescript
{
  achieved: HealthBenefit[];   // Health benefits already achieved
  upcoming: HealthBenefit[];   // Next 5 upcoming health benefits
  total: number;               // Total number of health milestones
}
```

**Example:**
```typescript
const benefits = progressCalculatorService.getHealthBenefits('2024-01-01T00:00:00.000Z');
// After 2 hours:
// {
//   achieved: [
//     { id: 'health_20', title: 'হৃদস্পন্দন ও রক্তচাপ স্বাভাবিক হয়', achieved: true, ... },
//     { id: 'health_120', title: 'রক্ত সঞ্চালন উন্নত হয়', achieved: true, ... }
//   ],
//   upcoming: [
//     { id: 'health_720', title: 'রক্তে কার্বন মনোক্সাইড স্বাভাবিক হয়', achieved: false, ... },
//     ...
//   ],
//   total: 16
// }
```

#### getNextMilestone(quitDate: string): NextMilestone | null

Gets the next health milestone with progress and time remaining.

**Parameters:**
- `quitDate` - ISO date string of when user quit smoking

**Returns:**
```typescript
{
  milestone: HealthMilestone;  // Next milestone details
  progress: number;            // Progress percentage (0-100)
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
  };
} | null  // null if all milestones achieved
```

**Example:**
```typescript
const next = progressCalculatorService.getNextMilestone('2024-01-01T00:00:00.000Z');
// After 10 minutes:
// {
//   milestone: { timeframe: '২০ মিনিট', title: 'হৃদস্পন্দন ও রক্তচাপ স্বাভাবিক হয়', ... },
//   progress: 50,
//   timeRemaining: { days: 0, hours: 0, minutes: 10 }
// }
```

#### calculateCigarettesNotSmoked(user: User, quitDate?: string): number

Calculates total cigarettes not smoked since quitting.

**Parameters:**
- `user` - User object with cigarettesPerDay
- `quitDate` - Optional quit date (uses user.quitDate if not provided)

**Returns:** Number of cigarettes not smoked

**Example:**
```typescript
const cigarettes = progressCalculatorService.calculateCigarettesNotSmoked(user);
// User smokes 20 cigarettes/day, after 5 days: 100
```

#### calculateCurrentDay(quitDate: string): number

Calculates current day in the 41-day program.

**Parameters:**
- `quitDate` - ISO date string of when user quit smoking

**Returns:** Current day number (1-41)

**Example:**
```typescript
const currentDay = progressCalculatorService.calculateCurrentDay('2024-01-01T00:00:00.000Z');
// After 4 days: 5 (day 1 is the quit day)
// Caps at 41 for days beyond the program
```

#### getMilestones(quitDate: string): Milestone[]

Gets all program milestones with achievement status.

**Parameters:**
- `quitDate` - ISO date string of when user quit smoking

**Returns:** Array of milestones with achievement status

**Example:**
```typescript
const milestones = progressCalculatorService.getMilestones('2024-01-01T00:00:00.000Z');
// Returns 7 milestones: Day 1, 3, 7, 14, 21, 30, 41
// [
//   { id: 'milestone_1', title: 'প্রথম দিন সম্পূর্ণ', day: 1, achieved: true, achievedDate: '...', ... },
//   { id: 'milestone_3', title: '৩ দিন ধূমপানমুক্ত', day: 3, achieved: true, achievedDate: '...', ... },
//   { id: 'milestone_7', title: '১ সপ্তাহ সম্পূর্ণ', day: 7, achieved: false, ... },
//   ...
// ]
```

### Types

```typescript
interface SmokeFreeTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

interface MoneySavedBreakdown {
  total: number;
  daily: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

interface NextMilestone {
  milestone: HealthMilestone;
  progress: number;
  timeRemaining: {
    days: number;
    hours: number;
    minutes: number;
  };
}

interface HealthBenefit {
  id: string;
  title: string;
  description: string;
  timeframe: string;
  icon: string;
  achieved: boolean;
  achievedDate?: string;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  day: number;
  icon: string;
  achieved: boolean;
  achievedDate?: string;
}
```

### Integration with Health Timeline

The service integrates with the health timeline data (`src/data/healthTimeline.ts`) to provide accurate health benefit information based on medical research and WHO guidelines.

Health milestones are categorized as:
- **immediate**: First 24 hours (20 min, 2 hours, 12 hours, 24 hours)
- **short-term**: 2 days to 3 months
- **medium-term**: 6 months to 1 year
- **long-term**: 5+ years

### Calculation Logic

**Smoke-Free Time:**
- Calculates difference between current time and quit date
- Converts to days, hours, minutes, seconds
- Handles negative values (future quit dates) by returning zeros

**Money Saved:**
- Daily cost = (cigarettesPerDay / cigarettesPerPack) × pricePerPack
- Total saved = daily cost × days since quit
- Provides breakdown for different time periods

**Health Benefits:**
- Converts smoke-free time to minutes
- Compares against health timeline milestones
- Returns achieved benefits with achievement dates
- Returns next 5 upcoming benefits

**Next Milestone:**
- Finds next unachieved health milestone
- Calculates progress percentage based on time between milestones
- Calculates time remaining to next milestone

**Current Day:**
- Day 1 is the quit day
- Increments by 1 for each full day
- Caps at day 41 (program duration)

### Requirements Fulfilled

This service fulfills the following requirements:
- **2.1**: Progress tracking with smoke-free time and money saved calculations
- **2.2**: Health benefits timeline with achievement tracking
- **2.3**: Milestone tracking with progress indicators


## Notification Service

The Notification Service handles all notification-related functionality including permissions, scheduling daily reminders, milestone notifications, and notification management using the Notifee library.

### Features

- **Permission Management**: Request and check notification permissions
- **Daily Reminders**: Schedule repeating daily notifications at specific times
- **Milestone Notifications**: Send celebration notifications for milestone achievements
- **Motivational Notifications**: Send encouragement messages to users
- **Custom Scheduling**: Schedule notifications for specific timestamps
- **Notification Cancellation**: Cancel individual or all notifications
- **Notification Queries**: Get list of scheduled notifications
- **Android Channels**: Automatic notification channel creation for Android
- **iOS Support**: Full iOS notification support with categories
- **Bangla Content**: All notifications support Bangla text

### Usage

```typescript
import { notificationService } from '../services/notification.service';

// Initialize notification service (call on app start)
await notificationService.initialize();

// Request notification permissions
const granted = await notificationService.requestPermissions();
if (granted) {
  console.log('Notification permissions granted');
}

// Check if permissions are already granted
const hasPermission = await notificationService.checkPermissions();

// Schedule daily reminder at 9:00 AM
const success = await notificationService.scheduleDailyReminder(
  '09:00',
  'আজকের কাজ এবং নিশ্চিতকরণ দেখুন। আল্লাহ আপনার সাথে আছেন!',
);

// Cancel daily reminder
await notificationService.cancelDailyReminder();

// Send milestone notification
await notificationService.sendMilestoneNotification(7);

// Send custom milestone notification
await notificationService.sendMilestoneNotification(
  21,
  '🎊 ২১ দিন সম্পূর্ণ!',
  'সুবহানাল্লাহ! ৩ সপ্তাহ সম্পূর্ণ। নতুন অভ্যাস তৈরি হয়েছে!',
);

// Send motivational notification
await notificationService.sendMotivationalNotification(
  '💪 চালিয়ে যান!',
  'আপনি দুর্দান্ত কাজ করছেন। আল্লাহ আপনার সাথে আছেন!',
);

// Schedule notification for specific time
const oneHourFromNow = Date.now() + 3600000;
const notificationId = await notificationService.scheduleNotification(
  '⏰ রিমাইন্ডার',
  'এটি একটি কাস্টম রিমাইন্ডার',
  oneHourFromNow,
  'custom-reminder-1',
);

// Cancel specific notification
await notificationService.cancelNotification('custom-reminder-1');

// Get all scheduled notifications
const scheduled = await notificationService.getScheduledNotifications();
console.log(`${scheduled.length} notifications scheduled`);

// Cancel all notifications
await notificationService.cancelAllNotifications();
```

### Methods

#### initialize(): Promise<void>

Initializes notification channels (Android only). Should be called when the app starts.

**Example:**
```typescript
await notificationService.initialize();
```

#### requestPermissions(): Promise<boolean>

Requests notification permissions from the user.

**Returns:** `true` if permission granted, `false` otherwise

**Example:**
```typescript
const granted = await notificationService.requestPermissions();
if (granted) {
  // User granted permission
} else {
  // User denied permission
}
```

#### checkPermissions(): Promise<boolean>

Checks if notification permissions are currently granted.

**Returns:** `true` if permissions granted

**Example:**
```typescript
const hasPermission = await notificationService.checkPermissions();
```

#### scheduleDailyReminder(time: string, message?: string): Promise<boolean>

Schedules a daily repeating reminder notification.

**Parameters:**
- `time` - Time in HH:MM format (24-hour), e.g., "09:00"
- `message` - Optional custom message (uses default if not provided)

**Returns:** `true` if scheduled successfully

**Example:**
```typescript
// Schedule for 9:00 AM with default message
await notificationService.scheduleDailyReminder('09:00');

// Schedule with custom message
await notificationService.scheduleDailyReminder(
  '08:30',
  'সকালের শুভেচ্ছা! আজকের কাজ শুরু করুন।',
);
```

**Notes:**
- Automatically cancels any existing daily reminder before scheduling new one
- If the time has already passed today, schedules for tomorrow
- Repeats daily at the specified time
- Requires notification permissions

#### cancelDailyReminder(): Promise<boolean>

Cancels the scheduled daily reminder.

**Returns:** `true` if cancelled successfully

**Example:**
```typescript
await notificationService.cancelDailyReminder();
```

#### sendMilestoneNotification(day: number, title?: string, message?: string): Promise<boolean>

Sends an immediate milestone achievement notification.

**Parameters:**
- `day` - Milestone day number (1, 3, 7, 14, 21, 28, 35, 41)
- `title` - Optional custom title (uses default if not provided)
- `message` - Optional custom message (uses default if not provided)

**Returns:** `true` if sent successfully

**Example:**
```typescript
// Send with default message for day 7
await notificationService.sendMilestoneNotification(7);

// Send with custom title and message
await notificationService.sendMilestoneNotification(
  14,
  '🎉 দুই সপ্তাহ সম্পূর্ণ!',
  'মাশাআল্লাহ! আপনার রক্ত সঞ্চালন উন্নত হয়েছে!',
);
```

**Default Messages:**
- Day 1: "মাশাআল্লাহ! আপনি প্রথম দিন সফলভাবে সম্পূর্ণ করেছেন..."
- Day 3: "সুবহানাল্লাহ! ৩ দিন সম্পূর্ণ..."
- Day 7: "আলহামদুলিল্লাহ! ১ সপ্তাহ সম্পূর্ণ..."
- Day 14: "মাশাআল্লাহ! ২ সপ্তাহ সম্পূর্ণ..."
- Day 21: "সুবহানাল্লাহ! ৩ সপ্তাহ সম্পূর্ণ..."
- Day 28: "আলহামদুলিল্লাহ! ৪ সপ্তাহ সম্পূর্ণ..."
- Day 35: "মাশাআল্লাহ! ৫ সপ্তাহ সম্পূর্ণ..."
- Day 41: "আলহামদুলিল্লাহ! ৪১ দিন সম্পূর্ণ! আপনি সফল হয়েছেন!"

#### sendMotivationalNotification(title: string, message: string): Promise<boolean>

Sends an immediate motivational notification.

**Parameters:**
- `title` - Notification title
- `message` - Notification message

**Returns:** `true` if sent successfully

**Example:**
```typescript
await notificationService.sendMotivationalNotification(
  '💪 চালিয়ে যান!',
  'আপনি দুর্দান্ত কাজ করছেন। আল্লাহ আপনার সাথে আছেন!',
);
```

#### scheduleNotification(title: string, message: string, timestamp: number, notificationId?: string): Promise<string | null>

Schedules a notification for a specific timestamp.

**Parameters:**
- `title` - Notification title
- `message` - Notification message
- `timestamp` - Unix timestamp in milliseconds
- `notificationId` - Optional custom notification ID

**Returns:** Notification ID if scheduled successfully, `null` otherwise

**Example:**
```typescript
// Schedule for 1 hour from now
const oneHourFromNow = Date.now() + 3600000;
const id = await notificationService.scheduleNotification(
  '⏰ রিমাইন্ডার',
  'এটি একটি পরীক্ষা নোটিফিকেশন',
  oneHourFromNow,
  'my-custom-id',
);

// Schedule for specific date/time
const specificTime = new Date('2024-01-15T15:30:00').getTime();
await notificationService.scheduleNotification(
  'মিটিং রিমাইন্ডার',
  'আপনার মিটিং ৩০ মিনিটে',
  specificTime,
);
```

#### cancelNotification(notificationId: string): Promise<boolean>

Cancels a specific notification by ID.

**Parameters:**
- `notificationId` - ID of the notification to cancel

**Returns:** `true` if cancelled successfully

**Example:**
```typescript
await notificationService.cancelNotification('my-custom-id');
```

#### cancelAllNotifications(): Promise<boolean>

Cancels all scheduled and displayed notifications.

**Returns:** `true` if cancelled successfully

**Example:**
```typescript
await notificationService.cancelAllNotifications();
```

**Notes:**
- Cancels all trigger notifications (scheduled)
- Cancels all displayed notifications (in notification tray)
- Use with caution as it removes all app notifications

#### getScheduledNotifications(): Promise<any[]>

Gets all currently scheduled trigger notifications.

**Returns:** Array of scheduled notification objects

**Example:**
```typescript
const scheduled = await notificationService.getScheduledNotifications();
console.log(`You have ${scheduled.length} scheduled notifications`);

scheduled.forEach(notification => {
  console.log(`ID: ${notification.notification.id}`);
  console.log(`Title: ${notification.notification.title}`);
  console.log(`Trigger: ${new Date(notification.trigger.timestamp)}`);
});
```

### Notification Channels (Android)

The service automatically creates a notification channel on Android:

**Channel Details:**
- **ID**: `quit-smoking-channel`
- **Name**: `ধূমপান ত্যাগ রিমাইন্ডার`
- **Importance**: HIGH
- **Sound**: Default

### iOS Categories

The service uses the following iOS notification categories:
- `daily-reminder` - For daily reminder notifications
- `milestone` - For milestone achievement notifications

### Permission Handling

The service gracefully handles permission scenarios:

1. **Permission Granted**: All notification methods work normally
2. **Permission Denied**: Methods return `false` or `null` without throwing errors
3. **Permission Not Determined**: `requestPermissions()` shows system dialog

**Best Practice:**
```typescript
// Check permission before scheduling
const hasPermission = await notificationService.checkPermissions();

if (!hasPermission) {
  // Request permission
  const granted = await notificationService.requestPermissions();
  
  if (!granted) {
    // Show user-friendly message
    Alert.alert(
      'নোটিফিকেশন বন্ধ',
      'রিমাইন্ডার পেতে সেটিংস থেকে নোটিফিকেশন চালু করুন',
    );
    return;
  }
}

// Now safe to schedule
await notificationService.scheduleDailyReminder('09:00');
```

### Error Handling

All methods handle errors gracefully:
- Return `false` or `null` on error
- Log errors to console for debugging
- Never throw exceptions

```typescript
const success = await notificationService.scheduleDailyReminder('09:00');
if (!success) {
  // Handle error - check console for details
  console.log('Failed to schedule reminder');
}
```

### Integration with Settings

The notification service integrates with app settings:

```typescript
import { notificationService } from '../services/notification.service';
import { storageService } from '../services/storage.service';

// Load settings and apply notification preferences
const settings = await storageService.getSettings();

if (settings?.notifications.enabled && settings.notifications.dailyReminder) {
  await notificationService.scheduleDailyReminder(
    settings.notifications.dailyReminderTime,
  );
} else {
  await notificationService.cancelDailyReminder();
}
```

### Testing

The service includes comprehensive unit tests covering:
- Permission requests and checks
- Daily reminder scheduling and cancellation
- Milestone notifications with default and custom messages
- Motivational notifications
- Custom notification scheduling
- Notification cancellation (individual and all)
- Scheduled notification queries
- Error handling scenarios

Run tests:
```bash
npm test notification.service.test.ts
```

### Requirements Fulfilled

This service fulfills the following requirements:
- **9.1**: Daily morning notifications with tasks and affirmations
- **9.2**: Prayer time notifications (integration ready)
- **9.3**: Motivational notifications at user-defined times
- **9.4**: Reminder if app not opened for 24 hours
- **9.5**: Customizable notification frequency and timing
- **9.6**: Encouragement notifications during high-risk times
- **9.7**: Respect device "Do Not Disturb" settings (handled by Notifee)



## Prayer Time Service

The Prayer Time Service calculates Islamic prayer times based on location using astronomical algorithms. It implements the calculation method used by Islamic Foundation Bangladesh.

### Features

- **Prayer Time Calculation**: Calculate all 5 daily prayer times plus sunrise
- **Location-Based**: Use device GPS for accurate prayer times
- **Location Permissions**: Handle location permission requests gracefully
- **Next Prayer**: Get next prayer with countdown timer
- **Default Location**: Falls back to Dhaka, Bangladesh if location unavailable
- **Astronomical Accuracy**: Uses precise astronomical calculations
- **Islamic Foundation Method**: Follows Bangladesh Islamic Foundation parameters
- **Bangla Support**: Prayer names in Bangla, Arabic, and English
- **Flexible Dates**: Calculate prayer times for any date
- **Offline Capable**: Works without internet connection

### Usage

```typescript
import { prayerTimeService } from '../services/prayerTime.service';

// Get prayer times for today (Dhaka, Bangladesh)
const prayerTimes = prayerTimeService.getPrayerTimes();
console.log(`Fajr: ${prayerTimes.fajr}`);
console.log(`Dhuhr: ${prayerTimes.dhuhr}`);
console.log(`Asr: ${prayerTimes.asr}`);
console.log(`Maghrib: ${prayerTimes.maghrib}`);
console.log(`Isha: ${prayerTimes.isha}`);

// Get prayer times for specific location
const coordinates = { latitude: 23.8103, longitude: 90.4125 };
const times = prayerTimeService.getPrayerTimes(new Date(), coordinates);

// Get prayer times for specific date
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowTimes = prayerTimeService.getPrayerTimes(tomorrow);

// Request location permission
const granted = await prayerTimeService.requestLocationPermission();
if (granted) {
  console.log('Location permission granted');
}

// Get current device location
const location = await prayerTimeService.getCurrentLocation();
if (location) {
  console.log(`Lat: ${location.latitude}, Lng: ${location.longitude}`);
}

// Get prayer times using device location
const locationBasedTimes = await prayerTimeService.getPrayerTimesWithLocation();

// Get next prayer
const nextPrayer = prayerTimeService.getNextPrayerTime(prayerTimes);
if (nextPrayer) {
  console.log(`Next: ${nextPrayer.nameBangla} at ${nextPrayer.time}`);
  console.log(`Time remaining: ${nextPrayer.timeRemaining.hours}h ${nextPrayer.timeRemaining.minutes}m`);
}

// Get next prayer using device location
const nextWithLocation = await prayerTimeService.getNextPrayerWithLocation();
```

### Methods

#### getPrayerTimes(date?: Date, coordinates?: Coordinates): PrayerTimes

Calculates prayer times for a specific date and location.

**Parameters:**
- `date` - Date object (defaults to today)
- `coordinates` - Location coordinates (defaults to Dhaka: 23.8103°N, 90.4125°E)

**Returns:**
```typescript
{
  fajr: string;      // Fajr time in HH:MM format
  sunrise: string;   // Sunrise time in HH:MM format
  dhuhr: string;     // Dhuhr time in HH:MM format
  asr: string;       // Asr time in HH:MM format
  maghrib: string;   // Maghrib time in HH:MM format
  isha: string;      // Isha time in HH:MM format
  date: string;      // ISO date string
}
```

**Example:**
```typescript
// Today's prayer times for Dhaka
const times = prayerTimeService.getPrayerTimes();

// Prayer times for Mecca
const mecca = { latitude: 21.4225, longitude: 39.8262 };
const meccaTimes = prayerTimeService.getPrayerTimes(new Date(), mecca);

// Prayer times for next Friday
const nextFriday = new Date();
nextFriday.setDate(nextFriday.getDate() + (5 - nextFriday.getDay() + 7) % 7);
const fridayTimes = prayerTimeService.getPrayerTimes(nextFriday);
```

#### getPrayerTimesWithLocation(date?: Date): Promise<PrayerTimes>

Gets prayer times using device location. Automatically requests permission if needed.

**Parameters:**
- `date` - Date object (defaults to today)

**Returns:** Promise resolving to PrayerTimes object

**Example:**
```typescript
// Get prayer times for current location
const times = await prayerTimeService.getPrayerTimesWithLocation();

// Get tomorrow's prayer times for current location
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const tomorrowTimes = await prayerTimeService.getPrayerTimesWithLocation(tomorrow);
```

**Notes:**
- Automatically requests location permission if not granted
- Falls back to Dhaka if permission denied or location unavailable
- Logs warnings when using default location

#### getNextPrayerTime(prayerTimes: PrayerTimes): NextPrayer | null

Gets the next prayer time and remaining time until it.

**Parameters:**
- `prayerTimes` - Prayer times object from getPrayerTimes()

**Returns:**
```typescript
{
  name: string;           // Prayer name in English (e.g., "Fajr")
  nameArabic: string;     // Prayer name in Arabic (e.g., "الفجر")
  nameBangla: string;     // Prayer name in Bangla (e.g., "ফজর")
  time: string;           // Prayer time in HH:MM format
  timeRemaining: {
    hours: number;        // Hours remaining
    minutes: number;      // Minutes remaining
    seconds: number;      // Seconds remaining
  };
} | null  // null if no prayer times available
```

**Example:**
```typescript
const prayerTimes = prayerTimeService.getPrayerTimes();
const nextPrayer = prayerTimeService.getNextPrayerTime(prayerTimes);

if (nextPrayer) {
  console.log(`Next prayer: ${nextPrayer.nameBangla}`);
  console.log(`Time: ${nextPrayer.time}`);
  console.log(`In ${nextPrayer.timeRemaining.hours}h ${nextPrayer.timeRemaining.minutes}m`);
}
```

**Prayer Names:**
- Fajr: "Fajr" / "الفجر" / "ফজর"
- Sunrise: "Sunrise" / "الشروق" / "সূর্যোদয়"
- Dhuhr: "Dhuhr" / "الظهر" / "যোহর"
- Asr: "Asr" / "العصر" / "আসর"
- Maghrib: "Maghrib" / "المغرب" / "মাগরিব"
- Isha: "Isha" / "العشاء" / "এশা"

#### getNextPrayerWithLocation(): Promise<NextPrayer | null>

Gets next prayer using device location.

**Returns:** Promise resolving to NextPrayer object or null

**Example:**
```typescript
const nextPrayer = await prayerTimeService.getNextPrayerWithLocation();

if (nextPrayer) {
  Alert.alert(
    'পরবর্তী নামাজ',
    `${nextPrayer.nameBangla}\n${nextPrayer.time}\nবাকি: ${nextPrayer.timeRemaining.hours}h ${nextPrayer.timeRemaining.minutes}m`
  );
}
```

#### requestLocationPermission(): Promise<boolean>

Requests location permission from the user.

**Returns:** Promise resolving to true if permission granted

**Example:**
```typescript
const granted = await prayerTimeService.requestLocationPermission();

if (granted) {
  // Permission granted, can use location
  const times = await prayerTimeService.getPrayerTimesWithLocation();
} else {
  // Permission denied, use default location
  const times = prayerTimeService.getPrayerTimes();
}
```

**Platform Notes:**
- **Android**: Shows system permission dialog with Bangla text
- **iOS**: Permissions handled through Info.plist configuration

#### getCurrentLocation(): Promise<Coordinates | null>

Gets current device location coordinates.

**Returns:**
```typescript
{
  latitude: number;   // Latitude in degrees
  longitude: number;  // Longitude in degrees
} | null  // null if location unavailable
```

**Example:**
```typescript
const location = await prayerTimeService.getCurrentLocation();

if (location) {
  console.log(`Current location: ${location.latitude}, ${location.longitude}`);
  const times = prayerTimeService.getPrayerTimes(new Date(), location);
} else {
  console.log('Location unavailable');
}
```

### Calculation Parameters

The service uses Islamic Foundation Bangladesh calculation method:

**Fajr Angle:** 18° below horizon
**Isha Angle:** 17° below horizon
**Asr Method:** Standard (Shafi) - shadow length = object length + 1
**Default Location:** Dhaka, Bangladesh (23.8103°N, 90.4125°E)

### Calculation Algorithm

The service implements astronomical calculations based on:

1. **Julian Date Calculation**: Converts Gregorian date to Julian date
2. **Solar Position**: Calculates equation of time and solar declination
3. **Hour Angle**: Computes hour angle for each prayer based on sun position
4. **Time Adjustment**: Adjusts for longitude, timezone, and equation of time

**Prayer-Specific Calculations:**

- **Fajr**: Sun 18° below horizon (morning)
- **Sunrise**: Sun 0.833° below horizon (morning)
- **Dhuhr**: Solar noon (midday)
- **Asr**: Shadow length = object length + 1 (afternoon)
- **Maghrib**: Sun 0.833° below horizon (evening)
- **Isha**: Sun 17° below horizon (evening)

### Types

```typescript
interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

interface NextPrayer {
  name: string;
  nameArabic: string;
  nameBangla: string;
  time: string;
  timeRemaining: {
    hours: number;
    minutes: number;
    seconds: number;
  };
}

interface Coordinates {
  latitude: number;
  longitude: number;
}
```

### Integration with Notifications

The prayer time service integrates with the notification service for prayer reminders:

```typescript
import { prayerTimeService } from '../services/prayerTime.service';
import { notificationService } from '../services/notification.service';

// Schedule notifications for all prayers
const schedulePrayerNotifications = async () => {
  const prayerTimes = await prayerTimeService.getPrayerTimesWithLocation();
  
  const prayers = [
    { name: 'ফজর', time: prayerTimes.fajr },
    { name: 'যোহর', time: prayerTimes.dhuhr },
    { name: 'আসর', time: prayerTimes.asr },
    { name: 'মাগরিব', time: prayerTimes.maghrib },
    { name: 'এশা', time: prayerTimes.isha },
  ];

  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);

    await notificationService.scheduleNotification(
      `🕌 ${prayer.name} নামাজের সময়`,
      'নামাজ পড়ার সময় হয়েছে',
      prayerDate.getTime(),
      `prayer-${prayer.name}`,
    );
  }
};
```

### Integration with Settings

The service respects user settings for prayer notifications:

```typescript
import { prayerTimeService } from '../services/prayerTime.service';
import { storageService } from '../services/storage.service';

// Load settings and schedule prayer notifications
const settings = await storageService.getSettings();

if (settings?.notifications.prayerTimes) {
  const prayerTimes = await prayerTimeService.getPrayerTimesWithLocation();
  // Schedule notifications...
}
```

### Error Handling

All methods handle errors gracefully:
- Returns default location (Dhaka) if location unavailable
- Returns null for next prayer if no prayer times available
- Logs errors to console for debugging
- Never throws exceptions

```typescript
// Safe to call without try-catch
const times = await prayerTimeService.getPrayerTimesWithLocation();
// Will use Dhaka if location fails

const location = await prayerTimeService.getCurrentLocation();
// Will return null if location fails
```

### Testing

The service includes comprehensive unit tests covering:
- Location permission requests
- Location retrieval
- Prayer time calculations for various locations
- Prayer time calculations for different dates
- Next prayer determination
- Prayer time ordering (Fajr < Sunrise < Dhuhr < Asr < Maghrib < Isha)
- Edge cases (all prayers passed, extreme latitudes)

Run tests:
```bash
npm test prayerTime.service.test.ts
```

### Requirements Fulfilled

This service fulfills the following requirements:
- **5.2**: Prayer time notifications based on user's location
- **8.5**: Calculate prayer times using device location without requiring internet
