import React from 'react';
import { designTokens } from './design-tokens';

/**
 * Badge Component
 * Unified badge system for status, labels, and counts
 */

const baseStyles = `
  inline-flex items-center justify-center
  font-semibold
  rounded-full
  transition-colors duration-200
  whitespace-nowrap
`;

const variantStyles = {
  // Semantic variants
  default: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
  primary: 'bg-brand-50 text-brand-700 border border-brand-200',
  success: 'bg-success-light text-success-main border border-success-light',
  warning: 'bg-warning-light text-warning-main border border-warning-light',
  error: 'bg-error-light text-error-main border border-error-light',
  info: 'bg-info-light text-info-main border border-info-light',

  // Tone variants (for backward compatibility)
  brand: 'bg-brand-50 text-brand-700 border border-brand-200',
  ok: 'bg-success-light text-success-main border border-success-light',
  warn: 'bg-warning-light text-warning-main border border-warning-light',
  bad: 'bg-error-light text-error-main border border-error-light',

  // Neutral
  neutral: 'bg-neutral-100 text-neutral-700 border border-neutral-200',
  outline: 'bg-transparent border-2 border-neutral-400 text-neutral-600',
};

const sizeStyles = {
  xs: 'px-1.5 py-0.5 text-[10px] gap-1',
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-base gap-2',
};

const dotStyles = `
  w-1.5 h-1.5 rounded-full flex-shrink-0
`;

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
  dotColor,
  removable = false,
  onRemove,
  href,
  ...props
}) {
  const isLink = !!href;
  const Component = isLink ? 'a' : 'span';

  const variantStyle = variantStyles[variant] || variantStyles.default;

  return (
    <Component
      href={href}
      className={`
        ${baseStyles}
        ${variantStyle}
        ${sizeStyles[size] || sizeStyles.md}
        ${className}
      `}
      {...props}
    >
      {(dot || dotColor) && (
        <span
          className={`
            ${dotStyles}
            ${dotColor ? `bg-[${dotColor}]` : 'bg-current opacity-70'}
          `}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{children}</span>
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove?.();
          }}
          className="ml-1.5 p-0.5 rounded hover:bg-black/10 transition-colors"
          aria-label="Remove"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </Component>
  );
}

// Specialized badge types
export const StatusBadge = ({ status, className = '', ...props }) => {
  const statusVariants = {
    // Application statuses
    applied: 'info',
    pending: 'warning',
    accepted: 'success',
    rejected: 'error',
    enrolled: 'success',
    completed: 'success',
    cancelled: 'neutral',
    // Certificate statuses
    issued: 'success',
    revoked: 'error',
    pending_review: 'warning',
    // Payment statuses
    paid: 'success',
    pending_payment: 'warning',
    failed: 'error',
    refunded: 'neutral',
    // Generic
    active: 'success',
    inactive: 'neutral',
    pending: 'warning',
    draft: 'neutral',
    published: 'success',
    archived: 'neutral',
  };

  const variant = statusVariants[status] || 'default';
  const label = status?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown';

  return (
    <Badge variant={variant} className={className} {...props}>
      {label}
    </Badge>
  );
};

export const CountBadge = ({ count, max = 99, className = '', ...props }) => {
  const displayCount = count > max ? `${max}+` : count;
  return (
    <Badge variant="primary" size="xs" className={className} {...props}>
      {displayCount}
    </Badge>
  );
};

export const DotBadge = ({ color = 'brand', label, className = '', ...props }) => (
  <Badge variant="default" size="sm" dot dotColor={color} className={className} {...props}>
    {label}
  </Badge>
);

export default Badge;
