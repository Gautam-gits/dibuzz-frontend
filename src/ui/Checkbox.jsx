import React, { forwardRef } from 'react';
import { designTokens } from './design-tokens';

/**
 * Checkbox Component
 * Unified checkbox component with indeterminate state support
 */

const baseStyles = `
  h-4 w-4
  border-2
  rounded-sm
  text-brand-500
  focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
  cursor-pointer
  transition-all duration-200
  flex-shrink-0
`;

const labelStyles = `
  ml-3 text-sm font-medium text-neutral-700
  cursor-pointer
  select-none
  flex-1
`;

const descriptionStyles = `
  block text-sm text-neutral-500 mt-0.5
`;

const errorStyles = `
  mt-1.5 text-sm text-error-main
`;

export const Checkbox = forwardRef(
  (
    {
      label,
      description,
      checked,
      onChange,
      disabled = false,
      indeterminate = false,
      error,
      className = '',
      id,
      name,
      required,
      ...props
    },
    ref
  ) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={className}>
        <div className="flex items-start gap-3">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            name={name}
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}
            required={required}
            indeterminate={indeterminate}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${checkboxId}-error` : description ? `${checkboxId}-description` : undefined}
            className={`
              ${baseStyles}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${error ? 'border-error-main' : ''}
            `}
            {...props}
          />
          <div className="flex-1 min-w-0">
            {label && (
              <label htmlFor={checkboxId} className={labelStyles}>
                {label}
              </label>
            )}
            {description && (
              <p id={`${checkboxId}-description`} className={descriptionStyles}>
                {description}
              </p>
            )}
            {error && (
              <p id={`${checkboxId}-error`} className={errorStyles} role="alert">
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

export default Checkbox;