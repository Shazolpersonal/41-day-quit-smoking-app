# Task 22: Error Handling and Validation - Quick Reference

## Quick Start

### 1. Handle Errors
```tsx
import {errorHandler} from './utils/errorHandler';

try {
  await operation();
} catch (error) {
  errorHandler.handle(error, 'context');
}
```

### 2. Retry Failed Operations
```tsx
import {retryOperation} from './utils/errorHandler';

await retryOperation(
  () => storage.save(data),
  3, // retries
  1000 // delay
);
```

### 3. Validate Forms
```tsx
import {validateOnboardingData} from './utils/validation';

const result = validateOnboardingData(data);
if (!result.isValid) {
  console.log(result.errors);
}
```

### 4. Use Form Hook
```tsx
import {useFormValidation} from './hooks/useFormValidation';

const [state, actions] = useFormValidation(
  initialValues,
  validateFunction
);
```

### 5. Show Error Messages
```tsx
import {ErrorMessage} from './components/common/ErrorMessage';

<ErrorMessage
  message={errors.field}
  visible={touched.field}
/>
```

## Validation Functions

### Onboarding
```tsx
validateOnboardingData({
  quitDate: string,
  cigarettesPerDay: number,
  pricePerPack: number,
  cigarettesPerPack: number,
})
```

### Journal Entry
```tsx
validateJournalEntry({
  content: string,
  mood?: string,
  triggers?: string[],
  cravingIntensity?: number,
})
```

### Emergency Contact
```tsx
validateEmergencyContact({
  name: string,
  phone: string,
  relationship: string,
})
```

### PIN Code
```tsx
validatePIN(pin: string)
```

### Phone Number
```tsx
isValidPhoneNumber(phone: string)
```

### Number
```tsx
validateNumber(value, min, max, fieldName)
```

### Date
```tsx
validateDate(dateString, allowFuture, fieldName)
```

## Error Handler Methods

### Handle Error (Show Alert)
```tsx
errorHandler.handle(error, 'context');
```

### Handle Silently (Log Only)
```tsx
errorHandler.handleSilent(error, 'context');
```

### Create Specific Errors
```tsx
errorHandler.createStorageError(message, context);
errorHandler.createValidationError(message, context);
errorHandler.createNetworkError(message, context);
```

### Get Error History
```tsx
const errors = errorHandler.getErrors();
```

### Clear Errors
```tsx
errorHandler.clearErrors();
```

## Form Validation Hook

### Initialize
```tsx
const [formState, formActions] = useFormValidation(
  {field1: '', field2: 0},
  validateFunction
);
```

### State Properties
```tsx
formState.values      // Current values
formState.errors      // Validation errors
formState.touched     // Touched fields
formState.isSubmitting // Submitting state
formState.isValid     // Form validity
```

### Actions
```tsx
formActions.setFieldValue(field, value)
formActions.setFieldError(field, error)
formActions.setFieldTouched(field, touched)
formActions.setErrors(errors)
formActions.resetForm()
formActions.handleSubmit(onSubmit)
formActions.validateField(field)
formActions.validateForm()
```

## Enhanced Storage

### Import
```tsx
import {enhancedStorage} from './services/storage.service.enhanced';
```

### Methods (All with Retry)
```tsx
await enhancedStorage.saveUser(user)
await enhancedStorage.getUser()
await enhancedStorage.updateUser(updates)
await enhancedStorage.saveProgress(progress)
await enhancedStorage.getProgress()
await enhancedStorage.saveJournalEntry(entry)
await enhancedStorage.getJournalEntries()
await enhancedStorage.updateJournalEntry(id, updates)
await enhancedStorage.deleteJournalEntry(id)
await enhancedStorage.saveSettings(settings)
await enhancedStorage.getSettings()
await enhancedStorage.saveCravingLog(log)
await enhancedStorage.getCravingLogs()
await enhancedStorage.exportAllData()
await enhancedStorage.clearAllData()
```

## Components

### ErrorMessage
```tsx
<ErrorMessage
  message="ত্রুটি বার্তা"
  visible={true}
  style={customStyle}
/>
```

