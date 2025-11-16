import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import {SlideInView} from '../SlideInView';

describe('SlideInView', () => {
  it('renders children correctly', () => {
    const {getByText} = render(
      <SlideInView>
        <Text>Test Content</Text>
      </SlideInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('accepts direction prop - left', () => {
    const {getByText} = render(
      <SlideInView direction="left">
        <Text>Test Content</Text>
      </SlideInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('accepts direction prop - right', () => {
    const {getByText} = render(
      <SlideInView direction="right">
        <Text>Test Content</Text>
      </SlideInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('accepts direction prop - top', () => {
    const {getByText} = render(
      <SlideInView direction="top">
        <Text>Test Content</Text>
      </SlideInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('accepts direction prop - bottom', () => {
    const {getByText} = render(
      <SlideInView direction="bottom">
        <Text>Test Content</Text>
      </SlideInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('accepts custom duration and delay', () => {
    const {getByText} = render(
      <SlideInView duration={500} delay={200}>
        <Text>Test Content</Text>
      </SlideInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });
});
