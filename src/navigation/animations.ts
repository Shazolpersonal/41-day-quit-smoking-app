import {StackNavigationOptions} from '@react-navigation/stack';

// Custom transition animations for different screen types

export const fadeAnimation: StackNavigationOptions = {
  animation: 'fade',
  animationDuration: 300,
};

export const slideFromRightAnimation: StackNavigationOptions = {
  animation: 'slide_from_right',
  animationDuration: 300,
};

export const slideFromBottomAnimation: StackNavigationOptions = {
  animation: 'slide_from_bottom',
  animationDuration: 400,
};

export const modalAnimation: StackNavigationOptions = {
  presentation: 'modal',
  animation: 'slide_from_bottom',
  animationDuration: 400,
};

export const scaleAnimation: StackNavigationOptions = {
  animation: 'fade',
  animationDuration: 200,
};

// Animation presets for different screen types
export const animationPresets = {
  default: slideFromRightAnimation,
  modal: modalAnimation,
  fade: fadeAnimation,
  slideFromBottom: slideFromBottomAnimation,
  scale: scaleAnimation,
};
