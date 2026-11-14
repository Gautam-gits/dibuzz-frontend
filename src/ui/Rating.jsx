import React, { forwardRef, useState } from 'react';
import { designTokens } from './design-tokens';

/**
 * Rating Component
 * Unified star rating component with half-star support
 */

const containerStyles = `
  inline-flex items-center gap-1
`;

const starStyles = `
  cursor-pointer
  transition-all duration-150
`;

const sizeStyles = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10',
};

const colorStyles = {
  default: 'text-neutral-300',
  filled: 'text-yellow-400',
  half: 'text-yellow-400',
};

const labelStyles = `
  ml-2 text-sm font-medium text-neutral-700
`;

export const Rating = forwardRef(
  (
    {
      value = 0,
      max = 5,
      onChange,
      disabled = false,
      readOnly = false,
      size = 'md',
      allowHalf = true,
      showValue = false,
      className = '',
      name,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = useState(0);
    const [internalValue, setInternalValue] = useState(value);

    const effectiveValue = hoverValue > 0 ? hoverValue : value;
    const displayValue = readOnly ? value : effectiveValue;

    const handleStarClick = (starValue) => {
      if (disabled || readOnly) return;
      const newValue = allowHalf ? starValue : Math.round(starValue);
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const handleStarHover = (starValue) => {
      if (disabled || readOnly) return;
      setHoverValue(allowHalf ? starValue : Math.ceil(starValue));
    };

    const handleLeave = () => {
      setHoverValue(0);
    };

    const handleKeyDown = (e) => {
      if (disabled || readOnly) return;
      let newValue = value;
      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          newValue = Math.min(max, value + (allowHalf ? 0.5 : 1));
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newValue = Math.max(0, value - (allowHalf ? 0.5 : 1));
          break;
        case 'Home':
          e.preventDefault();
          newValue = 0;
          break;
        case 'End':
          e.preventDefault();
          newValue = max;
          break;
        default:
          return;
      }
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    const stars = Array.from({ length: max }, (_, i) => i + 1);

    return (
      <div
        ref={ref}
        className={`${containerStyles} ${className}`}
        onMouseLeave={handleLeave}
        onKeyDown={handleKeyDown}
        role="slider"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-readonly={readOnly || disabled}
        aria-disabled={disabled}
        {...props}
      >
        {stars.map((starValue) => {
          const isFilled = displayValue >= starValue;
          const isHalf = allowHalf && displayValue >= starValue - 0.5 && displayValue < starValue;
          const isHovered = hoverValue >= starValue;
          const isHoveredHalf = allowHalf && hoverValue >= starValue - 0.5 && hoverValue < starValue;

          return (
            <button
              key={starValue}
              type="button"
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
              onMouseLeave={handleLeave}
              disabled={disabled || readOnly}
              className={`
                ${starStyles}
                ${sizeStyles[size] || sizeStyles.md}
                p-1
                rounded
                transition-all duration-150
                focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
                ${disabled || readOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
              aria-label={`${starValue} out of ${max} stars`}
              aria-valuenow={starValue}
              aria-valuemin={1}
              aria-valuemax={max}
            >
              {isFilled && !isHalf && (
                <svg className={`${colorStyles.filled} ${sizeStyles[size] || sizeStyles.md}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l4.87-4.72L.53 9.27l6.96-.26L12 .5z" />
                </svg>
              )}
              {isHalf && (
                <svg className={`${colorStyles.filled} ${sizeStyles[size] || sizeStyles.md}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l4.87-4.72L.53 9.27l6.96-.26L12 .5z" clipPath="url(#halfStar)" />
                </svg>
              )}
              {!isFilled && !isHalf && !isHovered && (
                <svg className={`${colorStyles.default} ${sizeStyles[size] || sizeStyles.md}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l4.87-4.72L.53 9.27l6.96-.26L12 .5z" />
                </svg>
              )}
              {(!isFilled && !isHalf) && isHovered && !isHoveredHalf && (
                <svg className={`${colorStyles.filled} ${sizeStyles[size] || sizeStyles.md}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l4.87-4.72L.53 9.27l6.96-.26L12 .5z" />
                </svg>
              )}
              {(!isFilled && !isHalf) && isHoveredHalf && (
                <svg className={`${colorStyles.filled} ${sizeStyles[size] || sizeStyles.md}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l4.87-4.72L.53 9.27l6.96-.26L12 .5z" clipPath="url(#halfStar)" />
                </svg>
              )}
            </button>
          );
        })}
      {showValue && (
        <span className="ml-2 text-sm font-semibold text-neutral-700">
          {value.toFixed(allowHalf ? 1 : 0)}/{max}
        </span>
      )}
      </div>
  );
  }
);

Rating.displayName = 'Rating';

export default Rating;
