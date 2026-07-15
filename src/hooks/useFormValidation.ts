import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

// Validation Rules Types
type ValidationRule = {
  validate: (value: string) => boolean;
  message: string;
};

type ValidationRules = {
  [key: string]: ValidationRule[];
};

// Common Validation Rules
export const validationRules = {
  required: (message = 'Kolom ini wajib diisi') => ({
    validate: (value: string) => value.trim().length > 0,
    message,
  }),

  minLength: (min: number, message?: string) => ({
    validate: (value: string) => value.length >= min,
    message: message || `Minimal ${min} karakter`,
  }),

  maxLength: (max: number, message?: string) => ({
    validate: (value: string) => value.length <= max,
    message: message || `Maksimal ${max} karakter`,
  }),

  email: (message = 'Format email tidak valid') => ({
    validate: (value: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message,
  }),

  phone: (message = 'Format nomor telepon tidak valid') => ({
    validate: (value: string) => {
      const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
      return phoneRegex.test(value.replace(/\s/g, ''));
    },
    message,
  }),

  numeric: (message = 'Hanya boleh berisi angka') => ({
    validate: (value: string) => /^\d+$/.test(value),
    message,
  }),

  positiveNumber: (message = 'Harus berupa angka positif') => ({
    validate: (value: string) => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    },
    message,
  }),

  nis: (message = 'Format NIS tidak valid (6-10 digit angka)') => ({
    validate: (value: string) => {
      return /^\d{6,10}$/.test(value);
    },
    message,
  }),

  alphanumeric: (message = 'Hanya boleh berisi huruf dan angka') => ({
    validate: (value: string) => /^[a-zA-Z0-9\s]+$/.test(value),
    message,
  }),

  noSpaces: (message = 'Tidak boleh mengandung spasi') => ({
    validate: (value: string) => !/\s/.test(value),
    message,
  }),

  match: (regex: RegExp, message: string) => ({
    validate: (value: string) => regex.test(value),
    message,
  }),

  custom: (validateFn: (value: string) => boolean, message: string) => ({
    validate: validateFn,
    message,
  }),
};

// Form Field State
interface FormFieldState {
  value: string;
  error: string | null;
  touched: boolean;
  focused: boolean;
}

// Hook Return Type
interface UseFormValidationReturn {
  fields: { [key: string]: FormFieldState };
  errors: { [key: string]: string | null };
  touched: { [key: string]: boolean };
  isValid: boolean;
  isSubmitting: boolean;
  setFieldValue: (name: string, value: string) => void;
  setFieldError: (name: string, error: string | null) => void;
  setFieldTouched: (name: string, touched?: boolean) => void;
  setFieldFocused: (name: string, focused: boolean) => void;
  validateField: (name: string) => boolean;
  validateAll: () => boolean;
  resetForm: () => void;
  resetField: (name: string) => void;
  handleSubmit: (onSubmit: (values: { [key: string]: string }) => void) => (e: React.FormEvent) => void;
  getFieldProps: (name: string) => {
    value: string;
    error: string | null;
    touched: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onBlur: () => void;
    onFocus: () => void;
  };
}

