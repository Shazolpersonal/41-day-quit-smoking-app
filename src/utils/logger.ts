/**
 * Production Logger Utility
 * 
 * Provides conditional logging based on environment.
 * In production, logs are disabled to improve performance and security.
 */

/* eslint-disable no-console */

// React Native provides __DEV__ global variable
declare const __DEV__: boolean;

// Console type declaration for React Native
declare const console: {
  log: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
  info: (...args: any[]) => void;
  group: (label: string) => void;
  groupEnd: () => void;
  time: (label: string) => void;
  timeEnd: (label: string) => void;
};

export class Logger {
  /**
   * Log debug information (disabled in production)
   */
  static log(...args: any[]): void {
    if (__DEV__) {
      console.log(...args);
    }
  }

  /**
   * Log warnings (disabled in production)
   */
  static warn(...args: any[]): void {
    if (__DEV__) {
      console.warn(...args);
    }
  }

  /**
   * Log errors (always enabled for crash reporting)
   */
  static error(...args: any[]): void {
    console.error(...args);
    // In production, you might want to send this to a crash reporting service
    // Example: Sentry.captureException(args[0]);
  }

  /**
   * Log info (disabled in production)
   */
  static info(...args: any[]): void {
    if (__DEV__) {
      console.info(...args);
    }
  }

  /**
   * Group logs together (disabled in production)
   */
  static group(label: string): void {
    if (__DEV__) {
      console.group(label);
    }
  }

  /**
   * End log group (disabled in production)
   */
  static groupEnd(): void {
    if (__DEV__) {
      console.groupEnd();
    }
  }

  /**
   * Log with timestamp (disabled in production)
   */
  static time(label: string): void {
    if (__DEV__) {
      console.time(label);
    }
  }

  /**
   * End time log (disabled in production)
   */
  static timeEnd(label: string): void {
    if (__DEV__) {
      console.timeEnd(label);
    }
  }
}

// Export default instance
export default Logger;
