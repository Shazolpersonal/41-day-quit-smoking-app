# Setup Instructions for 41 Day Quit Smoking App

## Prerequisites Installation

Since Node.js is not currently installed on your system, follow these steps:

### 1. Install Node.js

**Option A: Using Official Installer (Recommended)**
1. Visit [Node.js official website](https://nodejs.org/)
2. Download the LTS (Long Term Support) version for Windows
3. Run the installer and follow the installation wizard
4. Verify installation by opening a new PowerShell/CMD window and running:
   ```bash
   node --version
   npm --version
   ```

**Option B: Using Chocolatey (if you have it)**
```bash
choco install nodejs-lts
```

### 2. Install React Native Development Tools

After Node.js is installed:

```bash
npm install -g react-native-cli
```

### 3. Install Android Studio (for Android Development)

1. Download [Android Studio](https://developer.android.com/studio)
2. Install Android Studio with default settings
3. During installation, ensure these components are selected:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)
4. Configure Android SDK:
   - Open Android Studio
   - Go to Settings → Appearance & Behavior → System Settings → Android SDK
   - Install Android 13 (API Level 33)
   - Install Android SDK Build-Tools 33.0.0

### 4. Set Environment Variables

Add these to your Windows Environment Variables:

1. **ANDROID_HOME**
   - Value: `C:\Users\YourUsername\AppData\Local\Android\Sdk`

2. **Add to PATH:**
   - `%ANDROID_HOME%\platform-tools`
   - `%ANDROID_HOME%\tools`
   - `%ANDROID_HOME%\tools\bin`

## Project Setup

Once Node.js is installed, navigate to your project directory and run:

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### 2. Setup Bangla Fonts

Follow the instructions in `FONT_SETUP.md` to download and configure Noto Sans Bengali fonts.

### 3. Link Assets

After adding fonts to `src/assets/fonts/`, run:

```bash
npx react-native-asset
```

## Running the App

### Start Metro Bundler

In one terminal window:
```bash
npm start
```

### Run on Android

In another terminal window:
```bash
npm run android
```

**Note:** Make sure you have either:
- An Android device connected via USB with USB debugging enabled, OR
- An Android emulator running from Android Studio

### Run on iOS (macOS only)

```bash
npm run ios
```

## Troubleshooting

### Common Issues

1. **"npx is not recognized"**
   - Node.js is not installed or not in PATH
   - Restart your terminal after installing Node.js

2. **"SDK location not found"**
   - Create `android/local.properties` file with:
     ```
     sdk.dir=C:\\Users\\YourUsername\\AppData\\Local\\Android\\Sdk
     ```

3. **Metro bundler issues**
   - Clear cache: `npm start -- --reset-cache`

4. **Build failures**
   - Clean Android build: `cd android && gradlew clean && cd ..`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Development Workflow

1. **Code Quality:**
   - Run linter: `npm run lint`
   - Format code: `npx prettier --write .`

2. **Testing:**
   - Run tests: `npm test`

3. **Debugging:**
   - Enable Debug Mode: Shake device or press `Ctrl+M` (Android) / `Cmd+D` (iOS)
   - Enable Hot Reload for faster development

## Next Steps

After successful setup:

1. Verify the app launches with the welcome screen
2. Check that Bangla text displays correctly
3. Begin implementing the next tasks from `tasks.md`

## Project Structure Created

```
QuitSmokingApp/
├── src/
│   ├── screens/
│   ├── components/
│   │   ├── common/
│   │   ├── home/
│   │   ├── daily/
│   │   └── craving/
│   ├── navigation/
│   ├── context/
│   ├── services/
│   ├── models/
│   ├── data/
│   ├── utils/
│   ├── constants/
│   │   ├── colors.ts
│   │   ├── strings.ts
│   │   └── config.ts
│   └── assets/
│       ├── images/
│       ├── fonts/
│       └── audio/
├── android/
├── ios/
├── App.tsx
├── index.js
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc.js
└── README.md
```

## Support

If you encounter any issues during setup, please refer to:
- [React Native Documentation](https://reactnative.dev/docs/environment-setup)
- [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
