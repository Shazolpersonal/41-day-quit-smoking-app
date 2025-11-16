import React from 'react';
import {render} from '@testing-library/react-native';
import {TaskCompletionAnimation} from '../TaskCompletionAnimation';

jest.useFakeTimers();

describe('TaskCompletionAnimation', () => {
  const mockOnComplete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when visible', () => {
    const {getByTestId} = render(
      <TaskCompletionAnimation visible={true} onAnimationComplete={mockOnComplete} />
    );
    
    expect(getByTestId).toBeTruthy();
  });

  it('does not render when not visible', () => {
    const {container} = render(
      <TaskCompletionAnimation visible={false} onAnimationComplete={mockOnComplete} />
    );
    
    expect(container).toBeTruthy();
  });

  it('calls onAnimationComplete after animation', () => {
    render(<TaskCompletionAnimation visible={true} onAnimationComplete={mockOnComplete} />);
    
    jest.advanceTimersByTime(1000);
    
    expect(mockOnComplete).toHaveBeenCalledTimes(1);
  });

  it('does not call onAnimationComplete when not visible', () => {
    render(<TaskCompletionAnimation visible={false} onAnimationComplete={mockOnComplete} />);
    
    jest.advanceTimersByTime(1000);
    
    expect(mockOnComplete).not.toHaveBeenCalled();
  });
});
