import React from 'react';
import { designTokens } from './design-tokens';

/**
 * Timeline Component
 * Unified timeline component for progress tracking and history
 */

const containerStyles = `
  relative
`;

const itemStyles = `
  relative
  flex items-start gap-4
  pb-8
  last:pb-0
`;

const lineStyles = `
  absolute left-4 top-0 bottom-0
  w-0.5
  bg-border-light
`;

const dotStyles = `
  relative flex-shrink-0
  w-4 h-4 rounded-full border-3
  flex items-center justify-center
  z-10
`;

const contentStyles = `
  flex-1 min-w-0
  pb-4
`;

const timeStyles = `
  text-xs font-medium text-neutral-500
`;

const titleStyles = `
  font-medium text-neutral-900
`;

const descriptionStyles = `
  mt-1 text-sm text-neutral-600
`;

const metaStyles = `
  mt-2 flex flex-wrap gap-3 text-xs text-neutral-500
`;

const dotVariants = {
  default: 'bg-brand-500 border-white',
  success: 'bg-success-main border-white',
  warning: 'bg-warning-main border-white',
  error: 'bg-error-main border-white',
  info: 'bg-info-main border-white',
  completed: 'bg-success-main border-white',
  current: 'bg-brand-500 border-white ring-4 ring-brand-100',
  upcoming: 'bg-white border-brand-500',
};

const iconVariants = {
  default: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  warning: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  error: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l-2 2m-2 2l-2 2" />
    </svg>
  ),
  info: (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function Timeline({
  items = [],
  variant = 'default', // 'default' | 'alternating' | 'compact'
  showTime = true,
  showIcons = true,
  className = '',
  ...props
}) {
  return (
    <div className={`${containerStyles} ${className}`} {...props}>
      <div className="relative">
        {/* Vertical line */}
        <div className={lineStyles} aria-hidden="true" />

        <div className="space-y-6" role="list" aria-label="Timeline">
          {items.map((item, index) => (
            <div key={item.id || index} className={`${itemStyles} ${item.className}`} role="listitem">
              {/* Dot indicator */}
              <div className={dotStyles}>
                <span
                  className={`
                    w-4 h-4 rounded-full border-3
                    ${dotVariants[item.status || 'default'] || dotVariants.default}
                    ${item.isCurrent ? 'ring-4 ring-brand-100' : ''}
                  `}
                  aria-hidden="true"
                >
                  {showIcons && item.icon && (
                    <span className="flex items-center justify-center w-full h-full">
                      {item.icon}
                    </span>
                  )}
                </span>
              </div>

              {/* Content */}
              <div className={contentStyles}>
                {showTime && item.time && (
                  <time className={timeStyles} dateTime={item.timestamp}>
                    {item.time}
                  </time>
                )}
                <h3 className={titleStyles}>{item.title}</h3>
                {item.description && <p className={descriptionStyles}>{item.description}</p>}
                {item.meta && (
                  <div className={metaStyles}>
                    {item.meta.map((m, i) => (
                      <span key={i}>
                        {m.icon && <span className="mr-1">{m.icon}</span>}
                        {m.label}
                      </span>
                    ))}
                  </div>
                )}
                {item.actions && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.actions.map((action, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={`
                          px-3 py-1.5 text-xs font-medium rounded-lg transition-colors
                          ${action.variant === 'primary'
                            ? 'bg-brand-500 text-white hover:bg-brand-600'
                            : action.variant === 'danger'
                            ? 'bg-error-main text-white hover:bg-error-dark'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }
                        `}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Compact timeline variant
export const CompactTimeline = ({ items = [], className = '', ...props }) => (
  <div className={`${containerStyles} ${className}`} {...props}>
    <div className="relative">
      <div className={lineStyles} aria-hidden="true" />
      <div className="space-y-3" role="list">
        {items.map((item, index) => (
          <div key={item.id || index} className="flex items-center gap-3" role="listitem">
            <span
              className={`
                flex-shrink-0 w-3 h-3 rounded-full border-2
                ${dotVariants[item.status || 'default'] || dotVariants.default}
              `}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{item.title}</p>
              {item.time && <p className="text-xs text-neutral-500">{item.time}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Horizontal timeline variant
export const HorizontalTimeline = ({
  items = [],
  currentStep = 0,
  className = '',
  ...props
}) => (
  <div className={`overflow-x-auto ${className}`} {...props}>
    <div className="flex items-center min-w-max">
      {items.map((item, index) => (
        <React.Fragment key={item.id || index}>
          <div className="flex flex-col items-center">
            <div className={`
              relative flex items-center justify-center
              w-12 h-12 rounded-full border-3
              ${index < currentStep ? 'bg-success-main border-success-main text-white' :
                index === currentStep ? 'bg-brand-500 border-brand-500 text-white ring-4 ring-brand-100' :
                'bg-white border-neutral-300 text-neutral-400'
              }
            `}>
              {index + 1}
            </div>
            <span className="mt-2 text-xs font-medium text-neutral-700 text-center max-w-[80px]">{item.label}</span>
          </div>
          {index < items.length - 1 && (
            <div className={`
              flex-1 h-1 mx-2
              ${index < currentStep ? 'bg-success-main' : 'bg-neutral-200'}
            `} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

export default Timeline;
