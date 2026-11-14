import React, { forwardRef } from 'react';
import { designTokens } from './design-tokens';

/**
 * Textarea Component
 * Unified textarea component with auto-resize, character count, and validation
 */

const baseStyles = `
  w-full
  rounded-control
  border
  bg-white
  text-neutral-900
  placeholder:text-neutral-400
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
  disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
  resize-none
`;

const sizeStyles = {
  sm: 'px-3 py-2 text-sm min-h-[80px]',
  md: 'px-4 py-3 text-sm min-h-[100px]',
  lg: 'px-4 py-4 text-base min-h-[120px]',
};

const stateStyles = {
  default: 'border-border-medium hover:border-brand-300',
  error: 'border-error-main focus:ring-error-main focus:border-error-main',
  success: 'border-success-main focus:ring-success-main focus:border-success-main',
};

const labelStyles = `
  block text-xs font-semibold text-neutral-700 mb-1.5
`;

const helperStyles = `
  mt-1.5 text-xs
`;

const helperStateStyles = {
  default: 'text-neutral-500',
  error: 'text-error-main',
  success: 'text-success-main',
};

const charCountStyles = `
  text-right mt-1 text-xs text-neutral-400
`;

const autoResizeStyles = `
  transition-none
`;

export const Textarea = forwardRef(
  (
    {
      label,
      error,
      helperText,
      successMessage,
      className = '',
      state = 'default',
      size = 'md',
      rows = 4,
      autoResize = false,
      maxLength,
      showCharCount = true,
      ...props
    },
    ref
  ) => {
    const textareaId = props.id || `textarea-${Math.random().toString(36).slice(2, 9)}`;
    const helperId = helperText || error || successMessage ? `${textareaId}-helper` : undefined;
    const displayHelperText = error || helperText || successMessage;
    const helperType = error ? 'error' : successMessage ? 'success' : 'default';

    const handleChange = (e) => {
      props.onChange?.(e);
      if (autoResize) {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    return (
      <div className={className}>
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-semibold text-neutral-700 mb-1.5">
            {label}
            {props.required && <span className="text-error-main ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          className={`
            ${baseStyles}
            ${sizeStyles[size] || sizeStyles.md}
            ${stateStyles[state] || stateStyles.default}
            ${autoResize ? autoResizeStyles : ''}
            ${className}
          `}
          rows={rows}
          onChange={handleChange}
          aria-invalid={state === 'error'}
          aria-describedby={helperId}
          {...props}
        />

        {(showCharCount && maxLength) && (
          <div className={charCountStyles}>
            {props.value?.length || 0}/{maxLength}
          </div>
        )}

        {displayHelperText && (
          <p
            id={helperId}
            className={`${helperStyles} ${helperStateStyles[helperType]}`}
            role={state === 'error' ? 'alert' : undefined}
          >
            {error || helperText || successMessage}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
