# Progress Components

Progress tracking components for displaying user's quit smoking journey.

## Components

### ProgressOverview
Displays detailed smoke-free time breakdown, money saved, and cigarettes not smoked.

**Props:**
- `smokeFreeTime: SmokeFreeTime` - Breakdown of time (days, hours, minutes, seconds)
- `moneySaved: number` - Total money saved
- `cigarettesNotSmoked: number` - Total cigarettes not smoked

**Features:**
- Real-time countdown display
- Visual time breakdown grid
- Money saved highlight
- Cigarettes avoided counter

### MoneySavedBreakdown
Shows detailed breakdown of money saved across different time periods.

**Props:**
- `total: number` - Total money saved
- `daily: number` - Daily savings rate
- `weekly: number` - Weekly savings projection
- `monthly: number` - Monthly savings projection
- `yearly: number` - Yearly savings projection

**Features:**
- Prominent total display
- Breakdown by time period
- Motivational messaging
- Bengali number formatting

### ProgressChart
Visual representation of progress with charts and statistics.

**Props:**
- `currentDay: number` - Current day in the program
- `totalDays?: number` - Total days in program (default: 41)
- `moneySaved: number` - Total money saved
- `cigarettesNotSmoked: number` - Total cigarettes not smoked

**Features:**
- Progress bar with percentage
- Weekly bar chart
- Statistics grid
- Visual progress indicators

### HealthTimeline
Displays health improvements timeline with achieved and upcoming benefits.

**Props:**
- `achievedMilestones: HealthMilestone[]` - Achieved health benefits
- `upcomingMilestones: HealthMilestone[]` - Upcoming health benefits
- `minutesSinceQuit: number` - Minutes since quit date

**Features:**
- Timeline visualization
- Achieved vs upcoming sections
- Detailed benefit descriptions in Bangla
- Category badges
- Encouragement messages

### MilestoneBadges
Displays all milestone badges with achievement status and unlock animations.

**Props:**
- `milestones: Milestone[]` - All milestones (achieved and upcoming)
- `currentDay: number` - Current day in the program

**Features:**
- Badge grid with visual indicators
- Achieved vs upcoming sections
- Badge unlock animations
- Achievement dates display
- Expandable details
- Color-coded badges (bronze, silver, gold, diamond)
- Tap to expand for more details

### CravingAnalysis
Displays craving frequency, common triggers, and insights based on journal entries.

**Props:**
- `journalEntries: JournalEntry[]` - All journal entries with craving data

**Features:**
- Craving frequency chart (last 7 days)
- Most common triggers ranking
- Statistics (total, average intensity, high intensity count)
- Insights and recommendations in Bangla
- Empty state for no data
- Visual charts and graphs
- Trigger icons and labels

## Usage Example

```tsx
import {ProgressOverview} from '../components/progress/ProgressOverview';
import {MoneySavedBreakdown} from '../components/progress/MoneySavedBreakdown';
import {ProgressChart} from '../components/progress/ProgressChart';
import {HealthTimeline} from '../components/progress/HealthTimeline';
import {MilestoneBadges} from '../components/progress/MilestoneBadges';
import {CravingAnalysis} from '../components/progress/CravingAnalysis';

function ProgressScreen() {
  const {progress} = useProgress();
  const {user} = useUser();
  const {entries: journalEntries} = useJournal();
  
  const moneySavedBreakdown = progressCalculatorService.calculateMoneySaved(user);
  const minutesSinceQuit = Math.floor(progress.smokeFreeTime.totalSeconds / 60);
  const achievedMilestones = getAchievedHealthMilestones(minutesSinceQuit);
  const upcomingMilestones = getUpcomingHealthMilestones(minutesSinceQuit);

  return (
    <ScrollView>
      <ProgressOverview
        smokeFreeTime={progress.smokeFreeTime}
        moneySaved={progress.moneySaved}
        cigarettesNotSmoked={progress.cigarettesNotSmoked}
      />
      
      <MoneySavedBreakdown {...moneySavedBreakdown} />
      
      <ProgressChart
        currentDay={progress.currentDay}
        moneySaved={progress.moneySaved}
        cigarettesNotSmoked={progress.cigarettesNotSmoked}
      />
      
      <HealthTimeline
        achievedMilestones={achievedMilestones}
        upcomingMilestones={upcomingMilestones}
        minutesSinceQuit={minutesSinceQuit}
      />
      
      <MilestoneBadges
        milestones={progress.milestones}
        currentDay={progress.currentDay}
      />
      
      <CravingAnalysis journalEntries={journalEntries} />
    </ScrollView>
  );
}
```

## Design Principles

1. **Visual Clarity**: Use clear visual indicators for progress
2. **Motivation**: Highlight achievements and savings
3. **Bengali Language**: All text in Bangla for target audience
4. **Islamic Context**: Include appropriate Islamic phrases
5. **Real-time Updates**: Show live progress updates
6. **Detailed Information**: Provide comprehensive breakdowns

## Styling

All components use the centralized theme system from `constants/theme.ts`:
- Colors: Primary, success, error, text colors
- Spacing: Consistent padding and margins
- Typography: Font sizes and weights
- Border Radius: Consistent rounded corners

## Testing

Test files are located in `__tests__` directories. Run tests with:
```bash
npm test
```

## Related Files

- `src/screens/ProgressScreen.tsx` - Main progress screen
- `src/context/ProgressContext.tsx` - Progress state management
- `src/services/progressCalculator.service.ts` - Progress calculations
- `src/data/healthTimeline.ts` - Health milestone data
