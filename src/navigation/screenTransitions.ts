/**
 * Screen Transition Configurations
 * Custom transition animations for React Navigation
 */

import { StackNavigationOptions } from '@react-navigation/stack';
import { TransitionPresets } from '@react-navigation/stack';

// Slide from right transition (default iOS style)
export const slideFromRightTransition: StackNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true,
  gestureDirection: 'horizontal',
};

// Slide from bottom transition (modal style)
export const slideFromBottomTransition: StackNavigationOptions = {
  ...TransitionPresets.ModalSlideFromBottomIOS,
  gestureEnabled: true,
  gestureDirection: 'vertical',
};

// Fade transition
export const fadeTransition: StackNavigationOptions = {
  ...TransitionPresets.FadeFromBottomAndroid,
  gestureEnabled: false,
};

// Scale from center transition
export const scaleFromCenterTransition: StackNavigationOptions = {
  ...TransitionPresets.ScaleFromCenterAndroid,
  gestureEnabled: true,
};

// Default transition for the app
export const defaultTransition: StackNavigationOptions = {
  ...TransitionPresets.SlideFromRightIOS,
  gestureEnabled: true,
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

// Modal transition with backdrop
export const modalTransition: StackNavigationOptions = {
  presentation: 'modal',
  gestureEnabled: true,
  gestureDirection: 'vertical',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

// Celebration screen transition (scale and fade)
export const celebrationTransition: StackNavigationOptions = {
  gestureEnabled: false,
  cardStyleInterpolator: ({ current }) => {
    return {
      cardStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0.5, 1],
        }),
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.8, 1],
            }),
          },
        ],
      },
    };
  },
};

// Quick action transition (fast slide)
export const quickActionTransition: StackNavigationOptions = {
  gestureEnabled: true,
  transitionSpec: {
    open: {
      animation: 'timing',
      config: {
        duration: 200,
      },
    },
    close: {
      animation: 'timing',
      config: {
        duration: 200,
      },
    },
  },
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
