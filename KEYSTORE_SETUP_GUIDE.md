# Android Keystore Setup Guide

## Overview
This guide will help you create and configure a release keystore for signing your Android app for production.

## Why You Need a Keystore
- Required for publishing to Google Play Store
- Ensures app authenticity and security
- Used for app updates (must use same keystore)
- **CRITICAL**: Losing your keystore means you cannot update your app!

## Step 1: Generate Release Keystore

### Using Command Line (Recommended)

Open terminal in the `android/app` directory and run:

```bash
keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias quitsmokingapp -keyalg RSA -keysize 2048 -validity 10000
```

### Parameters Explained
- `-storetype PKCS12`: Modern keystore format
- `-keystore release.keystore`: Output filename
- `-alias quitsmokingapp`: Key alias (remember this!)
- `-keyalg RSA`: Encryption algorithm
- `-keysize 2048`: Key size (2048 bits minimum)
- `-validity 10000`: Valid for ~27 years

### You Will Be Asked For:
1. **Keystore password**: Choose a strong password (min 6 characters)
2. **Key password**: Can be same as keystore password
3. **Your name**: Your name or organization
4. **Organizational unit**: Your department (optional)
5. **Organization**: Your company name
6. **City/Locality**: Your city
7. **State/Province**: Your state
8. **Country code**: Two-letter country code (e.g., BD for Bangladesh)

### Example Session
```
Enter keystore password: [your_password]
Re-enter new password: [your_password]
What is your first and last name?
  [Unknown]:  John Doe
What is the name of your organizational unit?
  [Unknown]:  Development
What is the name of your organization?
  [Unknown]:  Quit Smoking App
What is the name of your City or Locality?
  [Unknown]:  Dhaka
What is the name of your State or Province?
  [Unknown]:  Dhaka
What is the two-letter country code for this unit?
  [Unknown]:  BD
Is CN=John Doe, OU=Development, O=Quit Smoking App, L=Dhaka, ST=Dhaka, C=BD correct?
  [no]:  yes

Enter key password for <quitsmokingapp>
        (RETURN if same as keystore password):  [press ENTER or enter password]
```

## Step 2: Secure Your Keystore

### CRITICAL: Backup Your Keystore
1. Copy `release.keystore` to a secure location
2. Store in multiple secure locations:
   - Encrypted cloud storage (Google Drive, Dropbox)
   - External hard drive
   - Password manager (as attachment)
3. **Never commit to Git** (already in .gitignore)

### Store Credentials Securely
Create a file `keystore.properties` in `android/` directory:

```properties
storePassword=your_keystore_password
keyPassword=your_key_password
keyAlias=quitsmokingapp
storeFile=release.keystore
```

**IMPORTANT**: Add to `.gitignore`:
```
android/keystore.properties
```

## Step 3: Configure Gradle

### Option A: Using keystore.properties (Recommended)

Update `android/app/build.gradle`:

```gradle
// Load keystore properties
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            ...
        }
    }
}
```

### Option B: Using Environment Variables

Set environment variables:
```bash
# Windows (PowerShell)
$env:KEYSTORE_PASSWORD="your_password"
$env:KEY_ALIAS="quitsmokingapp"
$env:KEY_PASSWORD="your_password"

# Windows (CMD)
set KEYSTORE_PASSWORD=your_password
set KEY_ALIAS=quitsmokingapp
set KEY_PASSWORD=your_password

# Linux/Mac
export KEYSTORE_PASSWORD="your_password"
export KEY_ALIAS="quitsmokingapp"
export KEY_PASSWORD="your_password"
```

Update `android/app/build.gradle`:
```gradle
signingConfigs {
    release {
        storeFile file('release.keystore')
        storePassword System.getenv("KEYSTORE_PASSWORD")
        keyAlias System.getenv("KEY_ALIAS")
        keyPassword System.getenv("KEY_PASSWORD")
    }
}
```

## Step 4: Verify Configuration

### Test Build
```bash
cd android
gradlew assembleRelease
```

### Check Output
If successful, you'll find the APK at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Verify Signature
```bash
keytool -list -v -keystore android/app/release.keystore -alias quitsmokingapp
```

## Step 5: Build for Production

### Build APK
```bash
npm run android:build
```

### Build App Bundle (for Play Store)
```bash
npm run android:bundle
```

Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Troubleshooting

### Error: "Keystore was tampered with, or password was incorrect"
- Check your password
- Ensure you're using the correct keystore file
- Verify keystore.properties has correct values

### Error: "Failed to read key from keystore"
- Check key alias is correct
- Verify key password
- Ensure keystore file is not corrupted

### Error: "Could not find or load main class"
- Ensure Java is installed
- Check JAVA_HOME environment variable
- Try using full path to keytool

## Security Best Practices

### DO:
✅ Use strong passwords (min 12 characters, mixed case, numbers, symbols)
✅ Store keystore in multiple secure locations
✅ Use password manager for credentials
✅ Backup keystore before any changes
✅ Use environment variables in CI/CD
✅ Restrict access to keystore files

### DON'T:
❌ Commit keystore to version control
❌ Share keystore via email or messaging
❌ Use simple passwords
❌ Store passwords in plain text files
❌ Use same keystore for multiple apps
❌ Forget to backup keystore

## CI/CD Integration

### GitHub Actions Example
```yaml
- name: Build Release APK
  env:
    KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
    KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
    KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
  run: |
    echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > android/app/release.keystore
    cd android
    ./gradlew assembleRelease
```

Store in GitHub Secrets:
- `KEYSTORE_BASE64`: Base64 encoded keystore file
- `KEYSTORE_PASSWORD`: Keystore password
- `KEY_ALIAS`: Key alias
- `KEY_PASSWORD`: Key password

### Encode Keystore for CI/CD
```bash
# Windows (PowerShell)
[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.keystore"))

# Linux/Mac
base64 release.keystore
```

## Recovery

### If You Lose Your Keystore
Unfortunately, there's no way to recover a lost keystore. You will need to:
1. Create a new keystore
2. Publish as a new app (new package name)
3. Migrate users to new app

This is why **backup is critical**!

### If You Forget Your Password
There's no way to recover the password. You'll need to create a new keystore.

## Play Store Upload

### First Time Upload
1. Go to Google Play Console
2. Create new app
3. Upload AAB file
4. Complete store listing
5. Submit for review

### Updates
1. Increment versionCode in build.gradle
2. Build new AAB with same keystore
3. Upload to Play Console
4. Submit update

## Additional Resources

- [Android Developer Guide - Sign Your App](https://developer.android.com/studio/publish/app-signing)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Keystore Best Practices](https://developer.android.com/studio/publish/app-signing#secure-key)

---

**Remember**: Your keystore is the key to your app's identity. Treat it like a password - secure it, backup it, never share it!
