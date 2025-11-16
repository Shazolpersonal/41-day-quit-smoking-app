# Task 20.1 Quick Reference Guide

## Animation Components Cheat Sheet

### 🎉 MilestoneCelebrationAnimation
Full-screen celebration modal

```typescript
<MilestoneCelebrationAnimation
  visible={boolean}
  title="আলহামদুলিল্লাহ!"
  description="১ সপ্তাহ সম্পূর্ণ!"
  icon="trophy-award"  // MaterialCommunityIcons name
  onClose={() => {}}
/>
```

### ✅ TaskCompletionAnimation
Checkmark overlay for task completion

```typescript
<TaskCompletionAnimation
  visible={boolean}
  onAnimationComplete={() => {}}
/>
```

### 🫁 BreathingCircleAnimation
Animated breathing guide

```typescript
<BreathingCircleAnimation
  isActive={boolean}
  phase="inhale" | "hold" | "exhale"
  duration={4000}  // milliseconds
/>
```

### ➡️ SlideInView
Slide in from direction

```typescript
<SlideInView
  direction="left" | "right" | "top" | "bottom"
  duration={300}
  delay={0}
>
  {children}
</SlideInView>
```

### 📏 ScaleInView
Scale in animation

```typescript
<ScaleInView
  delay={0}
  initialScale={0}
>
  {children}
</ScaleInView>
```

### 🌫️ FadeInView
Fade in animation

```typescript
<FadeInView
  duration={300}
  delay={0}
>
  {children}
</FadeInView>
```

## Animation Utilities

### Duration Constants
```typescript
import { ANIMATION_DURATION } from './src/utils/animations';

ANIMATION_DURATION.FAST        // 200ms
ANIMATION_DURATION.NORMAL      // 300ms
ANIMATION_DURATION.SLOW        // 500ms
ANIMATION_DURATION.VERY_SLOW   // 800ms
```

### Easing Functions
```typescript
import { EASING } from './src/utils/animations';

EASING.EASE_IN_OUT  // Smooth start and end
EASING.EASE_OUT     // Fast start, slow end
EASING.EASE_IN      // Slow start, fast end
EASING.BOUNCE       // Bouncy effect
EASING.ELASTIC      // Elastic effect
```

### Animation Configs
```typescript
import {
  timingConfig,
  springConfig,
  bouncySpringConfig,
  gentleSpringConfig,
} from './src/utils/animations';

// Use in animations
scale.value = withSpring(1, springConfig);
opacity.value = withTiming(1, timingConfig(300));
```

### Helper Functions
```typescript
import {
  fadeIn,
  fadeOut,
  scaleIn,
  scaleOut,
  pulse,
  shake,
  bounce,
  celebrationScale,
  taskCompleteScale,
} from './src/utils/animations';

// Usage
opacity.value = fadeIn(300);
scale.value = celebrationScale();
```

## Screen Transitions

### Import
```typescript
import {
  slideFromRightTransition,
  slideFromBottomTransition,
  fadeTransition,
  modalTransition,
  celebrationTransition,
  quickActionTransition,
} from './src/navigation/screenTransitions';
```

### Usage in Navigation
```typescript
<Stack.Screen
  name="ScreenName"
  component={ScreenComponent}
  options={slideFromRightTransition}
/>
```

### Available Transitions
- `slideFromRightTransition` - Default horizontal slide
- `slideFromBottomTransition` - Modal vertical slide
- `fadeTransition` - Fade effect
- `modalTransition` - Modal with backdrop
- `celebrationTransition` - Scale + fade
- `quickActionTransition` - Fast 200ms slide

## Common Patterns

### Pattern 1: Staggered List Animation
```typescript
{items.map((item, index) => (
  <SlideInView key={item.id} delay={index * 100}>
    <ListItem item={item} />
  </SlideInView>
))}
```

### Pattern 2: Sequential Animations
```typescript
useEffect(() => {
  scale.value = withSequence(
    withSpring(1.2, bouncySpringConfig),
    withSpring(1, gentleSpringConfig)
  );
}, []);
```

### Pattern 3: Conditional Animation
```typescript
useEffect(() => {
  if (isVisible) {
    opacity.value = fadeIn(300);
  } else {
    opacity.value = fadeOut(300);
  }
}, [isVisible]);
```

### Pattern 4: Repeating Animation
```typescript
useEffect(() => {
  scale.value = pulse(1.1); // Repeats infinitely
}, []);
```

## Performance Tips

✅ **DO:**
- Use `useSharedValue` for animated values
- Use `useAnimatedStyle` for styles
- Set `useNativeDriver: true` (already done)
- Cleanup animations in useEffect return

❌ **DON'T:**
- Animate layout properties without Reanimated
- Create new animation configs on every render
- Forget to cancel animations on unmount
- Use too many simultaneous animations

## Timing Guide

| Use Case | Duration | Config |
|----------|----------|--------|
| Button press | 200ms | FAST |
| Screen transition | 300ms | NORMAL |
| Modal appearance | 500ms | SLOW |
| Celebration | 800ms | VERY_SLOW |
| Micro-interaction | 150ms | Custom |

## Easing Guide

| Effect | Easing |
|--------|--------|
| Natural movement | EASE_IN_OUT |
| Appearing element | EASE_OUT |
| Disappearing element | EASE_IN |
| Playful effect | BOUNCE |
| Attention grabber | ELASTIC |

## Testing Animations

```typescript
// Mock timers in tests
jest.useFakeTimers();

// Advance time
jest.advanceTimersByTime(1000);

// Verify callback
expect(mockCallback).toHaveBeenCalled();
```

## Debugging

```typescript
// Log animation values
useAnimatedReaction(
  () => animatedValue.value,
  (value) => console.log('Value:', value)
);

// Check if animation is running
console.log('Is animating:', animatedValue.value !== targetValue);
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Animation not starting | Check if value is already at target |
| Laggy animation | Ensure useNativeDriver is true |
| Animation not stopping | Add cleanup in useEffect return |
| Jerky animation | Use spring instead of timing |
| Too fast/slow | Adjust duration or spring config |

## Import Shortcuts

```typescript
// All animation components
import * as Animations from './src/components/animations';

// All animation utilities
import * as AnimUtils from './src/utils/animations';

// All screen transitions
import * as Transitions from './src/navigation/screenTransitions';
```

## Quick Copy-Paste Examples

### Fade In Screen
```typescript
<FadeInView duration={300}>
  <View>{/* Your content */}</View>
</FadeInView>
```

### Slide In Card
```typescript
<SlideInView direction="right" delay={100}>
  <Card>{/* Card content */}</Card>
</SlideInView>
```

### Scale In Button
```typescript
<ScaleInView delay={200}>
  <Button title="Click me" />
</ScaleInView>
```

### Show Celebration
```typescript
const [show, setShow] = useState(false);

<MilestoneCelebrationAnimation
  visible={show}
  title="সফল!"
  description="আপনি এটি করেছেন!"
  onClose={() => setShow(false)}
/>
```
