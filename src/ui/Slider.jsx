import React, { useState, useRef, useEffect } from 'react';
import { designTokens } from './design-tokens';

/**
 * Slider Component
 * Unified slider/range input component
 */

const containerStyles = `
  relative
  w-full
`;

const labelStyles = `
  block text-sm font-medium text-neutral-700 mb-1.5
`;

const valueStyles = `
  text-sm font-semibold text-brand-600
`;

const sliderWrapperStyles = `
  relative
  h-2
`;

const trackStyles = `
  absolute inset-0
  bg-neutral-200
  rounded-full
`;

const rangeStyles = `
  absolute top-0 h-full
  bg-brand-500
  rounded-full
  transition-all duration-150 ease-out
`;

const thumbStyles = `
  absolute top-1/2 -translate-y-1/2
  w-5 h-5
  bg-white
  rounded-full
  border-2 border-brand-500
  shadow-md
  cursor-pointer
  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
  transition-all duration-150
  z-10
`;

const markStyles = `
  absolute bottom-full mb-1
  text-xs text-neutral-400
  transform -translate-x-1/2
  whitespace-nowrap
`;

const labelContainerStyles = `
  flex justify-between
  mt-2
  text-xs text-neutral-500
`;

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  disabled = false,
  showValue = true,
  showLabels = false,
  marks,
  className = '',
  'aria-label': ariaLabel,
  'aria-valuetext': ariaValueText,
  ...props
}) {
  const [focused, setFocused] = useState(false);
  const sliderRef = useRef(null);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleMouseDown = (e) => {
    if (disabled) return;
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = Math.round(min + percentage * (max - min));
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));
    onChange?.(clampedValue);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleKeyDown = (e) => {
    let newValue = value;
    const stepValue = step || 1;

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newValue = Math.min(max, value + stepValue);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newValue = Math.min(max, value - stepValue);
        break;
      case 'Home':
        e.preventDefault();
        newValue = min;
        break;
      case 'End':
        e.preventDefault();
        newValue = max;
        break;
      case 'PageUp':
        e.preventDefault();
        newValue = Math.min(max, value + stepValue * 10);
        break;
      case 'PageDown':
        e.preventDefault();
        newValue = Math.max(min, value - stepValue * 10);
        break;
      default:
        return;
    }
    onChange?.(newValue);
  };

  return (
    <div className={className} {...props}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && <label className="block text-sm font-medium text-neutral-700">{label}</label>}
          {showValue && (
            <span className="text-sm font-semibold text-brand-600" aria-live="polite">
              {value}
            </span>
          )}
        </div>
      )}

      <div className="relative" ref={sliderRef}>
        <div
          className="relative h-2"
          onMouseDown={handleMouseDown}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? undefined : 0}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={ariaLabel}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-orientation="horizontal"
          role="slider"
          aria-valuetext={ariaValueText}
          disabled={disabled}
        >
          {/* Track */}
          <div className={trackStyles} />

          {/* Range */}
          <div
            className={rangeStyles}
            style={{ width: `${((value - min) / (max - min)) * 100}%` }}
          />

          {/* Thumb */}
          <div
            className={`
              ${thumbStyles}
              ${focused ? 'ring-2 ring-brand-500 ring-offset-2' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={{ left: `calc(${percentage}% - 10px)` }}
            aria-hidden="true"
          />
        </div>

        {/* Marks */}
        {marks && marks.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-2 flex justify-between">
            {marks.map((mark, index) => (
              <span
                key={mark.value}
                className={markStyles}
                style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
              >
                {mark.label || mark.value}
              </span>
            ))}
          </div>
        )}

        {/* Labels */}
        {showLabels && marks && marks.length > 0 && (
          <div className={labelContainerStyles}>
            {marks.map((mark, index) => (
              <span
                key={mark.value}
                style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-xs text-neutral-500"
              >
                {mark.label || mark.value}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Range Slider (dual thumb)
export function RangeSlider({
  label,
  min = 0,
  max = 100,
  step = 1,
  value = [0, 100],
  onChange,
  disabled = false,
  showValue = true,
  marks,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const sliderRef = useRef(null);

  const [minVal, maxVal] = value;
  const minPercentage = ((value[0] - min) / (max - min)) * 100;
  const maxPercentage = ((value[1] - min) / (max - min)) * 100;

  const handleMouseDown = (index, e) => {
    if (disabled) return;
    e.preventDefault();
    setFocusedIndex(index);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newValue = Math.round(min + percentage * (max - min));
    const steppedValue = Math.round(newValue / step) * step;
    const clampedValue = Math.max(min, Math.min(max, steppedValue));

    const newValues = [...value];
    newValues[focusedIndex] = clampedValue;
    newValues.sort((a, b) => a - b);
    onChange?.(newValues);
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e, index) => {
    let newValues = [...value];
    const stepValue = step || 1;
    let newVal = value[index];

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault();
        newVal = Math.min(max, value[index] + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault();
        newVal = Math.min(max, value[index] - stepValue);
        break;
      case 'Home':
        e.preventDefault();
        newVal = min;
        break;
      case 'End':
        e.preventDefault();
        newVal = max;
        break;
      default:
        return;
    }
    newValues[index] = newVal;
    newValues.sort((a, b) => a - b);
    onChange?.(newValues);
  };

  return (
    <div className={className} {...props}>
      <div className="relative" ref={sliderRef}>
        <div
          className="relative h-2"
          onMouseDown={(e) => {
            if (disabled) return;
            e.preventDefault();
            // Determine which thumb is closer
            const rect = sliderRef.current.getBoundingClientRect();
            const percentage = (e.clientX - rect.left) / rect.width;
            const clickValue = min + percentage * (max - min);
            const dist0 = Math.abs(value[0] - clickValue);
            const dist1 = Math.abs(value[1] - clickValue);
            setFocusedIndex(dist0 < dist1 ? 0 : 1);
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
          }}
          onKeyDown={(e) => handleKeyDown(e, focusedIndex)}
          tabIndex={disabled ? undefined : 0}
          onFocus={() => setFocusedIndex(0)}
          onBlur={() => setFocusedIndex(-1)}
          aria-label={ariaLabel}
          role="slider"
          aria-orientation="horizontal"
          disabled={disabled}
        >
          {/* Track */}
          <div className="absolute inset-0 bg-neutral-200 rounded-full" />

          {/* Range between thumbs */}
          <div
            className="absolute top-0 h-full bg-brand-500 rounded-full"
            style={{ left: `${minPercentage}%`, width: `${maxPercentage - minPercentage}%` }}
          />

          {/* Min Thumb */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2
              w-5 h-5 bg-white rounded-full border-2 border-brand-500 shadow-md
              cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
              z-10 ${focusedIndex === 0 ? 'ring-2 ring-brand-500 ring-offset-2' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={{ left: `calc(${minPercentage}% - 10px)` }}
            onMouseDown={(e) => handleMouseDown(0, e)}
            aria-hidden="true"
          />

          {/* Max Thumb */}
          <div
            className={`
              absolute top-1/2 -translate-y-1/2
              w-5 h-5 bg-white rounded-full border-2 border-brand-500 shadow-md
              cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
              z-10 ${focusedIndex === 1 ? 'ring-2 ring-brand-500 ring-offset-2' : ''}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            style={{ left: `calc(${maxPercentage}% - 10px)` }}
            onMouseDown={(e) => handleMouseDown(1, e)}
            aria-hidden="true"
          />
        </div>

        {marks && marks.length > 0 && (
          <div className="absolute bottom-full left-0 right-0 mb-2 flex justify-between">
            {marks.map((mark, index) => (
              <span
                key={mark.value}
                className="absolute bottom-full mb-1 text-xs text-neutral-400 transform -translate-x-1/2 whitespace-nowrap"
                style={{ left: `${((mark.value - min) / (max - min)) * 100}%` }}
              >
                {mark.label || mark.value}
              </span>
            ))}
          </div>
        )}
      </div>

      {showValue && (
        <div className="flex justify-between mt-2 text-sm font-medium text-brand-600">
          <span>{value[0]}</span>
          <span>{value[1]}</span>
        </div>
      )}
    </div>
  );
}

export default Slider;