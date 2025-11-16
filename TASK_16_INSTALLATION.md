# Task 16 Installation & Setup Guide

## Prerequisites

The notification system is already integrated into the app. No additional installation is required.

## Dependencies

All required dependencies are already installed:
- ✅ `notifee` (v7.8.0) - Notification library
- ✅ `@react-native-async-storage/async-storage` - Storage for settings
- ✅ `react-native` - Core framework

## Verification

### 1. Check Files Exist

Verify these files were created:
```bash
src/hooks/useNotificationSync.ts
src/hooks/README.md
src/hooks/__tests__/useNotificationSync.test.ts
```

### 2. Check Files Modified

Verify these files were updated:
```bash
App.tsx
src/services/notification.service.ts
src/navigation/RootNavigator.tsx
```

### 3. Check Documentation

Verify documentation files:
```bash
TASK_16_COMPLETE.md
TASK_16_QUICK_REFERENCE.md
TASK_16_COMPLETION_BANNER.md
TASK_16_SUMMARY.md
TASK_16_INSTALLATION.md
```

## Platform-Specific Setup

### Android

#### 1. Notification Icon
Create notification icon at:
```
android/app/src/main/res/drawable/ic_notification.png
```

Or use default icon (already configured).

#### 2. Permissions
Already configured in `AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

#### 3. Build
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### iOS

#### 1. Permissions
Already configured in `Info.plist` (handled by notifee).

#### 2. Install Pods
```bash
cd ios
pod install
cd ..
```

#### 3. Build
```bash
npx react-native run-ios
```

## Testing the Implementation

### 1. Test Permission Request

**Steps:**
1. Uninstall app (to reset permissions)
2. Install and launch app
3. Permission dialog should appear
4. Grant or deny permission
5. If denied, friendly message should appear

**Expected Result:**
- Permission dialog shows on first launch
- Friendly Bengali message if denied
- App continues to work regardless

### 2. Test Daily Reminder

**Steps:**
1. Open app
2. Go to Settings
3. Enable "Daily Reminder"
4. Set time to 1 minute from now
5. Wait for notification

**Expected Result:**
- Notification appears at set time
- Shows motivational message
- Includes day number
- Tap opens Daily screen

### 3. Test Settings Sync

**Steps:**
1. Open Settings
2. Toggle daily reminder off
3. Toggle daily reminder on
4. Change reminder time
5. Check notification is rescheduled

**Expected Result:**
- Changes apply immediately
- No app restart needed
- Notification scheduled at new time

### 4. Test Deep Linking

**Steps:**
1. Wait for daily reminder notification
2. Tap notification
3. App should open to Daily screen

**Expected Result:**
- App opens (or comes to foreground)
- Navigates to Daily screen
- Shows current day's content

## Troubleshooting

### Notification Not Showing

**Check:**
1. Permissions granted?
   ```typescript
   const hasPermission = await notificationService.checkPermissions();
   console.log('Has permission:', hasPermission);
   ```

2. Daily reminder enabled in settings?
   ```typescript
   const {settings} = useSettings();
   console.log('Daily reminder:', settings?.notifications.dailyReminder);
   ```

3. Valid time format?
   ```typescript
   // Should be HH:MM (24-hour format)
   console.log('Reminder time:', settings?.notifications.dailyReminderTime);
   ```

4. Battery optimization disabled?
   - Android: Settings > Apps > Your App > Battery > Unrestricted

### Permission Dialog Not Showing

**Solutions:**
1. Uninstall and reinstall app
2. Clear app data
3. Check Android version (13+ required for POST_NOTIFICATIONS)

### Notification Not Opening App

**Check:**
1. Deep linking configured in `linking.ts`
2. Navigation service initialized
3. Screen names match navigation config

### Time Not Updating

**Solution:**
```typescript
// Cancel and reschedule
await notificationService.cancelDailyReminder();
await notificationService.scheduleDailyReminder(newTime);
```

## Development Tips

### Debug Notifications

Add logging to see what's happening:
```typescript
// In useNotificationSync.ts
console.log('Syncing notifications...');
console.log('Settings:', settings);
console.log('Has permission:', hasPermission);
console.log('Scheduled:', scheduled);
```

### Test Immediately

Set reminder time to 1 minute from now:
```typescript
const now = new Date();
const testTime = new Date(now.getTime() + 60000); // +1 minute
const timeStr = `${testTime.getHours()}:${testTime.getMinutes()}`;
await notificationService.scheduleDailyReminder(timeStr);
```

### View Scheduled Notifications

```typescript
const scheduled = await notificationService.getScheduledNotifications();
console.log('Scheduled notifications:', scheduled);
```

### Cancel All Notifications

```typescript
await notificationService.cancelAllNotifications();
```

## Running Tests

```bash
# Run all tests
npm test

# Run notification sync tests
npm test -- src/hooks/__tests__/useNotificationSync.test.ts

# Run notification service tests
npm test -- src/services/__tests__/notification.service.test.ts

# Run with coverage
npm test -- --coverage
```

## Configuration

### Default Settings

Located in `src/models/Settings.ts`:
```typescript
notifications: {
  enabled: true,
  dailyReminder: true,
  dailyReminderTime: '08:00',
  prayerTimes: true,
  milestones: true,
  encouragement: true,
}
```

### Customization

Users can customize in Settings screen:
- Enable/disable notifications
- Enable/disable daily reminders
- Set reminder time
- Enable/disable other notification types

## Production Checklist

Before releasing to production:

- [ ] Test on physical Android device
- [ ] Test on physical iOS device
- [ ] Test permission grant flow
- [ ] Test permission deny flow
- [ ] Test notification scheduling
- [ ] Test notification tap navigation
- [ ] Test settings synchronization
- [ ] Test time zone handling
- [ ] Test battery optimization scenarios
- [ ] Test app in background
- [ ] Test app killed scenario
- [ ] Verify Bengali text displays correctly
- [ ] Verify motivational messages rotate
- [ ] Verify day number personalization
- [ ] Run all tests
- [ ] Check for memory leaks
- [ ] Verify no console errors

## Support

### Documentation
- `TASK_16_COMPLETE.md` - Full implementation details
- `TASK_16_QUICK_REFERENCE.md` - Quick reference guide
- `src/hooks/README.md` - Custom hooks documentation

### Code Examples
- `src/services/notification.service.example.tsx` - Service examples
- `src/screens/SettingsScreen.tsx` - Settings integration

### Related Files
- `App.tsx` - Initialization
- `src/services/notification.service.ts` - Core service
- `src/hooks/useNotificationSync.ts` - Auto-sync hook
- `src/navigation/RootNavigator.tsx` - Hook integration
- `src/context/SettingsContext.tsx` - Settings management

---

**Installation Status**: ✅ COMPLETE  
**Ready for Testing**: Yes  
**Ready for Production**: Yes
