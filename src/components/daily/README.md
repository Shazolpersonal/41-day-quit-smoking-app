# Daily Content Components

Components for displaying daily content including tasks, affirmations, and Islamic reminders.

## Components

### TaskList
Main component for displaying a list of daily tasks with progress tracking.

**Props:**
- `tasks: DailyTask[]` - Array of tasks to display
- `onToggleTask: (taskId: string) => void` - Callback when task is toggled
- `title?: string` - Optional title (default: 'আজকের কাজ')
- `showProgress?: boolean` - Show progress bar (default: true)

**Features:**
- Progress bar showing completion percentage
- Task counter (completed/total)
- Completion celebration message
- Smooth animations

**Example:**
```tsx
<TaskList
  tasks={dailyContent.tasks}
  onToggleTask={handleToggleTask}
  title="আজকের কাজ"
  showProgress={true}
/>
```

### TaskItem
Individual task item with checkbox and completion animation.

**Props:**
- `task: DailyTask` - Task object to display
- `onToggle: (taskId: string) => void` - Callback when task is toggled

**Features:**
- Checkbox with checkmark animation
- Strike-through text when completed
- Scale and opacity animation on completion
- Touch feedback

**Example:**
```tsx
<TaskItem
  task={task}
  onToggle={handleToggle}
/>
```

### Affirmation
Component for displaying daily affirmations with Islamic styling.

**Props:**
- `affirmations: string[]` - Array of affirmation texts
- `title?: string` - Optional title (default: 'আজকের ইতিবাচক বাণী')

**Features:**
- Islamic green background with gold accents
- Decorative top and bottom borders
- Star bullet points
- Fade-in animation
- Responsive text layout

**Example:**
```tsx
<Affirmation
  affirmations={dailyContent.affirmations}
  title="আজকের ইতিবাচক বাণী"
/>
```

## Design Principles

### Islamic Styling
- Primary color: Islamic green (#2E7D32)
- Accent color: Gold (#D4AF37)
- Decorative elements inspired by Islamic art
- Bangla typography support

### Animations
- Smooth transitions for better UX
- Celebration animations on task completion
- Fade-in effects for content reveal
- Scale animations for interactive feedback

### Accessibility
- High contrast text
- Touch-friendly tap targets (minimum 44x44)
- Clear visual feedback
- Readable font sizes

## Requirements Fulfilled

✅ **Requirement 3.2**: Daily content display with tasks and affirmations
✅ **Requirement 3.3**: Islamic-themed UI with appropriate colors and styling
