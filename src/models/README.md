# Data Models

This directory contains model classes with business logic and validation.

## Files

### User.ts
User model with methods for:
- Creating and updating user profiles
- Validating user data
- Calculating daily cigarette costs

### JournalEntry.ts
Journal entry model with:
- CRUD operations
- Data validation
- Date-based filtering and sorting

### Progress.ts
Progress tracking model with:
- Smoke-free time calculations
- Current day calculation
- Milestone and health benefit updates

### Settings.ts
Settings model with:
- Default settings creation
- Emergency contact management
- Settings updates

### CravingLog.ts
Craving tracking model with:
- Craving incident logging
- Statistical analysis (average intensity, common triggers)
- Date-based filtering

### DailyContent.ts
Daily content model with:
- Task management
- Completion tracking
- Progress percentage calculation

## Usage

```typescript
import {UserModel, ProgressModel} from '../models';

const user = UserModel.create({...});
const validation = UserModel.validate(userData);
```
