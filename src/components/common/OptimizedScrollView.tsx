/**
 * OptimizedScrollView Component
 * 
 * Optimized ScrollView with smooth scrolling and performance enhancements
 */

import React, { useRef, useCallback } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { throttle } from '../../utils/performance';

export interface OptimizedScrollViewProps extends ScrollViewProps {
  onScrollThrottled?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  throttleDelay?: number;
}

export const OptimizedScrollView: React.FC<OptimizedScrollViewProps> = ({
  children,
  onScrollThrottled,
  throttleDelay = 100,
  onScroll,
  ...props
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  // Throttled scroll handler
  const throttledScrollHandler = useRef(
    throttle((event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScrollThrottled?.(event);
    }, throttleDelay)
  ).current;

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      // Call original onScroll if provided
      onScroll?.(event);
      
      // Call throttled handler
      throttledScrollHandler(event);
    },
    [onScroll, throttledScrollHandler]
  );

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      // Performance optimizations
      removeClippedSubviews={true}
      // Smooth scrolling
      decelerationRate="normal"
      bounces={true}
      bouncesZoom={false}
      // Other props
      {...props}
    >
      {children}
    </ScrollView>
  );
};
