# Performance Optimization Guide

## Overview

This guide covers all performance optimizations implemented in the app to ensure smooth scrolling, fast loading, and efficient resource usage.

## Components

### 1. LazyImage

Optimized image component with lazy loading and placeholder support.

```typescript
import { LazyImage } from '../components/common/LazyImage';

<LazyImage
  source={{ uri: 'https://example.com/image.jpg' }}
  placeholder={require('../assets/placeholder.png')}
  showLoader={true}
  style={{ width: 200, height: 200 }}
/>
```

**Features:**
- Lazy loading with placeholder
- Loading indicator
- Error handling
- Smooth fade-in animation

### 2. LoadingState

Reusable loading state component with multiple variants.

```typescript
import { LoadingState } from '../components/common/LoadingState';

// Spinner variant
<LoadingState variant="spinner" message="Loading..." />

// Skeleton variant
<LoadingState variant="skeleton" />

// Overlay variant
<LoadingState variant="overlay" message="Please wait..." />

// Inline variant
<LoadingState variant="inline" size="small" />
```

**Variants:**
- `spinner` - Centered spinner with optional message
- `skeleton` - Skeleton loader for content placeholders
- `overlay` - Full-screen overlay with spinner
- `inline` - Inline spinner for small areas

### 3. OptimizedList

Optimized FlatList wrapper with performance enhancements.

```typescript
import { OptimizedList } from '../components/common/OptimizedList';

<OptimizedList
  data={items}
  renderItem={(item, index) => <ItemComponent item={item} />}
  keyExtractor={(item, index) => item.id}
  loading={loading}
  estimatedItemSize={100}
/>
```

**Optimizations:**
- `removeClippedSubviews` - Remove off-screen views
- `maxToRenderPerBatch` - Limit batch rendering
- `windowSize` - Optimize render window
- `getItemLayout` - Skip layout calculations
- Memoized render functions

### 4. OptimizedScrollView

Optimized ScrollView with smooth scrolling.

```typescript
import { OptimizedScrollView } from '../components/common/OptimizedScrollView';

<OptimizedScrollView
  onScrollThrottled={(event) => handleScroll(event)}
  throttleDelay={100}
>
  {children}
</OptimizedScrollView>
```

**Features:**
- Throttled scroll events
- Smooth deceleration
- Clipped subviews removal

## Hooks

### 1. useLazyContent

Hook for lazy loading content with caching.

```typescript
import { useLazyContent } from '../hooks/useLazyContent';

const {
  currentContent,
  loading,
  goToNext,
  goToPrevious,
  goToIndex,
} = useLazyContent(allContent, {
  preloadCount: 3,
  cacheSize: 10,
});
```

**Features:**
- Lazy loading with preloading
- LRU cache management
- Navigation helpers

### 2. useDebounce

Hook for debouncing values.

```typescript
import { useDebounce } from '../utils/performance';

const debouncedValue = useDebounce(searchTerm, 300);
```

### 3. useThrottle

Hook for throttling callbacks.

```typescript
import { useThrottle } from '../utils/performance';

const throttledCallback = useThrottle(handleScroll, 100);
```

## Utilities

### 1. Performance Utilities

```typescript
import {
  debounce,
  throttle,
  memoize,
  getVisibleRange,
} from '../utils/performance';

// Debounce function
const debouncedFn = debounce(fn, 300);

// Throttle function
const throttledFn = throttle(fn, 100);

// Memoize expensive calculations
const memoizedFn = memoize(expensiveFn);

// Calculate visible range for virtualization
const { start, end } = getVisibleRange(
  scrollOffset,
  itemHeight,
  containerHeight,
  totalItems,
  overscan
);
```

### 2. Image Optimization

```typescript
import {
  preloadImages,
  getOptimizedImageSize,
  optimizeImageUri,
  ImageQuality,
  ImageSizes,
} from '../utils/imageOptimization';

// Preload images
await preloadImages([
  'https://example.com/image1.jpg',
  'https://example.com/image2.jpg',
]);

// Get optimized size
const size = getOptimizedImageSize(1920, 1080, 400, 400);

// Optimize URI
const uri = optimizeImageUri(
  'https://example.com/image.jpg',
  400,
  400,
  ImageQuality.MEDIUM
);
```

