/**
 * Global Error Handler
 * Centralized error handling and logging system
 */

import {Alert} from 'react-native';

export enum ErrorType {
  STORAGE = 'STORAGE',
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  timestamp: Date;
  context?: string;
}

class ErrorHandler {
  private errors: AppError[] = [];
  private maxErrors = 50; // Keep last 50 errors

  /**
   * Handle error with user-friendly message
   */
  handle(error: Error | AppError, context?: string): void {
    const appError = this.normalizeError(error, context);
    this.logError(appError);
    this.showUserMessage(appError);
  }

  /**
   * Handle error silently (log only, no user message)
   */
  handleSilent(error: Error | AppError, context?: string): void {
    const appError = this.normalizeError(error, context);
    this.logError(appError);
  }

  /**
   * Normalize error to AppError format
   */
  private normalizeError(error: Error | AppError, context?: string): AppError {
    if (this.isAppError(error)) {
      return error;
    }

    return {
      type: this.detectErrorType(error),
      message: error.message || 'একটি অজানা ত্রুটি ঘটেছে',
      originalError: error,
      timestamp: new Date(),
      context,
    };
  }

  /**
   * Check if error is already AppError
   */
  private isAppError(error: any): error is AppError {
    return error && typeof error === 'object' && 'type' in error && 'timestamp' in error;
  }

  /**
   * Detect error type from error message
   */
  private detectErrorType(error: Error): ErrorType {
    const message = error.message.toLowerCase();

    if (message.includes('storage') || message.includes('asyncstorage')) {
      return ErrorType.STORAGE;
    }
    if (message.includes('network') || message.includes('fetch')) {
      return ErrorType.NETWORK;
    }
    if (message.includes('validation') || message.includes('invalid')) {
      return ErrorType.VALIDATION;
    }
    if (message.includes('permission')) {
      return ErrorType.PERMISSION;
    }

    return ErrorType.UNKNOWN;
  }

  /**
   * Log error to console and store in memory
   */
  private logError(error: AppError): void {
    console.error(`[${error.type}] ${error.context || 'Unknown context'}:`, error.message);
    if (error.originalError) {
      console.error('Original error:', error.originalError);
    }

    // Store error in memory
    this.errors.push(error);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift(); // Remove oldest error
    }
  }

  /**
   * Show user-friendly error message
   */
  private showUserMessage(error: AppError): void {
    const userMessage = this.getUserMessage(error);
    const title = this.getErrorTitle(error.type);

    Alert.alert(title, userMessage, [
      {
        text: 'ঠিক আছে',
        style: 'default',
      },
    ]);
  }

  /**
   * Get user-friendly error title
   */
  private getErrorTitle(type: ErrorType): string {
    switch (type) {
      case ErrorType.STORAGE:
        return 'সংরক্ষণ ত্রুটি';
      case ErrorType.NETWORK:
        return 'নেটওয়ার্ক ত্রুটি';
      case ErrorType.VALIDATION:
        return 'যাচাইকরণ ত্রুটি';
      case ErrorType.PERMISSION:
        return 'অনুমতি প্রয়োজন';
      default:
        return 'ত্রুটি';
    }
  }

  /**
   * Get user-friendly error message
   */
  private getUserMessage(error: AppError): string {
    switch (error.type) {
      case ErrorType.STORAGE:
        return 'ডেটা সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
      case ErrorType.NETWORK:
        return 'ইন্টারনেট সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।';
      case ErrorType.VALIDATION:
        return error.message || 'প্রদত্ত তথ্য সঠিক নয়। অনুগ্রহ করে পরীক্ষা করুন।';
      case ErrorType.PERMISSION:
        return 'এই বৈশিষ্ট্য ব্যবহার করতে অনুমতি প্রয়োজন।';
      default:
        return 'একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।';
    }
  }

  /**
   * Get all logged errors
   */
  getErrors(): AppError[] {
    return [...this.errors];
  }

  /**
   * Clear all logged errors
   */
  clearErrors(): void {
    this.errors = [];
  }

  /**
   * Create a storage error
   */
  createStorageError(message: string, context?: string): AppError {
    return {
      type: ErrorType.STORAGE,
      message,
      timestamp: new Date(),
      context,
    };
  }

  /**
   * Create a validation error
   */
  createValidationError(message: string, context?: string): AppError {
    return {
      type: ErrorType.VALIDATION,
      message,
      timestamp: new Date(),
      context,
    };
  }

  /**
   * Create a network error
   */
  createNetworkError(message: string, context?: string): AppError {
    return {
      type: ErrorType.NETWORK,
      message,
      timestamp: new Date(),
      context,
    };
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

/**
 * Retry mechanism for failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000,
  context?: string
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      console.log(`Retry attempt ${attempt}/${maxRetries} failed for ${context || 'operation'}`);

      if (attempt < maxRetries) {
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
      }
    }
  }

  // All retries failed
  throw lastError || new Error('Operation failed after retries');
}

/**
 * Safe async operation wrapper
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    errorHandler.handleSilent(error as Error, context);
    return fallback;
  }
}
