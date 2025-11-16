import { debounce, throttle, memoize, getVisibleRange } from '../performance';

describe('Performance Utilities', () => {
  describe('debounce', () => {
    jest.useFakeTimers();

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      debouncedFn();
      debouncedFn();

      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should call with latest arguments', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn('first');
      debouncedFn('second');
      debouncedFn('third');

      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith('third');
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('throttle', () => {
    jest.useFakeTimers();

    it('should throttle function calls', () => {
      const mockFn = jest.fn();
      const throttledFn = throttle(mockFn, 100);

      throttledFn();
      throttledFn();
      throttledFn();

      expect(mockFn).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(100);

      throttledFn();
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    afterEach(() => {
      jest.clearAllTimers();
    });
  });

  describe('memoize', () => {
    it('should cache function results', () => {
      const expensiveFn = jest.fn((a: number, b: number) => a + b);
      const memoizedFn = memoize(expensiveFn);

      const result1 = memoizedFn(1, 2);
      const result2 = memoizedFn(1, 2);
      const result3 = memoizedFn(2, 3);

      expect(result1).toBe(3);
      expect(result2).toBe(3);
      expect(result3).toBe(5);
      expect(expensiveFn).toHaveBeenCalledTimes(2);
    });

    it('should return cached result for same arguments', () => {
      const expensiveFn = jest.fn((x: number) => x * 2);
      const memoizedFn = memoize(expensiveFn);

      memoizedFn(5);
      memoizedFn(5);
      memoizedFn(5);

      expect(expensiveFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getVisibleRange', () => {
    it('should calculate visible range correctly', () => {
      const result = getVisibleRange(0, 100, 500, 20, 2);
      
      expect(result.start).toBe(0);
      expect(result.end).toBeGreaterThan(result.start);
    });

    it('should include overscan items', () => {
      const result = getVisibleRange(500, 100, 500, 20, 3);
      
      expect(result.start).toBeLessThan(5);
      expect(result.end).toBeGreaterThan(10);
    });

    it('should not exceed total items', () => {
      const result = getVisibleRange(1500, 100, 500, 20, 5);
      
      expect(result.end).toBeLessThanOrEqual(20);
    });

    it('should not go below zero', () => {
      const result = getVisibleRange(0, 100, 500, 20, 5);
      
      expect(result.start).toBeGreaterThanOrEqual(0);
    });
  });
});
