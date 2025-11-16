import React from 'react';
import {render} from '@testing-library/react-native';
import {BreathingCircleAnimation} from '../BreathingCircleAnimation';

describe('BreathingCircleAnimation', () => {
  it('renders correctly', () => {
    const {getByText} = render(
      <BreathingCircleAnimation isActive={false} phase="inhale" />
    );
    
    expect(getByText('শ্বাস নিন')).toBeTruthy();
  });

  it('displays correct phase text for inhale', () => {
    const {getByText} = render(
      <BreathingCircleAnimation isActive={true} phase="inhale" />
    );
    
    expect(getByText('শ্বাস নিন')).toBeTruthy();
  });

  it('displays correct phase text for hold', () => {
    const {getByText} = render(
      <BreathingCircleAnimation isActive={true} phase="hold" />
    );
    
    expect(getByText('ধরে রাখুন')).toBeTruthy();
  });

  it('displays correct phase text for exhale', () => {
    const {getByText} = render(
      <BreathingCircleAnimation isActive={true} phase="exhale" />
    );
    
    expect(getByText('শ্বাস ছাড়ুন')).toBeTruthy();
  });

  it('accepts custom duration', () => {
    const {getByText} = render(
      <BreathingCircleAnimation isActive={true} phase="inhale" duration={5000} />
    );
    
    expect(getByText('শ্বাস নিন')).toBeTruthy();
  });
});
