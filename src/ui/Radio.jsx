import React, { forwardRef } from 'react';
import { designTokens } from './design-tokens';

/**
 * Radio Group Component
 * Unified radio button group component
 */

const groupStyles = `
  space-y-2
`;

const itemStyles = `
  flex items-center gap-3
  cursor-pointer
`;

const inputStyles = `
  h-4 w-4
  border-border-medium
  text-brand-500
  focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
  cursor-pointer
  transition-colors duration-200
`;

const labelStyles = `
  text-sm font-medium text-neutral-700
  cursor-pointer
  flex-1
`;

const descriptionStyles = `
  block text-sm text-neutral-500 mt-0.5
`;

const errorStyles = `
  mt-1.5 text-sm text-error-main
`;

const groupLabelStyles = `
  block text-sm font-semibold text-neutral-700 mb-2
`;

export const RadioGroup = forwardRef(
  (
    {
      label,
      options = [],
      value,
      onChange,
      disabled = false,
      required = false,
      error,
      className = '',
      name,
      direction = 'vertical', // 'vertical' | 'horizontal'
      ...props
    },
    ref
  ) => {
    const groupName = name || `radio-group-${Math.random().toString(36).slice(2, 9)}`;
    const layoutStyles = direction === 'horizontal' ? 'flex flex-wrap gap-4' : 'space-y-2';

    return (
      <fieldset className={`${groupStyles} ${className}`} ref={ref} {...props}>
        {label && (
          <legend className={groupLabelStyles}>
            {label}
            {required && <span className="text-error-main ml-0.5" aria-hidden="true">*</span>}
          </legend>
        )}

        <div className={layoutStyles} role="radiogroup" aria-label={label} {...props}>
          {options.map((option) => (
            <label key={option.value} className={itemStyles}>
              <input
                type="radio"
                name={groupName}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange?.(option.value)}
                disabled={disabled || option.disabled}
                required={required}
                className={inputStyles}
                aria-describedby={error ? `${groupName}-error` : undefined}
              />
              <div className="flex-1">
                <span className={labelStyles}>
                  {option.label}
                </span>
                {option.description && (
                  <p className={descriptionStyles}>{option.description}</p>
                )}
              </div>
            </label>
          ))}
        </div>

        {error && (
          <p id={`${groupName}-error`} className={errorStyles} role="alert">
            {error}
          </p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

export default RadioGroup;