// Main Hook
export function useFormValidation(
  initialValues: { [key: string]: string } = {},
  validationSchema: ValidationRules = {},
  options: {
    validateOnChange?: boolean;
    validateOnBlur?: boolean;
    validateOnSubmit?: boolean;
  } = {}
): UseFormValidationReturn {
  const { validateOnChange = true, validateOnBlur = true, validateOnSubmit = true } = options;

  const [fields, setFields] = useState<{ [key: string]: FormFieldState }>(() => {
    const initial: { [key: string]: FormFieldState } = {};
    Object.keys(initialValues).forEach((key) => {
      initial[key] = {
        value: initialValues[key] || '',
        error: null,
        touched: false,
        focused: false,
      };
    });
    return initial;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate single field
  const validateField = useCallback(
    (name: string): boolean => {
      const field = fields[name];
      if (!field) return true;

      const rules = validationSchema[name];
      if (!rules) return true;

      for (const rule of rules) {
        if (!rule.validate(field.value)) {
          setFields((prev) => ({
            ...prev,
            [name]: { ...prev[name], error: rule.message },
          }));
          return false;
        }
      }

      setFields((prev) => ({
        ...prev,
        [name]: { ...prev[name], error: null },
      }));
      return true;
    },
    [fields, validationSchema]
  );

  // Validate all fields
  const validateAll = useCallback((): boolean => {
    let isAllValid = true;

    Object.keys(validationSchema).forEach((name) => {
      const rules = validationSchema[name];
      const value = fields[name]?.value || '';

      for (const rule of rules) {
        if (!rule.validate(value)) {
          setFields((prev) => ({
            ...prev,
            [name]: { ...prev[name], error: rule.message, touched: true },
          }));
          isAllValid = false;
          break;
        }
      }
    });

    return isAllValid;
  }, [fields, validationSchema]);

  // Set field value
  const setFieldValue = useCallback(
    (name: string, value: string) => {
      setFields((prev) => ({
        ...prev,
        [name]: { ...prev[name], value },
      }));

      if (validateOnChange && fields[name]?.touched) {
        validateField(name);
      }
    },
    [fields, validateOnChange, validateField]
  );

  // Set field error manually
  const setFieldError = useCallback((name: string, error: string | null) => {
    setFields((prev) => ({
      ...prev,
      [name]: { ...prev[name], error },
    }));
  }, []);

  // Set field touched
  const setFieldTouched = useCallback(
    (name: string, touched = true) => {
      setFields((prev) => ({
        ...prev,
        [name]: { ...prev[name], touched },
      }));

      if (validateOnBlur && touched) {
        validateField(name);
      }
    },
    [validateOnBlur, validateField]
  );

  // Set field focused
  const setFieldFocused = useCallback((name: string, focused: boolean) => {
    setFields((prev) => ({
      ...prev,
      [name]: { ...prev[name], focused },
    }));
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    const initial: { [key: string]: FormFieldState } = {};
    Object.keys(initialValues).forEach((key) => {
      initial[key] = {
        value: initialValues[key] || '',
        error: null,
        touched: false,
        focused: false,
      };
    });
    setFields(initial);
    setIsSubmitting(false);
  }, [initialValues]);

  // Reset single field
  const resetField = useCallback(
    (name: string) => {
      setFields((prev) => ({
        ...prev,
        [name]: {
          value: initialValues[name] || '',
          error: null,
          touched: false,
          focused: false,
        },
      }));
    },
    [initialValues]
  );

  // Handle form submission
  const handleSubmit = useCallback(
    (onSubmit: (values: { [key: string]: string }) => void) => {
      return (e: React.FormEvent) => {
        e.preventDefault();

        // Mark all fields as touched
        Object.keys(fields).forEach((name) => {
          setFields((prev) => ({
            ...prev,
            [name]: { ...prev[name], touched: true },
          }));
        });

        const isValid = validateAll();

        if (isValid) {
          setIsSubmitting(true);
          const values: { [key: string]: string } = {};
          Object.keys(fields).forEach((name) => {
            values[name] = fields[name].value;
          });
          onSubmit(values);
          setIsSubmitting(false);
        }
      };
    },
    [fields, validateAll]
  );

  // Get field props for controlled input
  const getFieldProps = useCallback(
    (name: string) => {
      const field = fields[name];
      return {
        value: field?.value || '',
        error: field?.error || null,
        touched: field?.touched || false,
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
          setFieldValue(name, e.target.value);
        },
        onBlur: () => {
          setFieldTouched(name, true);
        },
        onFocus: () => {
          setFieldFocused(name, true);
        },
      };
    },
    [fields, setFieldValue, setFieldTouched, setFieldFocused]
  );

  // Extract errors and touched states
  const errors: { [key: string]: string | null } = {};
  const touched: { [key: string]: boolean } = {};
  let isValid = true;

  Object.keys(fields).forEach((name) => {
    errors[name] = fields[name].error;
    touched[name] = fields[name].touched;
    if (fields[name].error) isValid = false;
  });

  return {
    fields,
    errors,
    touched,
    isValid,
    isSubmitting,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setFieldFocused,
    validateField,
    validateAll,
    resetForm,
    resetField,
    handleSubmit,
    getFieldProps,
  };
}

// Form Field Component
interface FormFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  fieldProps: ReturnType<typeof useFormValidation>['getFieldProps'];
  children?: React.ReactNode;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required,
  disabled,
  className = '',
  fieldProps,
  children,
}: FormFieldProps) {
  const { value, error, touched, onChange, onBlur, onFocus } = fieldProps;
  const [showPassword, setShowPassword] = React.useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-300">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {children ? (
          children
        ) : (
          <>
            <input
              type={inputType}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              onFocus={onFocus}
              placeholder={placeholder}
              disabled={disabled}
              className={`
                w-full px-4 py-2.5 bg-slate-900 border rounded-xl text-white
                placeholder-slate-500 focus:outline-none transition
                ${error && touched
                  ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                  : 'border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            />
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </>
        )}
      </div>

      {/* Error Message */}
      {error && touched && (
        <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}

// Success Indicator Component
export function SuccessIndicator({ show, message }: { show: boolean; message?: string }) {
  if (!show) return null;

  return (
    <div className="flex items-center gap-1.5 text-emerald-400 text-xs mt-1">
      <CheckCircle className="w-3.5 h-3.5" />
      {message || 'Valid'}
    </div>
  );
}

// Form Validation Summary
interface ValidationSummaryProps {
  errors: { [key: string]: string | null };
  touched: { [key: string]: boolean };
}

export function ValidationSummary({ errors, touched }: ValidationSummaryProps) {
  const visibleErrors = Object.entries(errors).filter(
    ([, error]) => error !== null && touched[error !== null ? error : '']
  );

  if (visibleErrors.length === 0) return null;

  return (
    <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 space-y-2">
      <p className="text-sm font-semibold text-rose-400 flex items-center gap-2">
        <AlertCircle className="w-4 h-4" />
        Harap perbaiki kesalahan berikut:
      </p>
      <ul className="text-xs text-slate-300 space-y-1 ml-6 list-disc">
        {visibleErrors.map(([name, error]) => (
          <li key={name}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

// Debounced Input Hook (for search fields)
export function useDebouncedValue(value: string, delay: number = 300): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Character Counter Component
export function CharacterCounter({
  current,
  max,
  className = '',
}: {
  current: number;
  max: number;
  className?: string;
}) {
  const isOverLimit = current > max;
  const isNearLimit = current >= max * 0.9;

  return (
    <p
      className={`text-xs text-right mt-1 ${className} ${
        isOverLimit
          ? 'text-rose-400'
          : isNearLimit
          ? 'text-amber-400'
          : 'text-slate-500'
      }`}
    >
      {current}/{max}
    </p>
  );
}

// Password Strength Indicator
export function PasswordStrength({
  password,
  className = '',
}: {
  password: string;
  className?: string;
}) {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  const strength = getStrength();
  const labels = ['Lemah', 'Sedang', 'Cukup', 'Kuat', 'Sangat Kuat'];
  const colors = ['bg-rose-500', 'bg-amber-500', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500'];

  if (password.length === 0) return null;

  return (
    <div className={className}>
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition ${
              level <= strength ? colors[strength - 1] : 'bg-slate-700'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs ${
        strength <= 2 ? 'text-rose-400' : strength <= 3 ? 'text-amber-400' : 'text-emerald-400'
      }`}>
        Kekuatan: {labels[strength - 1] || 'Kosong'}
      </p>
    </div>
  );
}

// Input with Character Counter
interface InputWithCounterProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  placeholder?: string;
  label?: string;
  className?: string;
}

export function InputWithCounter({
  value,
  onChange,
  maxLength,
  placeholder,
  label,
  className = '',
}: InputWithCounterProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-semibold text-slate-300 mb-1.5">
          {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
      />
      <CharacterCounter current={value.length} max={maxLength} />
    </div>
  );
}
