# Offline Functionality Documentation

## Overview

The 41-Day Quit Smoking App is designed to work completely offline. All daily content is bundled with the app, and all user data is stored locally using AsyncStorage. This ensures users can access the app and track their progress without an internet connection.

## Key Features

### 1. **Offline-First Architecture**
- All static content (daily content, Islamic content, health timeline, milestones) is bundled with the app
- No external API calls required for core functionality
- All user data stored locally using AsyncStorage

### 2. **Network Status Monitoring**
- Real-time network connectivity monitoring using `@react-native-community/netinfo`
- Visual indicator when app is offline
- Graceful handling of network state changes

### 3. **Local Data Storage**
- User profile data
- Progress tracking
- Journal entries
- Task completions
- Settings
- Craving logs

## Components

### OfflineService (`src/services/offline.service.ts`)

Main service for managing offline functionality.

#### Methods:

**`isOfflineReady(): Promise<boolean>`**
- Checks if app has all required data to work offline
- Returns true if user data exists

**`verifyStaticContent(): boolean`**
- Verifies all static content is bundled with app
- Checks daily content, Islamic content, health timeline, and milestones

**`getOfflineStatus(): Promise<OfflineStatus>`**
- Returns complete offline status information
- Includes data availability for all storage types

**`prepareForOffline(): Promise<boolean>`**
- Prepares app for offline use
- Creates initial progress and settings data if missing

**`exportData(): Promise<string | null>`**
- Exports all user data as JSON string
- Useful for backup purposes

**`getStorageInfo(): Promise<StorageInfo>`**
- Returns storage usage information
- Includes sizes and counts for all data types

### OfflineIndicator Component (`src/components/common/OfflineIndicator.tsx`)

Visual indicator displayed when app is offline.

#### Props:
- `showWhenOnline?: boolean` - Show indicator even when online (for testing)

#### Features:
- Automatically shows/hides based on network status
- Displays friendly message in Bangla
- Non-intrusive banner design

### useNetworkStatus Hook (`src/hooks/useNetworkStatus.ts`)

React hook for monitoring network connectivity.

#### Returns:
```typescript
{
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
}
```

#### Usage:
```typescript
const {isConnected} = useNetworkStatus();

if (!isConnected) {
  // Handle offline state
}
```

## Data Storage Strategy

### AsyncStorage Keys:
- `@quit_smoking_user` - User profile data
- `@quit_smoking_progress` - Progress tracking data
- `@quit_smoking_journal_entries` - Journal entries
- `@quit_smoking_task_completions` - Task completion records
- `@quit_smoking_settings` - App settings
- `@quit_smoking_craving_logs` - Craving log entries

### Data Persistence:
All data is automatically persisted to AsyncStorage through the StorageService. Context providers (UserContext, ProgressContext, etc.) handle data synchronization.

## Bundled Static Content

### Daily Content (`src/data/dailyContent.ts`)
- 41 days of content
- Tasks, affirmations, Islamic reminders, craving tips
- All in Bangla language

### Islamic Content (`src/data/islamicContent.ts`)
- Duas (supplications)
- Dhikr (remembrance)
- Islamic quotes
- Quran verses with translations

### Health Timeline (`src/data/healthTimeline.ts`)
- Health benefits at different timeframes
- From 20 minutes to 15 years
- Medical research-based information

### Milestones (`src/data/milestones.ts`)
- Achievement milestones (days 1, 3, 7, 14, 21, 30, 41)
- Celebration messages
- Badge system

## Testing

### Unit Tests:
- `src/services/__tests__/offline.service.test.ts`
- `src/components/common/__tests__/OfflineIndicator.test.tsx`
- `src/hooks/__tests__/useNetworkStatus.test.ts`

### Running Tests:
```bash
npm test
```

## Implementation Checklist

✅ **Requirement 8.1: Bundle all daily content with app**
- All 41 days of content in `src/data/dailyContent.ts`
- Islamic content in `src/data/islamicContent.ts`
- Health timeline in `src/data/healthTimeline.ts`
- Milestones in `src/data/milestones.ts`

✅ **Requirement 8.2: Store all user data locally using AsyncStorage**
- StorageService implements AsyncStorage wrapper
- All contexts use StorageService for persistence
- Data validation and error handling included

✅ **Requirement 8.3: Implement offline-first data strategy**
- OfflineService manages offline functionality
- Data stored locally before any operations
- No external API dependencies

✅ **Requirement 8.4: Handle app functionality without internet**
- All features work offline
- Network status monitoring
- Graceful degradation

✅ **Requirement 8.5: Add offline indicator in UI if needed**
- OfflineIndicator component
- Automatic show/hide based on network status
- User-friendly Bangla messages

## Usage Examples

### Check Offline Readiness:
```typescript
import {offlineService} from './services/offline.service';

const isReady = await offlineService.isOfflineReady();
if (isReady) {
  console.log('App is ready for offline use');
}
```

### Monitor Network Status:
```typescript
import {useNetworkStatus} from './hooks/useNetworkStatus';

function MyComponent() {
  const {isConnected} = useNetworkStatus();
  
  return (
    <View>
      {!isConnected && <Text>You are offline</Text>}
    </View>
  );
}
```

### Export User Data:
```typescript
import {offlineService} from './services/offline.service';

const exportData = async () => {
  const data = await offlineService.exportData();
  if (data) {
    // Save to file or share
  }
};
```

## Troubleshooting

### Issue: Offline indicator not showing
**Solution:** Check if NetInfo is properly installed and linked:
```bash
npm install @react-native-community/netinfo
cd ios && pod install
```

### Issue: Data not persisting
**Solution:** Verify AsyncStorage is properly installed:
```bash
npm install @react-native-async-storage/async-storage
cd ios && pod install
```

### Issue: Static content not loading
**Solution:** Ensure all data files are properly imported and bundled with the app. Check that no dynamic imports are used for static content.

## Best Practices

1. **Always use StorageService** for data persistence
2. **Test offline functionality** regularly during development
3. **Handle errors gracefully** - app should never crash due to storage errors
4. **Validate data** before saving to storage
5. **Keep static content updated** - review and update content regularly
6. **Monitor storage usage** - use `getStorageInfo()` to track data growth

## Future Enhancements

- Cloud backup/sync when online (optional)
- Data compression for large journal entries
- Automatic data cleanup for old entries
- Export/import functionality for data migration
- Offline analytics tracking

## Support

For issues or questions about offline functionality:
1. Check this documentation
2. Review test files for usage examples
3. Check console logs for error messages
4. Verify all dependencies are properly installed
