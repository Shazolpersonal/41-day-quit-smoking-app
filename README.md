# ৪১ দিনে ধূমপান ত্যাগ (41 Day Quit Smoking App)

A React Native mobile application to help users quit smoking in 41 days with Islamic values and guidance.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **React Native CLI** - Install with: `npm install -g react-native-cli`
- **Android Studio** (for Android development)
- **Xcode** (for iOS development - macOS only)

## Installation

1. **Install Node.js dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Install iOS dependencies (macOS only):**
   ```bash
   cd ios
   pod install
   cd ..
   ```

## Running the App

### Android

```bash
npm run android
# or
yarn android
```

### iOS (macOS only)

```bash
npm run ios
# or
yarn ios
```

## Development

### Start Metro Bundler

```bash
npm start
# or
yarn start
```

### Linting

```bash
npm run lint
# or
yarn lint
```

### Testing

```bash
npm test
# or
yarn test
```

## Project Structure

```
src/
├── screens/              # All screen components
├── components/           # Reusable UI components
│   ├── common/
│   ├── home/
│   ├── daily/
│   └── craving/
├── navigation/           # Navigation configuration
├── context/              # Global state management
├── services/             # Business logic services
├── models/               # Data models and types
├── data/                 # Static content data
├── utils/                # Utility functions
├── constants/            # App constants
│   ├── colors.ts
│   ├── strings.ts
│   └── config.ts
└── assets/               # Images, fonts, audio
    ├── images/
    ├── fonts/
    └── audio/
```

## Features

- 41-day structured quit smoking program
- Daily tasks and affirmations in Bangla
- Islamic content integration (duas, dhikr, Quran verses)
- Craving management with SOS support
- Progress tracking and milestone celebrations
- Journal for tracking triggers and moods
- Prayer time notifications
- Offline-first functionality
- Data privacy and security

## Technology Stack

- **Framework:** React Native 0.72+
- **Language:** TypeScript
- **State Management:** React Context API + AsyncStorage
- **Navigation:** React Navigation 6
- **UI Components:** React Native Paper
- **Notifications:** Notifee
- **Date/Time:** date-fns
- **Icons:** React Native Vector Icons

## Configuration

### Bangla Font Setup

The app uses Noto Sans Bengali font. Font files should be placed in:
- `src/assets/fonts/NotoSansBengali-Regular.ttf`
- `src/assets/fonts/NotoSansBengali-Medium.ttf`
- `src/assets/fonts/NotoSansBengali-Bold.ttf`

Download from: [Google Fonts - Noto Sans Bengali](https://fonts.google.com/noto/specimen/Noto+Sans+Bengali)

### App Icons and Splash Screen

- Android icons: `android/app/src/main/res/mipmap-*/`
- iOS icons: `ios/QuitSmokingApp/Images.xcassets/AppIcon.appiconset/`

## Requirements

This app implements the following key requirements:

- User onboarding and profile setup (Req 1)
- Daily progress tracking (Req 2)
- Daily content and task management (Req 3)
- Craving management and emergency support (Req 4)
- Islamic content integration (Req 5)
- Journal and trigger tracking (Req 6)
- Milestone celebrations (Req 7)
- Offline functionality (Req 8)
- Notification system (Req 9)
- Bangla UI with Islamic theme (Req 10)
- Data privacy and security (Req 11)
- Settings and customization (Req 12)

## License

Private - All rights reserved

## Support

For issues or questions, please contact the development team.
