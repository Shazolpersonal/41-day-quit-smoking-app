# Error Handling and Validation

This directory contains comprehensive error handling and validation utilities for the app.

## Error Handler

### Global Error Handler (`errorHandler.ts`)

Centralized error handling system that:
- Catches and logs all errors
- Shows user-friendly messages in Bangla
- Categorizes errors by type
- Stores error history

**Usage:**
```tsx
import {errorHandler} from './utils/errorHandler';

try {
  await someOperation();
} catch (error) {
  errorHandler.handle(error, 'someOperation');
}
```

### Error Types

- `STORAGE` - AsyncStorage errors
- `NETWORK` - Network/API errors
- `VALIDATION` - Form validation errors
- `PERMISSION` - Permission errors
- `UNKNOWN` - Other errors

### Retry Mechanism

Automatically retry failed operations:

```tsx
import {retryOperation} from './utils/errorHandler';

const result = await retryOperation(
  () => storage.saveUser(user),
  3, // max retries
  1000, // delay in ms
  'saveUser' // context
);
```

### Safe Async Wrapper

Execute async operations with fallback:

```tsx
import {safeAsync} from './utils/errorHandler';

const data = await safeAsync(
  () => storage.getUser(),
  null, // fallback value
  'getUser' // context
);
```

## Validation

### Validation Functions (`validation.ts`)

#### Onboarding Data
```tsx
import {validateOnboardingData} from './utils/validation';

const result = validateOnboardingData({
  quitDate: '2024-01-01',
  cigarettesPerDay: 10,
  pricePerPack: 150,
  cigarettesPerPack: 20,
});

if (!result.isValid) {
  console.log(result.errors);
}
```

#### Journal Entry
```tsx
import {validateJournalEntry} from './utils/validation';

const result = validateJournalEntry({
  content: 'আজ ভালো লাগছে',
  mood: 'happy',
  cravingIntensity: 5,
});
```

#### Emergency Contact
```tsx
import {validateEmergencyContact} from './utils/validation';

const result = validateEmergencyContact({
  name: 'জন ডো',
  phone: '01712345678',
  relationship: 'বন্ধু',
});
```

#### PIN Code
```tsx
import {validatePIN} from './utils/validation';

const result = validatePIN('1357');
```

#### Phone Number
```tsx
import {isValidPhoneNumber} from './utils/validation';

if (isValidPhoneNumber('01712345678')) {
  // Valid Bangladesh phone number
}
```

### Form Validation Hook

Use the `useFormValidation` hook for form state management:

```tsx
import {useFormValidation} from './hooks/useFormValidation';
import {validateOnboardingData} from './utils/validation';

const [formState, formActions] = useFormValidation(
  {
    quitDate: '',
    cigarettesPerDay: 0,
    pricePerPack: 0,
    cigarettesPerPack: 20,
  },
  validateOnboardingData
);

// Set field value
formActions.setFieldValue('cigarettesPerDay', 10);

// Validate field
formActions.validateField('cigarettesPerDay');

// Submit form
formActions.handleSubmit(async (values) => {
  await saveData(values);
});
```

## Error Components

### ErrorMessage Component

Display inline error messages:

```tsx
import {ErrorMessage} from './components/common/ErrorMessage';

<ErrorMessage
  message={formState.errors.email}
  visible={formState.touched.email}
/>
```

### ErrorBoundary Component

Catch React errors:

```tsx
import {ErrorBoundary} from './components/common/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Enhanced Storage Service

Use the enhanced storage service with automatic retry:

```tsx
import {enhancedStorage} from './services/storage.service.enhanced';

// Automatically retries on failure
const success = await enhancedStorage.saveUser(user);

// Shows user-friendly error message on failure
const entries = await enhancedStorage.getJournalEntries();
```

## Best Practices

### 1. Always Validate User Input
```tsx
// ❌ Bad
const saveData = async (data) => {
  await storage.save(data);
};

// ✅ Good
const saveData = async (data) => {
  const result = validateData(data);
  if (!result.isValid) {
    // Show errors
    return;
  }
  await storage.save(data);
};
```

### 2. Handle Errors Gracefully
```tsx
// ❌ Bad
const loadData = async () => {
  const data = await storage.load();
  setData(data);
};

// ✅ Good
const loadData = async () => {
  try {
    const data = await storage.load();
    setData(data);
  } catch (error) {
    errorHandler.handle(error, 'loadData');
    setData(null);
  }
};
```

### 3. Use Retry for Critical Operations
```tsx
// ✅ Good
const saveImportantData = async (data) => {
  await retryOperation(
    () => storage.save(data),
    3,
    1000,
    'saveImportantData'
  );
};
```

### 4. Sanitize User Input
```tsx
import {sanitizeInput} from './utils/validation';

const content = sanitizeInput(userInput);
```

### 5. Provide User-Friendly Messages
```tsx
// ❌ Bad
Alert.alert('Error', error.message);

// ✅ Good
errorHandler.handle(error, 'operation');
// Shows: "ডেটা সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
```

## Error Messages in Bangla

All error messages are in Bangla for better user experience:

- Storage errors: "ডেটা সংরক্ষণ করতে সমস্যা হয়েছে"
- Network errors: "ইন্টারনেট সংযোগ পরীক্ষা করুন"
- Validation errors: "প্রদত্ত তথ্য সঠিক নয়"
- Permission errors: "এই বৈশিষ্ট্য ব্যবহার করতে অনুমতি প্রয়োজন"

## Testing

Run validation tests:
```bash
npm test -- validation.test.ts
```

## Files

- `src/utils/errorHandler.ts` - Global error handler
- `src/utils/validation.ts` - Validation functions
- `src/hooks/useFormValidation.ts` - Form validation hook
- `src/components/common/ErrorMessage.tsx` - Error message component
- `src/components/common/ErrorBoundary.tsx` - Error boundary component
- `src/services/storage.service.enhanced.ts` - Enhanced storage with retry
- `src/utils/__tests__/validation.test.ts` - Validation tests

## Resources

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Form Validation Best Practices](https://www.smashingmagazine.com/2022/09/inline-validation-web-forms-ux/)
- [Error Handling in React Native](https://reactnative.dev/docs/error-handling)
