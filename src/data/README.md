# Data Directory

This directory contains static content data files for the 41-Day Quit Smoking App.

## Files

### dailyContent.ts

Contains the complete 41-day program content with day-specific information.

**Structure:**
- Day 1: Quit Day - Initial setup and commitment
- Days 2-4: Managing cravings, identifying triggers, stress management
- Days 5-7: Building new Islamic habits
- Days 8-14: Managing withdrawal symptoms
- Days 15-21: Maintaining motivation
- Days 22-28: Adopting new habits
- Days 29-35: Dealing with stress and triggers
- Days 36-41: Maintaining smoke-free life

**Each day includes:**
- `day`: Day number (1-41)
- `title`: Day title in Bangla
- `emoji`: Representative emoji
- `introduction`: Day introduction text
- `tasks`: Array of daily tasks with:
  - `id`: Unique task identifier
  - `title`: Task title
  - `description`: Task description
  - `completed`: Completion status (default: false)
- `affirmations`: Array of positive affirmations in Bangla
- `islamicReminder`: Islamic guidance with:
  - `title`: Reminder title
  - `content`: Reminder content
  - Optional: `verse`, `hadith`, `dua` objects
- `cravingTips`: Array of quick tips for managing cravings

**Usage:**

```typescript
import { dailyContent } from '../data/dailyContent';

// Get content for a specific day
const day1Content = dailyContent.find(content => content.day === 1);

// Get all tasks for a day
const day1Tasks = day1Content?.tasks || [];

// Get affirmations for a day
const day1Affirmations = day1Content?.affirmations || [];

// Get Islamic reminder
const day1Reminder = day1Content?.islamicReminder;

// Get craving tips
const day1Tips = day1Content?.cravingTips || [];
```

## Content Guidelines

### Language
- All content is in Bangla (Bengali)
- Uses respectful Islamic terminology
- Culturally appropriate for Bangladeshi Muslim audience

### Islamic Content
- References to Allah, prayers (namaz), Quran, and Islamic practices
- Emphasis on seeking Allah's help and guidance
- Islamic coping strategies (dua, dhikr, wudu, salah)
- Quotes from Quran and Hadith where appropriate

### Task Structure
- Each day has 3-4 actionable tasks
- Tasks are specific, measurable, and achievable
- Tasks build upon previous days' progress
- Tasks incorporate Islamic practices

### Affirmations
- Positive, present-tense statements
- Incorporate Islamic faith and trust in Allah
- Reinforce commitment and capability
- 3 affirmations per day

### Craving Tips
- Quick, actionable strategies
- Mix of Islamic practices and practical techniques
- 4-5 tips per day
- Easy to remember and implement

## Content Phases

### Phase 1: Days 1-7 (Initial Week)
- Focus: Immediate action, removing triggers, building support
- Key themes: Commitment, tawbah (repentance), seeking help
- Challenges: Initial cravings, habit breaking

### Phase 2: Days 8-14 (Withdrawal Week)
- Focus: Managing physical and psychological withdrawal
- Key themes: Patience (sabr), perseverance, Allah's support
- Challenges: Irritability, concentration issues, physical symptoms

### Phase 3: Days 15-21 (Motivation Week)
- Focus: Maintaining motivation, celebrating progress
- Key themes: Gratitude (shukr), reflection, future planning
- Challenges: Complacency, maintaining enthusiasm

### Phase 4: Days 22-28 (Habit Formation)
- Focus: Establishing new healthy habits
- Key themes: Routine building, Islamic practices, social connections
- Challenges: Replacing old habits, avoiding triggers

### Phase 5: Days 29-35 (Stress Management)
- Focus: Dealing with stress without smoking
- Key themes: Islamic coping strategies, support systems
- Challenges: High-stress situations, emotional triggers

### Phase 6: Days 36-41 (Long-term Maintenance)
- Focus: Preparing for lifelong smoke-free living
- Key themes: Reflection, planning, commitment renewal
- Challenges: Overconfidence, future trigger preparation

### healthTimeline.ts

Contains health benefits and improvements at different timeframes after quitting smoking.

**Structure:**
- Timeline spans from 20 minutes to 15 years after quitting
- Each milestone includes:
  - `timeframe`: Human-readable time (in Bangla)
  - `timeInMinutes`: Numeric value for calculations
  - `title`: Milestone title in Bangla
  - `description`: Detailed description in Bangla
  - `icon`: Representative emoji
  - `category`: 'immediate' | 'short-term' | 'medium-term' | 'long-term'

**Categories:**
- **Immediate** (0-24 hours): Heart rate, blood pressure, carbon monoxide levels
- **Short-term** (2 days - 3 months): Taste, smell, breathing, lung function
- **Medium-term** (6 months - 1 year): Respiratory infections, lung recovery, heart disease risk
- **Long-term** (5+ years): Stroke risk, cancer risk, complete recovery

**Helper Functions:**
- `getHealthMilestonesByCategory()`: Filter milestones by category
- `getNextHealthMilestone()`: Get the next upcoming milestone
- `getAchievedHealthMilestones()`: Get all completed milestones
- `getProgressToNextMilestone()`: Calculate progress percentage to next milestone

**Usage:**

```typescript
import { 
  healthTimeline, 
  getNextHealthMilestone,
  getProgressToNextMilestone 
} from '../data/healthTimeline';

// Get next milestone
const minutesSinceQuit = 1500; // 25 hours
const nextMilestone = getNextHealthMilestone(minutesSinceQuit);

// Get progress
const { progress, nextMilestone: next } = getProgressToNextMilestone(minutesSinceQuit);
```

## Future Enhancements

Potential additions to the data structure:
- Audio files for duas and dhikr
- Video content for breathing exercises
- Success stories from other users
- Personalized content based on user progress
- Additional Islamic content (Quran verses, Hadith)
- Financial savings calculator data
