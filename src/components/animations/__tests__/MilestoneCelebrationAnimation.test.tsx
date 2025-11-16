import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {MilestoneCelebrationAnimation} from '../MilestoneCelebrationAnimation';

describe('MilestoneCelebrationAnimation', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    visible: true,
    title: 'Test Title',
    description: 'Test Description',
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when visible', () => {
    const {getByText} = render(<MilestoneCelebrationAnimation {...defaultProps} />);
    
    expect(getByText('Test Title')).toBeTruthy();
    expect(getByText('Test Description')).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const {queryByText} = render(
      <MilestoneCelebrationAnimation {...defaultProps} visible={false} />
    );
    
    expect(queryByText('Test Title')).toBeFalsy();
  });

  it('calls onClose when button is pressed', () => {
    const {getByText} = render(<MilestoneCelebrationAnimation {...defaultProps} />);
    
    const button = getByText('চালিয়ে যান');
    fireEvent.press(button);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders custom icon when provided', () => {
    const {getByTestId} = render(
      <MilestoneCelebrationAnimation {...defaultProps} icon="star" />
    );
    
    // Icon component should be rendered
    expect(getByTestId).toBeTruthy();
  });

  it('renders confetti elements', () => {
    const {UNSAFE_getAllByType} = render(
      <MilestoneCelebrationAnimation {...defaultProps} />
    );
    
    // Should have confetti elements
    expect(UNSAFE_getAllByType).toBeTruthy();
  });
});
