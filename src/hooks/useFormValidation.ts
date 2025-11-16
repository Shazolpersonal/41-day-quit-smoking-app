/**
 * useFormValidation Hook
 * Provides form validation state management
 */

import {useState, useCallback} from 'react';
import {ValidationResult} from '../utils/validation';

export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface FormActions<T> {
  setFieldValue: (field: keyof T, value: any) => void;
  setFieldError: (field: keyof T, error: string) => void;
  setFieldTouched: (field: keyof T, touched: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
  resetForm: () => void;
  handleSubmit: (onSubmit: (values: T) => Promise<void>) => Promise<void>;
  validateField: (field: keyof T) => boolean;
  validateForm: () => boolean;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validate: (values: T) => ValidationResult
): [FormState<T>, FormActions<T>] {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if form is valid
  const isValid = Object.keys(errors).length === 0;

  // Set field value
  const setFieldValue = useCallback((field: keyof T, value: any) => {
    setValues(prev => ({...prev, [field]: value}));
    // Clear error when user starts typing
    setErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[field as string];
      return newErrors;
    });
  }, []);

  // Set field error
  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({...prev, [field as string]: error}));
  }, []);

  // Set field touched
  const setFieldTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({...prev, [field as string]: isTouched}));
  }, []);

  // Set multiple errors
  const setErrorsMultiple = useCallback((newErrors: Record<string, string>) => {
    setErrors(newErrors);
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Validate single field
  const validateField = useCallback(
    (field: keyof T): boolean => {
      const result = validate(values);
      const fieldError = result.errors[field as string];

      if (fieldError) {
        setFieldError(field, fieldError);
        return false;
      }

      return true;
    },
    [values, validate, setFieldError]
  );

  // Validate entire form
  const validateForm = useCallback((): boolean => {
    const result = validate(values);
    setErrors(result.errors);
    return result.isValid;
  }, [values, validate]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (onSubmit: (values: T) => Promise<void>) => {
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({...acc, [key]: true}),
        {}
      );
      setTouched(allTouched);

      // Validate form
      const result = validate(values);
      setErrors(result.errors);

      if (!result.isValid) {
        return;
      }

      // Submit form
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate]
  );

  const state: FormState<T> = {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
  };

  const actions: FormActions<T> = {
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setErrors: setErrorsMultiple,
    resetForm,
    handleSubmit,
    validateField,
    validateForm,
  };

  return [state, actions];
}
