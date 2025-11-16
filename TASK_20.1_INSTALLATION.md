# Task 20.1 Installation Guide

## Animation System Setup

### Prerequisites
The animation system uses `react-native-reanimated` which is already installed in the project.

### Verify Installation

Check that react-native-reanimated is properly configured:

```bash
# Check package.json
npm list react-native-reanimated
```

Should show: `react-native-reanimated@3.5.4`

### Babel Configuration

Ensure `babel.config.js` includes the reanimated plugin:

```javascript
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin', // Must be last
  ],
};
```

### Android Configuration

No additional Android configuration needed - already set up.

### iOS Configuration (if applicable)

If building for iOS, run:

```bash
cd ios && pod install && cd ..
```

### Usage in Your Code

Import animation components:

```typescript
// Import individual components
import {
  MilestoneCelebrationAnimation,
  TaskCompletionAnimation,
  BreathingCircleAnimation,
  SlideInView,
  ScaleInView,
  FadeInView,
} from './src/components/animations';

// Import animation utilities
import {
  fadeIn,
  scaleIn,
  celebrationScale,
  ANIMATION_DURATION,
  springConfig,
} from './src/utils/animations';

// Import screen transitions
import {
  slideFromRightTransition,
  modalTransition,
  celebrationTransition,
} from './src/navigation/screenTransitions';
```

### Testing

Run tests to verify everything works:

```bash
npm test -- src/components/animations/__tests__
```

### Troubleshooting

#### Issue: Animations not working
**Solution**: Make sure you've restarted the Metro bundler after installing dependencies:
```bash
npm start -- --reset-cache
```

#### Issue: "Reanimated 2 failed to create a worklet" error
**Solution**: Ensure the reanimated plugin is the LAST plugin in babel.config.js

#### Issue: Animations are laggy
**Solution**: Make sure `useNativeDriver: true` is set (already configured in all components)

### Performance Tips

1. **Use Shared Values**: All animations use `useSharedValue` for optimal performance
2. **Native Driver**: All animations run on the UI thread
3. **Cleanup**: All components properly cleanup animations in useEffect
4. **Memoization**: Animation configs are memoized to prevent recreations

### Development Mode

To see animation performance metrics:

```typescript
// Add to your component
import { useAnimatedReaction } from 'react-native-reanimated';

useAnimatedReaction(
  () => animatedValue.value,
  (value) => {
    console.log('Animation value:', value);
  }
);
```

### Production Build

Animations are optimized for production automatically. No additional configuration needed.

## Quick Start Examples

### Example 1: Add Fade In to a Screen

```typescript
import { FadeInView } from './src/components/animations';

function MyScreen() {
  return (
    <FadeInView duration={500}>
      <Text>This content fades in!</Text>
    </FadeInView>
  );
}
```

### Example 2: Add Slide In to a List Item

```typescript
import { SlideInView } from './src/components/animations';

function ListItem({ index }) {
  return (
    <SlideInView direction="right" delay={index * 100}>
      <Text>Item {index}</Text>
    </SlideInView>
  );
}
```

### Example 3: Show Celebration

```typescript
import { MilestoneCelebrationAnimation } from './src/components/animations';

function MyComponent() {
  const [showCelebration, setShowCelebration] = useState(false);

  return (
    <MilestoneCelebrationAnimation
      visible={showCelebration}
      title="Success!"
      description="You did it!"
      onClose={() => setShowCelebration(false)}
    />
  );
}
```

## Documentation

Full documentation available in:
- `src/components/animations/README.md` - Component documentation
- `src/utils/animations.ts` - Utility function documentation
- `src/navigation/screenTransitions.ts` - Transition configurations

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the test files for usage examples
3. Consult the react-native-reanimated documentation: https://docs.swmansion.com/react-native-reanimated/
