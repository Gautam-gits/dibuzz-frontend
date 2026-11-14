import React from 'react';
import { designTokens } from './design-tokens';

/**
 * Progress Component
 * Unified progress indicators with variants and labels
 */

const baseStyles = `
  w-full
  bg-neutral-200
  rounded-full
  overflow-hidden
`;

const sizeStyles = {
  xs: 'h-1',
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
  xl: 'h-6',
};

const variantStyles = {
  default: 'bg-brand-500',
  success: 'bg-success-main',
  warning: 'bg-warning-main',
  error: 'bg-error-main',
  info: 'bg-info-main',
  neutral: 'bg-neutral-500',
};

const labelStyles = `
  flex items-center justify-between
  mb-1.5
  text-sm font-medium text-neutral-700
`;

const valueStyles = `
  text-sm font-semibold text-neutral-900
`;

const barContainerStyles = `
  relative
`;

const barStyles = `
  h-full
  rounded-full
  transition-all duration-300 ease-out
`;

const stripedStyles = `
  bg-gradient-to-r
  from-transparent via-white/20 to-transparent
  bg-[length:200%_100%]
  animate-progress-stripe
`;

const labelPositionStyles = {
  top: 'mb-1.5',
  bottom: 'mt-1.5',
  none: '',
};

export function Progress({
  value = 0,
  max = 100,
  min = 0,
  label,
  showValue = true,
  valuePosition = 'right', // 'left' | 'right' | 'none'
  labelPosition = 'top', // 'top' | 'bottom' | 'none'
  size = 'md',
  variant = 'default',
  showLabel = true,
  striped = false,
  animated = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-valuetext': ariaValueText,
  ...props
}) {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);

  return (
    <div className={className} {...props}>
      {(showLabel && label) && (
        <div className={`
          flex items-center justify-between
          ${labelPositionStyles[labelPosition] || labelPositionStyles.top}
        `}>
          {showLabel && <span className="text-sm font-medium text-neutral-700">{label}</span>}
          {showValue && valuePosition !== 'none' && (
            <span className={valueStyles}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div className={`${barContainerStyles} ${sizeStyles[size] || sizeStyles.md}`} role="progressbar" aria-valuenow={Math.round(percentage)} aria-valuemin={min} aria-valuemax={max} aria-label={ariaLabel} aria-valuetext={ariaValueText}>
        <div
          className={`
            ${barStyles}
            ${variantStyles[variant] || variantStyles.default}
            ${striped && stripedStyles}
            ${animated && 'animate-progress-stripe'}
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={Math.round(percentage)}
          aria-valuemin={min}
          aria-valuemax={max}
        />
      </div>

      {(showLabel && label && labelPosition === 'bottom') && (
        <p className="mt-1.5 text-sm font-medium text-neutral-700">{label}</p>
      )}
    </div>
  );
}

// Circular Progress
export function CircularProgress({
  value = 0,
  max = 100,
  min = 0,
  size = 'md',
  strokeWidth = 4,
  variant = 'default',
  showValue = true,
  label,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const sizeStyles = {
    xs: 32,
    sm: 48,
    md: 64,
    lg: 80,
    xl: 100,
  };

  const diameter = sizeStyles[size] || sizeStyles.md;
  const radiusCalc = (diameter - strokeWidth) / 2;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} {...props}>
      <svg width={diameter} height={diameter} className="transform -rotate-90" role="img" aria-label={ariaLabel || `${Math.round(percentage)}% complete`}>
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radiusCalc}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-200"
        />
        <circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radiusCalc}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          className={`
            transform -rotate-90 transition-all duration-500 ease-out
            ${variantStyles[variant] || variantStyles.default}
          `}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: offset,
          }}
        />
        {(showValue || label) && (
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            className="text-center"
            style={{ fontSize: diameter / 5 }}
          >
            {showValue ? `${Math.round(percentage)}%` : label}
          </text>
        )}
      </svg>
      {label && <p className="mt-2 text-sm font-medium text-neutral-700 text-center">{label}</p>}
    </div>
  );
}

// Step Progress (for multi-step flows)
export function StepProgress({
  steps = [],
  currentStep = 0,
  variant = 'default',
  size = 'md',
  className = '',
  showLabels = true,
  showNumbers = true,
  ...props
}) {
  const sizeStyles = {
    sm: { circle: 24, line: 2, font: 'text-xs' },
    md: { circle: 32, line: 3, font: 'text-sm' },
    lg: { circle: 40, line: 4, font: 'text-base' },
  };

  const { circle, line, font } = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={`relative ${className}`} {...props}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id || index}>
            <div className="relative flex flex-col items-center">
              <div className={`
                relative flex items-center justify-center
                rounded-full border-2
                text-white font-semibold ${font}
                ${index <= currentStep
                  ? `bg-${variant}-500 border-${variant}-500`
                  : 'bg-neutral-100 border-neutral-300 text-neutral-400'
                }
                w-${circle} h-${circle}
                transition-all duration-300
              `}>
                {showNumbers && index < currentStep ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : showNumbers ? (
                  <span>{index + 1}</span>
                ) : null}
              </div>
              {showLabels && step.label && (
                <p className={`mt-2 text-center ${font} text-neutral-600 max-w-[100px]`}>
                  {step.label}
                </p>
              )}
            </div>
            {index < steps.length - 1 && (
              <div className={`
                flex-1 h-${line}
                ${index < currentStep
                  ? `bg-${variant}-500`
                  : 'bg-neutral-200'
                }
                transition-all duration-300
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Progress;