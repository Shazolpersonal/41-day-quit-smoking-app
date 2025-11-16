# Journal Components

This directory contains all components related to the journal functionality of the 41-Day Quit Smoking App.

## Components

### JournalEntryForm
A comprehensive form component for creating and editing journal entries.

**Features:**
- Mood selector with emoji options (8 mood types)
- Trigger category selection (9 trigger types)
- Craving intensity slider (1-10 scale)
- Text input for daily notes
- Date picker for entry date

**Props:**
- `initialData`: Optional initial data for editing
- `onSubmit`: Callback when form is submitted
- `onCancel`: Optional callback for cancel action
- `submitLabel`: Custom label for submit button

**Usage:**
```tsx
<JournalEntryForm
  initialData={existingEntry}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  submitLabel="সংরক্ষণ করুন"
/>
```

### JournalCalendar
A calendar view component that displays journal entries with mood indicators.

**Features:**
- Monthly calendar view
- Navigation between months
- Mood emoji indicators on dates with entries
- Date selection to view entries
- Highlights today and selected date

**Props:**
- `entries`: Array of journal entries
- `selectedDate`: Currently selected date
- `onDateSelect`: Callback when a date is selected

**Usage:**
```tsx
<JournalCalendar
  entries={journalEntries}
  selectedDate={selectedDate}
  onDateSelect={handleDateSelect}
/>
```

### JournalEntryList
A list component that displays journal entries in a card format.

**Features:**
- Displays entries with mood emoji, date, and time
- Shows craving intensity badge if available
- Displays up to 3 triggers per entry
- Truncates long content with "..." 
- Empty state message

**Props:**
- `entries`: Array of journal entries to display
- `onEntryPress`: Callback when an entry is pressed
- `emptyMessage`: Optional custom empty state message

**Usage:**
```tsx
<JournalEntryList
  entries={entries}
  onEntryPress={handleEntryPress}
  emptyMessage="কোন এন্ট্রি নেই"
/>
```

### TriggerAnalysis
An analytics component that shows trigger statistics and insights.

**Features:**
- Displays most common triggers
- Shows percentage and count for each trigger
- Visual progress bars
- Provides insights based on top trigger
- Empty state for no data

**Props:**
- `entries`: Array of journal entries to analyze

**Usage:**
```tsx
<TriggerAnalysis entries={journalEntries} />
```

## Data Types

### MoodType
```typescript
type MoodType = 
  | 'very_happy'    // 😄 খুব খুশি
  | 'happy'         // 😊 খুশি
  | 'neutral'       // 😐 স্বাভাবিক
  | 'sad'           // 😔 দুঃখিত
  | 'very_sad'      // 😢 খুব দুঃখিত
  | 'anxious'       // 😰 উদ্বিগ্ন
  | 'stressed'      // 😫 চাপে
  | 'confident';    // 😎 আত্মবিশ্বাসী
```

### TriggerType
```typescript
type TriggerType = 
  | 'stress'        // মানসিক চাপ
  | 'social'        // সামাজিক
  | 'boredom'       // একঘেয়েমি
  | 'after_meal'    // খাবারের পরে
  | 'coffee'        // কফি
  | 'alcohol'       // অ্যালকোহল
  | 'work'          // কাজ
  | 'home'          // বাড়ি
  | 'other';        // অন্যান্য
```

## Styling

All components use the centralized theme from `src/constants/theme.ts`:
- Colors: Islamic-themed color palette
- Spacing: Consistent spacing scale
- Typography: Bengali-friendly font sizes
- Border Radius: Rounded corners for modern look

## Accessibility

- All interactive elements have appropriate touch targets
- Text inputs support multiline and proper keyboard types
- Color contrast meets accessibility standards
- Components support screen readers

## Testing

Each component should be tested for:
- Rendering with different data states
- User interactions (taps, selections)
- Form validation
- Empty states
- Error handling