### ErrorBoundary
```tsx
<ErrorBoundary fallback={<CustomFallback />}>
  <YourComponent />
</ErrorBoundary>
```

## Utility Functions

### Sanitize Input
```tsx
import {sanitizeInput} from './utils/validation';

const clean = sanitizeInput(userInput);
```

### Safe Async
```tsx
import {safeAsync} from './utils/errorHandler';

const data = await safeAsync(
  () => fetchData(),
  fallbackValue,
  'context'
);
```

## Error Messages (Bangla)

### Storage
```
Title: সংরক্ষণ ত্রুটি
Message: ডেটা সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
```

### Network
```
Title: নেটওয়ার্ক ত্রুটি
Message: ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।
```

### Validation
```
Title: যাচাইকরণ ত্রুটি
Message: প্রদত্ত তথ্য সঠিক নয়। অনুগ্রহ করে পরীক্ষা করুন।
```

### Permission
```
Title: অনুমতি প্রয়োজন
Message: এই বৈশিষ্ট্য ব্যবহার করতে অনুমতি প্রয়োজন।
```

## Common Patterns

### Form with Validation
```tsx
const [formState, formActions] = useFormValidation(
  initialValues,
  validateOnboardingData
);

<TextInput
  value={formState.values.cigarettesPerDay}
  onChangeText={(text) => 
    formActions.setFieldValue('cigarettesPerDay', text)
  }
  onBlur={() => 
    formActions.setFieldTouched('cigarettesPerDay')
  }
/>

<ErrorMessage
  message={formState.errors.cigarettesPerDay}
  visible={formState.touched.cigarettesPerDay}
/>

<Button
  title="সংরক্ষণ করুন"
  onPress={() => formActions.handleSubmit(handleSave)}
  disabled={!formState.isValid || formState.isSubmitting}
/>
```

### Storage with Retry
```tsx
const saveData = async () => {
  const success = await enhancedStorage.saveUser(user);
  if (success) {
    // Success
  } else {
    // Error already shown to user
  }
};
```

### Custom Validation
```tsx
const validateCustom = (values) => {
  const errors = {};
  
  if (!values.field) {
    errors.field = 'ফিল্ড প্রয়োজন';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

## Testing

### Run Tests
```bash
npm test -- validation.test.ts
```

### Test Validation
```tsx
import {validateOnboardingData} from './utils/validation';

const result = validateOnboardingData(testData);
expect(result.isValid).toBe(true);
```

## File Locations

- Error Handler: `src/utils/errorHandler.ts`
- Validation: `src/utils/validation.ts`
- Form Hook: `src/hooks/useFormValidation.ts`
- Error Message: `src/components/common/ErrorMessage.tsx`
- Error Boundary: `src/components/common/ErrorBoundary.tsx`
- Enhanced Storage: `src/services/storage.service.enhanced.ts`
- Tests: `src/utils/__tests__/validation.test.ts`
- Documentation: `src/utils/README_ERROR_HANDLING.md`

## Troubleshooting

### Error Not Showing
**Problem:** Error not displayed to user

**Solution:** Use `errorHandler.handle()` instead of `handleSilent()`

### Validation Not Working
**Problem:** Form submits with invalid data

**Solution:** Check validation function returns correct format:
```tsx
{
  isValid: boolean,
  errors: Record<string, string>
}
```

### Retry Not Working
**Problem:** Operation doesn't retry

**Solution:** Ensure operation is wrapped in `retryOperation()`:
```tsx
await retryOperation(() => operation(), 3, 1000);
```

### Form State Not Updating
**Problem:** Form values don't update

**Solution:** Use `formActions.setFieldValue()`:
```tsx
formActions.setFieldValue('field', newValue);
```

## Best Practices

1. ✅ Always validate before saving
2. ✅ Use enhanced storage for retry
3. ✅ Show user-friendly errors
4. ✅ Sanitize user input
5. ✅ Log errors for debugging
6. ✅ Use error boundaries
7. ✅ Test validation functions
8. ✅ Handle all error cases

## Resources

- Full Documentation: `src/utils/README_ERROR_HANDLING.md`
- Complete Report: `TASK_22_COMPLETE.md`
- Test File: `src/utils/__tests__/validation.test.ts`
