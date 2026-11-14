import React from 'react';
import { designTokens } from './design-tokens';

/**
 * Spinner Component
 * Unified loading indicators with sizes and variants
 */

const sizeStyles = {
  xs: 'h-3 w-3 border-[2px]',
  sm: 'h-4 w-4 border-[2px]',
  md: 'h-6 w-6 border-[2.5px]',
  lg: 'h-8 w-8 border-[3px]',
  xl: 'h-12 w-12 border-[4px]',
};

const variantStyles = {
  default: 'border-brand-500 border-t-transparent',
  light: 'border-brand-500/30 border-t-brand-500',
  white: 'border-white/30 border-t-white',
  inverse: 'border-neutral-900 border-t-transparent',
};

export function Spinner({
  size = 'md',
  variant = 'default',
  className = '',
  ariaLabel = 'Loading',
  ...props
}) {
  return (
    <span
      className={`
        inline-block
        rounded-full
        animate-spin
        ${sizeStyles[size] || sizeStyles.md}
        ${variantStyles[variant] || variantStyles.default}
        ${className}
      `}
      role="status"
      aria-label={ariaLabel}
      {...props}
    >
      <span className="sr-only">{ariaLabel}</span>
    </span>
  );
}

export const SpinnerOverlay = ({
  isVisible,
  message = 'Loading...',
  size = 'lg',
  variant = 'default',
  className = '',
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-neutral-900/60 backdrop-blur-sm
        ${className}
      `}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4 bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
        <Spinner size={size} variant={variant} />
        {message && <p className="text-sm font-medium text-neutral-600 text-center">{message}</p>}
      </div>
    </div>
  );
}

export const SpinnerButton = ({
  isLoading,
  children,
  loadingText = 'Loading...',
  ...props
}) => {
  return (
    <button
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Spinner size="sm" variant="white" className="mr-2" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

export const Skeleton = ({
  variant = 'text', // 'text' | 'circular' | 'rectangular' | 'card'
  width = '100%',
  height,
  className = '',
  count = 1,
} = {}) => {
  const baseSkeleton = (
    <div
      className={`
        animate-pulse
        bg-neutral-200
        rounded
        ${className}
      `}
      style={{ width, height }}
    />
  );

  const variants = {
    text: (
      <div className="space-y-3" style={{ width }}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="h-4 bg-neutral-200 rounded" style={{ width: i === count - 1 ? '60%' : '100%' }} />
        ))}
      </div>
    ),
    circular: (
      <div className="animate-pulse bg-neutral-200 rounded-full" style={{ width, height: width }} />
    ),
    rectangular: (
      <div className="animate-pulse bg-neutral-200 rounded-lg" style={{ width, height: height || '1rem' }} />
    ),
    card: (
      <div className="space-y-4 p-5 animate-pulse" style={{ width }}>
        <div className="h-6 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-5/6" />
        <div className="mt-4 h-8 bg-neutral-200 rounded w-1/3" />
      </div>
    ),
  };

  return variants[variant] || variants.text;
};

export default Spinner;
