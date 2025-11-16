# Installation Instructions for Tasks 14.5 & 14.6

## 📦 New Dependencies

A new dependency has been added to support the date/time picker functionality:

```json
"@react-native-community/datetimepicker": "^7.6.1"
```

## 🔧 Installation Steps

### 1. Install Dependencies

Run the following command in your project root:

```bash
npm install
```

Or if using yarn:

```bash
yarn install
```

### 2. iOS Specific Setup (if applicable)

For iOS, you need to install the pods:

```bash
cd ios
pod install
cd ..
```

### 3. Android Specific Setup

No additional setup required for Android. The package will be auto-linked.

## 🚀 Running the App

After installation, you can run the app:

### Android
```bash
npm run android
```

### iOS
```bash
npm run ios
```

## ✅ Verification

To verify the implementation is working:

1. **Launch the app**
2. **Navigate to Settings screen**
3. **Verify new sections are visible:**
   - Privacy & Security section
   - Data Management section
   - About section

### Test Data Management Features

1. **Export Data**
   - Tap "ডেটা এক্সপোর্ট করুন" button
   - Share dialog should appear
   - Verify you can save/share the data

2. **App Version**
   - Check "অ্যাপ ভার্সন" displays "1.0.0"

3. **Help**
   - Tap "সাহায্য" button
   - Verify help dialog appears with instructions

4. **Reset Data**
   - Tap "সমস্ত ডেটা মুছে ফেলুন" button
   - Verify warning dialog appears
   - Test both cancel and confirm options

### Test Privacy & Security Features

1. **PIN Lock**
   - Toggle "পিন লক" switch ON
   - Verify PIN setup form appears
   - Enter a 4-6 digit PIN
   - Confirm the PIN
   - Verify success message
   - Toggle OFF to disable

2. **Biometric Authentication**
   - Ensure PIN lock is enabled first
   - Toggle "বায়োমেট্রিক প্রমাণীকরণ" switch
   - Verify it saves successfully
   - Try enabling without PIN (should show warning)

## 🧪 Running Tests

To run the test suite:

```bash
npm test
```

Or for watch mode:

```bash
npm test -- --watch
```

### Specific Test File

To run only the Settings screen tests:

```bash
npm test -- SettingsScreen.test.tsx
```

## 🐛 Troubleshooting

### Issue: DateTimePicker not found

**Solution:**
```bash
# Clean install
rm -rf node_modules
npm install

# For iOS
cd ios
rm -rf Pods
pod install
cd ..
```

### Issue: Module resolution errors

**Solution:**
```bash
# Clear Metro bundler cache
npm start -- --reset-cache
```

### Issue: Build errors on iOS

**Solution:**
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Issue: Build errors on Android

**Solution:**
```bash
cd android
./gradlew clean
cd ..
```

## 📱 Platform Support

### iOS
- ✅ iOS 12.0 and above
- ✅ Supports Face ID and Touch ID for biometric

### Android
- ✅ Android 5.0 (API 21) and above
- ✅ Supports fingerprint authentication

## 🔒 Security Notes

### Current Implementation
- PIN is stored in AsyncStorage via SettingsContext
- Biometric toggle is saved but actual authentication not yet implemented
- Data export creates unencrypted JSON backup

### Production Recommendations
1. **Encrypt PIN**: Use react-native-keychain or similar
2. **Implement Biometric Auth**: Use react-native-biometrics
3. **Encrypt Exports**: Add encryption to exported data
4. **Secure Storage**: Consider using encrypted storage for sensitive data

## 📚 Additional Resources

### DateTimePicker Documentation
- [GitHub Repository](https://github.com/react-native-datetimepicker/datetimepicker)
- [API Documentation](https://github.com/react-native-datetimepicker/datetimepicker#readme)

### React Native Share
- [Documentation](https://reactnative.dev/docs/share)

### AsyncStorage
- [Documentation](https://react-native-async-storage.github.io/async-storage/)

## 🎯 Next Steps

After successful installation and verification:

1. ✅ Test all features thoroughly
2. ✅ Verify Bangla text displays correctly
3. ✅ Test on both iOS and Android
4. ✅ Run the test suite
5. ✅ Consider implementing actual biometric authentication
6. ✅ Consider adding PIN encryption
7. ✅ Move to next tasks in the project

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the error messages carefully
3. Check React Native and package documentation
4. Verify all dependencies are correctly installed

## ✅ Checklist

Before considering the installation complete:

- [ ] Dependencies installed successfully
- [ ] iOS pods installed (if applicable)
- [ ] App builds without errors
- [ ] Settings screen displays new sections
- [ ] Export data functionality works
- [ ] Reset data shows confirmation
- [ ] PIN setup flow works
- [ ] Biometric toggle works
- [ ] All text displays in Bangla
- [ ] Tests run successfully

---

**Installation Status**: Ready for deployment
**Last Updated**: November 16, 2025
**Version**: 1.0.0
