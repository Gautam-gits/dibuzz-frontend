import React, { forwardRef } from 'react';
import { designTokens } from './design-tokens';

/**
 * Input Component
 * Unified input system with label, error, helper text, and icons
 */

const baseInputStyles = `
  w-full
  rounded-control
  border
  bg-white
  text-neutral-900
  placeholder:text-neutral-400
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-0
  disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
  transition-all duration-200
`;

const sizeStyles = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-4 py-3 text-base',
};

const stateStyles = {
  default: 'border-border-medium hover:border-brand-300',
  error: 'border-error-main focus:ring-error-main focus:border-error-main',
  success: 'border-success-main focus:ring-success-main focus:border-success-main',
};

const baseLabelStyles = `
  block text-xs font-semibold text-neutral-700 mb-1.5
`;

const baseHelperStyles = `
  mt-1.5 text-xs
`;

const helperStyles = {
  default: 'text-neutral-500',
  error: 'text-error-main',
  success: 'text-success-main',
};

export const Input = forwardRef(
  (
    {
      label,
      error,
      helperText,
      successMessage,
      leftIcon,
      rightIcon,
      rightElement,
      className = '',
      state = 'default', // 'default' | 'error' | 'success'
      size = 'md',
      fullWidth = true,
      showCharCount,
      maxLength,
      ...props
    },
    ref
  ) => {
    const inputId = props.id || `input-${Math.random().toString(36).slice(2, 9)}`;
    const helperId = helperText || error || successMessage ? `${inputId}-helper` : undefined;
    const displayHelperText = error || helperText || successMessage;
    const helperType = error ? 'error' : successMessage ? 'success' : 'default';

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className={baseLabelStyles}>
            {label}
            {props.required && <span className="text-error-main ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-neutral-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              ${baseInputStyles}
              ${sizeStyles[size] || sizeStyles.md}
              ${stateStyles[state] || stateStyles.default}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon || rightElement ? 'pr-10' : ''}
              ${className}
            `}
            aria-invalid={state === 'error'}
            aria-describedby={helperId}
            {...props}
          />

          {(rightIcon || rightElement) && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
              {rightElement || rightIcon}
            </div>
          )}

          {showCharCount && maxLength && (
            <span className="absolute bottom-1 right-2 text-xs text-neutral-400 pointer-events-none">
              {props.value?.length || 0}/{maxLength}
            </span>
          )}
        </div>

        {displayHelperText && (
          <p
            id={helperId}
            className={`${baseHelperStyles} ${helperStyles[helperType]}`}
            role={state === 'error' ? 'alert' : undefined}
          >
            {error || helperText || successMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Specialized input components
export const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      className = '',
      rows = 4,
      resize = 'vertical',
      showCharCount,
      maxLength,
      ...props
    },
    ref
  ) => {
    const inputId = props.id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const helperId = helperText || error ? `${inputId}-helper` : undefined;
    const state = error ? 'error' : 'default';

    return (
      <div className={className}>
        {label && (
          <label htmlFor={inputId} className={baseLabelStyles}>
            {label}
            {props.required && <span className="text-error-main ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          className={`
            ${baseInputStyles}
            resize-${resize}
            min-h-[${rows * 1.5}rem]
            ${state === 'error' ? 'border-error-main focus:ring-error-main' : 'border-border-medium hover:border-brand-300'}
            ${className}
          `}
          rows={rows}
          aria-invalid={state === 'error'}
          aria-describedby={helperId}
          {...props}
        />

        {showCharCount && maxLength && (
          <div className="text-right mt-1 text-xs text-neutral-400">
            {props.value?.length || 0}/{maxLength}
          </div>
        )}

        {(helperText || error) && (
          <p
            id={helperId}
            className={`${baseHelperText} ${error ? 'text-error-main' : 'text-neutral-500'}`}
            role={error ? 'alert' : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = props.id || `select-${Math.random().toString(36).slice(2, 9)}`;
    const helperId = helperText || error ? `${inputId}-helper` : undefined;
    const state = error ? 'error' : 'default';

    return (
      <div className={className}>
        {label && (
          <label htmlFor={inputId} className={baseLabelStyles}>
            {label}
            {props.required && <span className="text-error-main ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={inputId}
            className={`
              ${baseInputStyles}
              ${sizeStyles.md}
              appearance-none
              bg-white
              pr-10
              ${error ? 'border-error-main focus:ring-error-main' : 'border-border-medium hover:border-brand-300'}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={helperId}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {(helperText || error) && (
          <p
            id={helperId}
            className={`${baseHelperText} ${error ? 'text-error-main' : 'text-neutral-500'}`}
            role={error ? 'alert' : undefined}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export const Checkbox = forwardRef(
  (
    {
      label,
      description,
      error,
      className = '',
      ...props
    },
    ref
  ) => {
    const inputId = props.id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={className}>
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            type="checkbox"
            id={inputId}
            className={`
              h-4 w-4 shrink-0
              rounded-sm
              border-border-medium
              text-brand-500
              focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
              cursor-pointer
              transition-colors duration-200
              ${error ? 'border-error-main' : ''}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          <div className="flex-1">
            {label && (
              <label htmlFor={inputId} className="text-sm font-medium text-neutral-900 cursor-pointer">
                {label}
              </label>
            )}
            {description && (
              <p className="mt-1 text-sm text-neutral-500">{description}</p>
            )}
            {error && (
              <p id={`${inputId}-error`} className="mt-1 text-sm text-error-main" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export const RadioGroup = ({ label, options = [], error, className = '', ...props }) => {
  return (
    <div className={className}>
      {label && (
        <label className={baseLabelStyles}>
          {label}
          {props.required && <span className="text-error-main ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="space-y-2" role="radiogroup" aria-label={label}>
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={props.name}
              value={opt.value}
              className={`
                h-4 w-4 shrink-0
                border-border-medium
                text-brand-500
                focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                cursor-pointer
                transition-colors duration-200
              `}
              {...props}
            />
            <span className="text-sm text-neutral-900">{opt.label}</span>
            {opt.description && <span className="text-sm text-neutral-500">{opt.description}</span>}
          </label>
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error-main" role="alert">{error}</p>
      )}
    </div>
  );
};

export default Input;
