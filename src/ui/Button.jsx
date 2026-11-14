import React from 'react';
import { designTokens } from './design-tokens';

/**
 * Button Component
 * Unified button system with variants, sizes, and states
 */

const baseStyles = `
  inline-flex items-center justify-center gap-2
  font-semibold transition-all duration-200
  rounded-control
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
  whitespace-nowrap
`;

const variantStyles = {
  primary: `
    bg-brand-500 text-white
    hover:bg-brand-600 active:bg-brand-700
    shadow-sm hover:shadow-md
  `,
  secondary: `
    bg-neutral-100 text-brand-700 border border-brand-200
    hover:bg-brand-50 active:bg-brand-100
  `,
  outline: `
    bg-transparent text-brand-600 border-2 border-brand-500
    hover:bg-brand-50 active:bg-brand-100
  `,
  ghost: `
    bg-transparent text-brand-600
    hover:bg-brand-50 active:bg-brand-100
  `,
  danger: `
    bg-error-main text-white
    hover:bg-error-dark active:bg-error-dark
    shadow-sm hover:shadow-md
  `,
  success: `
    bg-success-main text-white
    hover:bg-success-dark active:bg-success-dark
    shadow-sm hover:shadow-md
  `,
  neutral: `
    bg-neutral-100 text-neutral-700 border border-neutral-300
    hover:bg-neutral-200 active:bg-neutral-300
  `,
};

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
  xl: 'px-8 py-4 text-lg gap-3',
};

const widthStyles = {
  full: 'w-full',
  auto: 'w-auto',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  width = 'auto',
  as: Component = 'button',
  className = '',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  ...props
}) {
  const isLoading = loading || disabled;

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      onClick={onClick}
      disabled={isLoading}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.primary}
        ${sizeStyles[size] || sizeStyles.md}
        ${widthStyles[width] || widthStyles.auto}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="flex-shrink-0" aria-hidden="true">{leftIcon}</span>
      ) : null}

      <span className="truncate">{children}</span>

      {rightIcon && !loading && (
        <span className="flex-shrink-0" aria-hidden="true">{rightIcon}</span>
      )}
    </Component>
  );
}

// Convenience components
export const PrimaryButton = ({ children, ...props }) => (
  <Button variant="primary" {...props}>{children}</Button>
);

export const SecondaryButton = ({ children, ...props }) => (
  <Button variant="secondary" {...props}>{children}</Button>
);

export const OutlineButton = ({ children, ...props }) => (
  <Button variant="outline" {...props}>{children}</Button>
);

export const GhostButton = ({ children, ...props }) => (
  <Button variant="ghost" {...props}>{children}</Button>
);

export const DangerButton = ({ children, ...props }) => (
  <Button variant="danger" {...props}>{children}</Button>
);

export const SuccessButton = ({ children, ...props }) => (
  <Button variant="success" {...props}>{children}</Button>
);

export default Button;