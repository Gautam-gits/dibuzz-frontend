import React, { forwardRef } from 'react';
import { designTokens } from './design-tokens';

/**
 * Switch Component
 * Unified toggle switch component
 */

const baseStyles = `
  relative inline-flex items-center
  cursor-pointer
`;

const trackStyles = `
  relative
  w-11 h-6
  rounded-full
  border-2
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
`;

const thumbStyles = `
  absolute top-0.5 left-0.5
  w-5 h-5
  bg-white rounded-full
  shadow-md
  transition-transform duration-200 ease-out
  flex items-center justify-center
`;

const labelStyles = `
  ml-3 text-sm font-medium text-neutral-700
  cursor-pointer
  select-none
`;

const sizeStyles = {
  sm: {
    track: 'w-8 h-5',
    thumb: 'w-4 h-4 top-0.5 left-0.5',
    checkedTransform: 'translate-x-3',
  },
  md: {
    track: 'w-11 h-6',
    thumb: 'w-5 h-5 top-0.5 left-0.5',
    checkedTransform: 'translate-x-5',
  },
  lg: {
    track: 'w-14 h-7',
    thumb: 'w-6 h-6 top-0.5 left-0.5',
    checkedTransform: 'translate-x-6',
  },
};

export const Switch = forwardRef(
  (
    {
      label,
      checked,
      onChange,
      disabled = false,
      size = 'md',
      className = '',
      id,
      name,
      required,
      ...props
    },
    ref
  ) => {
    const switchId = id || `switch-${Math.random().toString(36).slice(2, 9)}`;
    const sizes = sizeStyles[size] || sizeStyles.md;

    return (
      <label className={`${baseStyles} ${className}`} {...props}>
        <input
          ref={ref}
          type="checkbox"
          id={switchId}
          name={name}
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          required={required}
          className="sr-only"
          aria-describedby={props['aria-describedby']}
        />
        <div
          className={`
            ${trackStyles}
            ${checked ? 'bg-brand-500 border-brand-500' : 'bg-neutral-300 border-neutral-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            ${sizes.track}
          `}
          onClick={() => !disabled && onChange?.(!checked)}
        >
          <div
            className={`
              ${thumbStyles}
              ${checked ? sizes.checkedTransform : 'translate-x-0'}
              ${disabled ? 'opacity-50' : ''}
            `}
            aria-hidden="true"
          >
            {checked && (
              <svg className="w-3 h-3 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
        {label && (
          <span className={`${labelStyles} ${disabled ? 'text-neutral-400' : ''}`}>
            {label}
          </span>
        )}
      </label>
    );
  }
);

Switch.displayName = 'Switch';

export default Switch;