# Type Definitions

This directory contains all TypeScript type definitions for the app.

## Files

### index.ts
Core type definitions including:
- **User**: User profile with quit date, cigarette consumption, and pricing
- **Progress**: Tracking smoke-free time, money saved, milestones, and health benefits
- **JournalEntry**: Daily journal entries with mood and trigger tracking
- **DailyContent**: 41-day program content structure
- **Islamic Content**: Quran verses, hadith, duas, dhikr, and quotes
- **Settings**: App configuration including notifications, appearance, and privacy
- **CravingLog**: Craving incident tracking with intensity and coping strategies
- **Statistics**: Analytics and insights data structures

### navigation.ts
React Navigation type definitions:
- Root stack navigator types
- Main tab navigator types
- Screen props for all screens
- Type-safe navigation parameters

## Usage

```typescript
import {User, Progress, JournalEntry} from '../types';
import type {HomeScreenProps} from '../types/navigation';
```
