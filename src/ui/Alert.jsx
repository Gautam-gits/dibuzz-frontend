import React from 'react';
import { designTokens } from './design-tokens';
import { Button } from './Button';

/**
 * Alert Component
 * Unified alert/notification banner component
 */

const containerStyles = `
  flex items-start gap-3
  p-4
  rounded-xl
  border
`;

const iconStyles = `
  flex-shrink-0
  w-5 h-5
  mt-0.5
`;

const contentStyles = `
  flex-1 min-w-0
`;

const titleStyles = `
  font-semibold text-neutral-900
`;

const descriptionStyles = `
  mt-1 text-sm text-neutral-600
`;

const actionStyles = `
  mt-3 flex flex-wrap gap-2
`;

const dismissStyles = `
  flex-shrink-0 p-1
  text-neutral-400 hover:text-neutral-600
  rounded-lg hover:bg-neutral-100
  transition-colors duration-150
`;

const variantStyles = {
  success: 'bg-success-light border-success-main text-success-main',
  error: 'bg-error-light border-error-main text-error-main',
  warning: 'bg-warning-light border-warning-main text-warning-main',
  info: 'bg-info-light border-info-main text-info-main',
  default: 'bg-neutral-100 border-neutral-300 text-neutral-800',
};

const iconVariants = {
  success: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l-2 2m-2 2l-2 2" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export function Alert({
  variant = 'info',
  title,
  description,
  children,
  action,
  dismissible = false,
  onDismiss,
  className = '',
  role = 'alert',
  ...props
}) {
  const variantStyle = variantStyles[variant] || variantStyles.info;
  const icon = variant === 'success' ? (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : variant === 'error' ? (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l-2 2m-2 2l-2 2" />
    </svg>
  ) : variant === 'warning' ? (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ) : (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div
      className={`${containerStyles} ${variantStyles[variant] || variantStyles.info} ${className}`}
      role={role}
      {...props}
    >
      <div className={iconStyles} aria-hidden="true">
        {variant === 'success' ? (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ) : variant === 'error' ? (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-2 2l2 2m-2 2l2 2m-2 2l-2 2m-2 2l-2 2" />
          </svg>
        ) : variant === 'warning' ? (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )}
      </div>

      <div className={contentStyles}>
        {title && <h4 className={titleStyles}>{title}</h4>}
        {description && <p className={descriptionStyles}>{description}</p>}
        {children && <div className="mt-2">{children}</div>}
        {action && (
          <div className={actionStyles}>
            <Button variant="primary" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
            {action.secondaryLabel && (
              <Button variant="ghost" size="sm" onClick={action.onSecondaryClick}>
                {action.secondaryLabel}
              </Button>
            )}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          onClick={onDismiss}
          className={dismissStyles}
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default Alert;