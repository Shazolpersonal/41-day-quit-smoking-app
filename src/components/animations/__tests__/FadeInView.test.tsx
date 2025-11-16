import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import {FadeInView} from '../FadeInView';

describe('FadeInView', () => {
  it('renders children correctly', () => {
    const {getByText} = render(
      <FadeInView>
        <Text>Test Content</Text>
      </FadeInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('accepts custom duration', () => {
    const {getByText} = render(
      <FadeInView duration={500}>
        <Text>Test Content</Text>
      </FadeInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('accepts custom delay', () => {
    const {getByText} = render(
      <FadeInView delay={200}>
        <Text>Test Content</Text>
      </FadeInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = {backgroundColor: 'red'};
    const {getByText} = render(
      <FadeInView style={customStyle}>
        <Text>Test Content</Text>
      </FadeInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });
});
