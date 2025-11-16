# Task 15: Navigation System - Quick Reference

## 🚀 Quick Start

### Import Navigation
```typescript
import {useNavigation} from '@react-navigation/native';
import {navigate, goBack} from '../navigation/navigationService';
```

### Navigate to Screen
```typescript
// In component
navigation.navigate('CravingSOS');

// From anywhere
navigate('CravingSOS');
```

### Navigate with Parameters
```typescript
navigation.navigate('JournalDetail', {entryId: '123'});
navigate('Daily', {day: 5});
```

### Go Back
```typescript
navigation.goBack();
goBack();
```

## 📱 Tab Navigation

### Switch Tabs
```typescript
navigation.navigate('Home');
navigation.navigate('Daily');
navigation.navigate('Progress');
navigation.navigate('Journal');
navigation.navigate('Settings');
```

### Tab with Parameters
```typescript
navigation.navigate('Daily', {day: 5});
```

## 🔗 Deep Links

### URL Patterns
```
quitsmokingapp://home
quitsmokingapp://daily/5
quitsmokingapp://journal/abc123
quitsmokingapp://craving-sos
quitsmokingapp://progress
quitsmokingapp://settings
```

### Test Deep Link (Android)
```bash
adb shell am start -W -a android.intent.action.VIEW -d "quitsmokingapp://daily/5"
```

## 🔔 Notification Navigation

### Add Navigation Data
```typescript
await notifee.displayNotification({
  title: 'Title',
  body: 'Message',
  data: {
    screen: 'Daily',
    params: JSON.stringify({day: 5}),
  },
});
```

### Supported Screens
- `Home` - Home screen
- `Daily` - Daily content
- `Progress` - Progress screen
- `Journal` - Journal list
- `CravingSOS` - Craving SOS modal

## 📂 File Structure

```
src/navigation/
├── RootNavigator.tsx          # Main stack
├── MainTabNavigator.tsx       # Bottom tabs
├── navigationService.ts       # Utilities
├── linking.ts                 # Deep links
├── animations.ts              # Transitions
├── index.ts                   # Exports
├── README.md                  # Docs
└── __tests__/                 # Tests
```

## 🎨 Styling

### Tab Bar Colors
- Active: `#2E7D32` (Islamic Green)
- Inactive: `#757575` (Gray)
- Background: `#FFFFFF` (White)

### Header Colors
- Background: `#2E7D32` (Islamic Green)
- Text: `#FFFFFF` (White)

## 🎬 Animations

### Types
- **Fade**: 300ms - Tab switches
- **Slide Right**: 300ms - Standard
- **Slide Bottom**: 400ms - Modals

### Custom Animation
```typescript
import {fadeAnimation} from '../navigation/animations';

<Stack.Screen
  name="MyScreen"
  component={MyScreen}
  options={fadeAnimation}
/>
```

## 🔧 Utilities

### Navigate
```typescript
navigate('ScreenName', {param: 'value'});
```

### Go Back
```typescript
goBack();
```

### Reset Stack
```typescript
reset('MainTabs');
```

### Get Current Route
```typescript
const route = getCurrentRoute();
console.log(route?.name);
```

## 📝 Type Safety

### Screen Props
```typescript
import {HomeScreenProps} from '../types/navigation';

function HomeScreen({navigation, route}: HomeScreenProps) {
  // Fully typed navigation and route
}
```

### Navigation Hook
```typescript
const navigation = useNavigation<HomeScreenProps['navigation']>();
```

## 🧪 Testing

### Mock Navigation
```typescript
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
};

<MyScreen navigation={mockNavigation} />
```

## 📚 Documentation

See `src/navigation/README.md` for:
- Detailed usage examples
- Integration guides
- Testing strategies
- Best practices

## ✅ Checklist

- [x] Bottom tab navigator (5 tabs)
- [x] Stack navigation
- [x] Screen transitions
- [x] Deep linking
- [x] Notification integration
- [x] Type safety
- [x] Documentation
- [x] Tests

## 🎯 Common Tasks

### Add New Screen
1. Add to `RootStackParamList` in `types/navigation.ts`
2. Add screen to `RootNavigator.tsx`
3. Update deep linking in `linking.ts`

### Add New Tab
1. Add to `MainTabParamList` in `types/navigation.ts`
2. Add tab to `MainTabNavigator.tsx`
3. Add icon from Material Community Icons

### Change Animation
```typescript
<Stack.Screen
  name="MyScreen"
  component={MyScreen}
  options={{
    animation: 'slide_from_bottom',
    animationDuration: 400,
  }}
/>
```

## 🐛 Troubleshooting

### Navigation Not Working
- Check if NavigationContainer is set up in App.tsx
- Verify screen is registered in navigator
- Check route name spelling

### Deep Link Not Working
- Verify URL scheme in linking.ts
- Check Android manifest configuration
- Test with adb command

### Type Errors
- Ensure screen is in ParamList
- Check parameter types match
- Update navigation types

## 📞 Support

For issues or questions:
1. Check `src/navigation/README.md`
2. Review test files for examples
3. Check React Navigation docs

---

**Quick Reference Version**: 1.0  
**Last Updated**: November 16, 2025  
**Task**: 15 - Navigation System
