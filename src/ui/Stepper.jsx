import React from 'react';
import { designTokens } from './design-tokens';

/**
 * Stepper Component
 * Unified step-by-step progress indicator
 */

const containerStyles = `
  flex
`;

const stepStyles = `
  relative flex-1 flex flex-col items-center
`;

const circleStyles = `
  flex items-center justify-center
  w-10 h-10 rounded-full border-3
  font-semibold text-sm
  transition-all duration-300
`;

const lineStyles = `
  absolute top-5 left-1/2 right-1/2
  h-1.5
  transition-all duration-300
`;

const labelStyles = `
  mt-3 text-center text-sm font-medium text-neutral-700
  max-w-[100px]
`;

const descriptionStyles = `
  text-center text-xs text-neutral-500 mt-1
  max-w-[100px]
`;

const completedCircleStyles = `
  bg-brand-500 border-brand-500 text-white
`;

const activeCircleStyles = `
  bg-white border-brand-500 text-brand-500 ring-4 ring-brand-100
`;

const upcomingCircleStyles = `
  bg-white border-neutral-300 text-neutral-400
`;

const completedLineStyles = `
  bg-brand-500
`;

const upcomingLineStyles = `
  bg-neutral-200
`;

export function Stepper({
  steps = [],
  currentStep = 0,
  variant = 'default', // 'default' | 'vertical' | 'horizontal'
  className = '',
  showNumbers = true,
  showLabels = true,
  showDescriptions = false,
  ...props
}) {
  const isCompleted = (index) => index < currentStep;
  const isActive = (index) => index === currentStep;
  const isUpcoming = (index) => index > currentStep;

  const circleClass = (index) => {
    if (isCompleted(index)) return completedCircleStyles;
    if (isActive(index)) return activeCircleStyles;
    return upcomingCircleStyles;
  };

  const lineClass = (index) => {
    return isCompleted(index) ? completedLineStyles : upcomingLineStyles;
  };

  if (variant === 'vertical') {
    return (
      <div className={`space-y-6 ${className}`} {...props}>
        {steps.map((step, index) => (
          <div key={step.id || index} className="flex items-start gap-4">
            <div className={`flex-shrink-0 flex flex-col items-center ${circleClass(index)}`}>
              {showNumbers ? index + 1 : (
                step.icon || (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                )
              )}
            </div>
            <div className="flex-1 ml-4">
              {showLabels && <h3 className="font-semibold text-neutral-900">{step.label}</h3>}
              {showDescriptions && step.description && <p className="text-sm text-neutral-500 mt-1">{step.description}</p>}
            </div>
          </div>
        ))}
        </div>
      );
  }

  return (
    <div className={`${containerStyles} ${className}`} {...props}>
      <div className="relative">
        {/* Connecting line */}
        <div className={lineStyles}>
          <div className={lineClass(currentStep - 1)} style={{ width: `${(currentStep / Math.max(steps.length - 1, 1)) * 100}%` }} />
        </div>

        <div className="flex justify-between">
          {steps.map((step, index) => (
            <div key={step.id || index} className={stepStyles}>
              <div className={`relative flex items-center justify-center ${circleClass(index)}`}>
                {showNumbers ? index + 1 : (
                  step.icon || (isCompleted(index) && (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ))
                )}
              </div>

              {showLabels && (
                <div className="mt-3">
                  <div className={labelStyles}>{step.label}</div>
                  {showDescriptions && step.description && <p className={descriptionStyles}>{step.description}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Stepper;
