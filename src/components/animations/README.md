# Animation Components

This directory contains reusable animation components and utilities for the 41-Day Quit Smoking App.

## Components

### MilestoneCelebrationAnimation
Full-screen celebration animation displayed when users achieve milestones.

**Features:**
- Confetti effect
- Icon animation with rotation and scale
- Smooth fade in/out
- Customizable title, description, and icon

**Usage:**
```tsx
<MilestoneCelebrationAnimation
  visible={showCelebration}
  title="১ সপ্তাহ সম্পূর্ণ!"
  description="অসাধারণ! আপনি ১ সপ্তাহ ধূমপান মুক্ত থাকতে পেরেছেন!"
  icon="trophy"
  onClose={() => setShowCelebration(false)}
/>
```

### TaskCompletionAnimation
Animated checkmark displayed when users complete tasks.

**Features:**
- Scale and bounce effect
- Rotation animation
- Auto-dismiss after animation
- Callback on completion

**Usage:**
```tsx
<TaskCompletionAnimation
  visible={taskCompleted}
  onAnimationComplete={() => setTaskCompleted(false)}
/>
```

### BreathingCircleAnimation
Animated breathing circle for breathing exercises.

**Features:**
- Smooth scale animation
- Phase-based animation (inhale, hold, exhale)
- Customizable duration
- Bangla phase text

**Usage:**
```tsx
<BreathingCircleAnimation
  isActive={isBreathing}
  phase={currentPhase}
  duration={4000}
/>
```

### SlideInView
Animated view that slides in from a specified direction.

**Props:**
- `direction`: 'left' | 'right' | 'top' | 'bottom'
- `duration`: Animation duration in ms
- `delay`: Delay before animation starts

**Usage:**
```tsx
<SlideInView direction="right" duration={300} delay={100}>
  <YourComponent />
</SlideInView>
```

### ScaleInView
Animated view that scales in when mounted.

**Props:**
- `delay`: Delay before animation starts
- `initialScale`: Starting scale value (default: 0)

**Usage:**
```tsx
<ScaleInView delay={200}>
  <YourComponent />
</ScaleInView>
```

### FadeInView
Animated view that fades in when mounted.

**Props:**
- `duration`: Animation duration in ms
- `delay`: Delay before animation starts

**Usage:**
```tsx
<FadeInView duration={500} delay={100}>
  <YourComponent />
</FadeInView>
```

## Animation Utilities

The `src/utils/animations.ts` file provides:

### Constants
- `ANIMATION_DURATION`: Predefined duration values
- `EASING`: Common easing functions

### Configs
- `timingConfig`: Timing animation configuration
- `springConfig`: Spring animation configuration
- `bouncySpringConfig`: Bouncy spring configuration
- `gentleSpringConfig`: Gentle spring configuration

### Helper Functions
- `fadeIn()`: Fade in animation
- `fadeOut()`: Fade out animation
- `scaleIn()`: Scale in animation
- `scaleOut()`: Scale out animation
- `pulse()`: Pulsing animation
- `shake()`: Shake animation
- `bounce()`: Bounce animation
- `celebrationScale()`: Celebration scale sequence
- `taskCompleteScale()`: Task completion scale sequence
- `breathingAnimation()`: Breathing exercise animation

## Screen Transitions

The `src/navigation/screenTransitions.ts` file provides navigation transition configurations:

- `slideFromRightTransition`: Default iOS-style slide
- `slideFromBottomTransition`: Modal-style slide from bottom
- `fadeTransition`: Fade transition
- `scaleFromCenterTransition`: Scale from center
- `modalTransition`: Modal with backdrop
- `celebrationTransition`: Special celebration screen transition
- `quickActionTransition`: Fast slide for quick actions

**Usage in Navigation:**
```tsx
<Stack.Screen
  name="ScreenName"
  component={ScreenComponent}
  options={slideFromRightTransition}
/>
```

## Best Practices

1. **Performance**: Use `useSharedValue` and `useAnimatedStyle` for optimal performance
2. **Cleanup**: Always cleanup animations in useEffect return functions
3. **Accessibility**: Respect user's reduced motion preferences when available
4. **Consistency**: Use predefined animation configs for consistent feel
5. **Duration**: Keep animations short (200-500ms) for better UX

## Dependencies

- `react-native-reanimated`: For performant animations
- `react-native-vector-icons`: For animated icons
