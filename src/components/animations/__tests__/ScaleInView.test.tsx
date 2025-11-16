import React from 'react';
import {render} from '@testing-library/react-native';
import {Text} from 'react-native';
import {ScaleInView} from '../ScaleInView';

describe('ScaleInView', () => {
  it('renders children correctly', () => {
    const {getByText} = render(
      <ScaleInView>
        <Text>Test Content</Text>
      </ScaleInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('accepts custom delay', () => {
    const {getByText} = render(
      <ScaleInView delay={200}>
        <Text>Test Content</Text>
      </ScaleInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('accepts custom initial scale', () => {
    const {getByText} = render(
      <ScaleInView initialScale={0.5}>
        <Text>Test Content</Text>
      </ScaleInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('applies custom styles', () => {
    const customStyle = {backgroundColor: 'blue'};
    const {getByText} = render(
      <ScaleInView style={customStyle}>
        <Text>Test Content</Text>
      </ScaleInView>
    );
    
    expect(getByText('Test Content')).toBeTruthy();
  });
});