## Best Practices

### 1. List Rendering

**DO:**
- Use `OptimizedList` for long lists
- Provide `keyExtractor` for stable keys
- Use `getItemLayout` when item sizes are known
- Implement `onEndReached` for pagination

**DON'T:**
- Render all items at once
- Use index as key
- Perform heavy calculations in render
- Nest FlatLists

### 2. Image Loading

**DO:**
- Use `LazyImage` for remote images
- Provide placeholders
- Preload critical images
- Optimize image sizes

**DON'T:**
- Load full-resolution images
- Skip error handling
- Load all images at once
- Use unoptimized formats

### 3. State Updates

**DO:**
- Debounce search inputs
- Throttle scroll handlers
- Memoize expensive calculations
- Use React.memo for components

**DON'T:**
- Update state on every keystroke
- Perform heavy operations in render
- Create new objects/arrays in render
- Skip memoization for expensive operations

### 4. Animations

**DO:**
- Use native driver when possible
- Keep animations simple
- Use `useNativeDriver: true`
- Optimize animation timing

**DON'T:**
- Animate layout properties with native driver
- Run multiple heavy animations simultaneously
- Block the main thread
- Use complex transforms

## Performance Metrics

### Target Metrics

- **Initial Load**: < 2 seconds
- **Screen Transition**: < 300ms
- **List Scroll**: 60 FPS
- **Image Load**: < 1 second
- **Search Response**: < 300ms

### Monitoring

Use React Native Performance Monitor:
```bash
# Android
adb shell input keyevent 82
# Select "Show Perf Monitor"

# iOS
Cmd + D in simulator
# Select "Show Perf Monitor"
```

## Optimization Checklist

### Images
- [ ] Use LazyImage for remote images
- [ ] Provide placeholders
- [ ] Optimize image sizes
- [ ] Preload critical images
- [ ] Use appropriate formats (WebP, JPEG)

### Lists
- [ ] Use OptimizedList for long lists
- [ ] Implement pagination
- [ ] Use stable keys
- [ ] Provide item layout
- [ ] Remove clipped subviews

### State
- [ ] Debounce search inputs
- [ ] Throttle scroll handlers
- [ ] Memoize expensive calculations
- [ ] Use React.memo for components
- [ ] Avoid unnecessary re-renders

### Navigation
- [ ] Lazy load screens
- [ ] Optimize transitions
- [ ] Preload next screen
- [ ] Clear unused screens

### Storage
- [ ] Batch storage operations
- [ ] Use async operations
- [ ] Implement caching
- [ ] Clear old data

## Troubleshooting

### Slow List Scrolling

1. Check if using OptimizedList
2. Verify removeClippedSubviews is enabled
3. Reduce windowSize
4. Implement getItemLayout
5. Memoize render functions

### Slow Image Loading

1. Check image sizes
2. Verify lazy loading is enabled
3. Implement preloading
4. Use placeholders
5. Optimize image format

### Laggy Animations

1. Use native driver
2. Simplify animations
3. Reduce simultaneous animations
4. Check for heavy operations
5. Profile with Performance Monitor

### High Memory Usage

1. Clear image cache
2. Implement pagination
3. Reduce cache size
4. Remove unused data
5. Profile with memory profiler

## Testing Performance

### Manual Testing

1. **Scroll Performance**
   - Scroll through long lists
   - Check for dropped frames
   - Verify smooth scrolling

2. **Image Loading**
   - Test with slow network
   - Verify placeholders show
   - Check loading indicators

3. **Navigation**
   - Test screen transitions
   - Verify smooth animations
   - Check for delays

### Automated Testing

```bash
# Run performance tests
npm test -- --testPathPattern=performance

# Profile bundle size
npm run analyze

# Check for memory leaks
npm run test:memory
```

## Resources

- [React Native Performance](https://reactnative.dev/docs/performance)
- [Optimizing Flatlist](https://reactnative.dev/docs/optimizing-flatlist-configuration)
- [Image Performance](https://reactnative.dev/docs/images#cache-control-ios-only)
- [Profiling](https://reactnative.dev/docs/profiling)
