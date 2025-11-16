# 📱 Task 16 Quick Reference: Notification System

## 🚀 Quick Start

### Enable Notifications
```typescript
import {notificationService} from './src/services/notification.service';

// Request permissions
const hasPermission = await notificationService.requestPermissions();

// Schedule daily reminder
await notificationService.scheduleDailyReminder('08:00', undefined, 5);
```

### Use Auto-Sync Hook
```typescript
import {useNotificationSync} from './src/hooks/useNotificationSync';

function MyComponent() {
  useNotificationSync(); // Automatically syncs notifications
  return <View>...</View>;
}
```

## 📋 Key Methods

### notificationService.initialize()
Initializes notification channels and listeners.
```typescript
await notificationService.initialize();
```

### notificationService.requestPermissions()
Requests notification permissions from user.
```typescript
const granted = await notificationService.requestPermissions();
```

### notificationService.checkPermissions()
Checks if permissions are granted.
```typescript
const hasPermission = await notificationService.checkPermissions();
```

### notificationService.scheduleDailyReminder()
Schedules daily reminder notification.
```typescript
await notificationService.scheduleDailyReminder(
  '08:00',           // Time (HH:MM)
  'Custom message',  // Optional message
  5                  // Optional current day
);
```

### notificationService.cancelDailyReminder()
Cancels daily reminder.
```typescript
await notificationService.cancelDailyReminder();
```

### notificationService.sendMilestoneNotification()
Sends milestone achievement notification.
```typescript
await notificationService.sendMilestoneNotification(
  7,                    // Day number
  'Title',             // Optional title
  'Congratulations!'   // Optional message
);
```

## 🎯 Motivational Messages

8 unique Bengali messages that rotate:
1. আজকের কাজ এবং নিশ্চিতকরণ দেখুন। আল্লাহ আপনার সাথে আছেন! 💪
2. নতুন দিন, নতুন সুযোগ! আজকের লক্ষ্য অর্জন করুন। 🌟
3. আলহামদুলিল্লাহ! আরেকটি ধূমপানমুক্ত দিন শুরু করুন। 🙏
4. আপনি শক্তিশালী! আজকের চ্যালেঞ্জ মোকাবেলা করুন। 💚
5. প্রতিটি দিন একটি বিজয়! আজকের কাজ সম্পূর্ণ করুন। ✨
6. আল্লাহ আপনার প্রচেষ্টা দেখছেন। চালিয়ে যান! 🌙
7. আপনি অসাধারণ কাজ করছেন! আজও সফল হবেন। 🎯
8. সবর করুন, আল্লাহ সবরকারীদের সাথে আছেন। 🤲

## 🔧 Settings Integration

### Update Notification Settings
```typescript
import {useSettings} from './src/context/SettingsContext';

const {updateNotifications} = useSettings();

// Enable daily reminders
await updateNotifications({
  dailyReminder: true,
  dailyReminderTime: '08:00',
});

// Disable notifications
await updateNotifications({
  enabled: false,
});
```

### Settings Structure
```typescript
{
  notifications: {
    enabled: boolean;
    dailyReminder: boolean;
    dailyReminderTime: string; // HH:MM
    prayerTimes: boolean;
    milestones: boolean;
    encouragement: boolean;
  }
}
```

## 🧪 Testing

### Run Tests
```bash
npm test -- src/hooks/__tests__/useNotificationSync.test.ts
npm test -- src/services/__tests__/notification.service.test.ts
```

### Mock Notification Service
```typescript
jest.mock('./src/services/notification.service');

const mockNotificationService = notificationService as jest.Mocked<
  typeof notificationService
>;

mockNotificationService.requestPermissions.mockResolvedValue(true);
```

## 🔗 Deep Linking

### Notification Data Structure
```typescript
{
  screen: 'Daily' | 'Home' | 'Progress' | 'Journal' | 'CravingSOS',
  params?: any
}
```

### Handle Navigation
```typescript
// Automatically handled by notification service
// Tapping notification navigates to specified screen
```

## 📱 Platform Differences

### Android
- Requires notification channel
- Uses `AndroidImportance.HIGH`
- Custom small icon: `ic_notification`

### iOS
- Uses category IDs
- Default sound
- No channel required

## ⚠️ Common Issues

### Permission Denied
```typescript
// Check permission status
const hasPermission = await notificationService.checkPermissions();

if (!hasPermission) {
  // Show settings prompt
  Alert.alert(
    'নোটিফিকেশন বন্ধ আছে',
    'সেটিংস থেকে নোটিফিকেশন চালু করুন'
  );
}
```

### Notification Not Showing
```typescript
// Verify:
1. Permissions granted
2. Notification enabled in settings
3. Daily reminder enabled
4. Valid time format (HH:MM)
5. App not in battery saver mode
```

### Time Not Updating
```typescript
// Cancel and reschedule
await notificationService.cancelDailyReminder();
await notificationService.scheduleDailyReminder(newTime);
```

## 🎨 Customization

### Custom Message
```typescript
await notificationService.scheduleDailyReminder(
  '08:00',
  'আপনার কাস্টম বার্তা এখানে',
  currentDay
);
```

### Custom Notification
```typescript
await notificationService.scheduleNotification(
  'Custom Title',
  'Custom Message',
  Date.now() + 3600000, // 1 hour from now
  'custom-notification-id'
);
```

## 📊 Monitoring

### Get Scheduled Notifications
```typescript
const scheduled = await notificationService.getScheduledNotifications();
console.log('Scheduled:', scheduled);
```

### Cancel All Notifications
```typescript
await notificationService.cancelAllNotifications();
```

## 🔄 Auto-Sync Behavior

The `useNotificationSync` hook automatically:
1. ✅ Monitors settings changes
2. ✅ Checks permissions
3. ✅ Schedules/cancels reminders
4. ✅ Handles errors gracefully
5. ✅ Updates on time changes
6. ✅ Includes current day

## 💡 Best Practices

1. **Always check permissions** before scheduling
2. **Handle errors gracefully** with try-catch
3. **Use Bengali messages** for consistency
4. **Include current day** for personalization
5. **Test on both platforms** (Android & iOS)
6. **Cancel before rescheduling** to avoid duplicates
7. **Use auto-sync hook** in root component
8. **Provide user feedback** on permission denial

## 📚 Related Files

- `App.tsx` - Initialization
- `src/services/notification.service.ts` - Core service
- `src/hooks/useNotificationSync.ts` - Auto-sync hook
- `src/navigation/RootNavigator.tsx` - Hook integration
- `src/screens/SettingsScreen.tsx` - Settings UI
- `src/context/SettingsContext.tsx` - Settings management

---

**Quick Tip**: Use `useNotificationSync()` in RootNavigator for automatic notification management!
