import React from 'react';
import { designTokens } from './design-tokens';

/**
 * Card Component
 * Unified card system with variants and consistent styling
 */

const baseStyles = `
  rounded-card
  transition-shadow duration-200
`;

const variantStyles = {
  default: `
    bg-white border border-border-light shadow-sm
    hover:shadow-md
  `,
  outlined: `
    bg-white border-2 border-border-medium
  `,
  elevated: `
    bg-white border-none shadow-lg
    hover:shadow-xl
  `,
  filled: `
    bg-neutral-50 border-none
  `,
  glass: `
    bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg
  `,
};

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-6',
  xl: 'p-8',
};

const interactiveStyles = `
  cursor-pointer
  transition-all duration-200
  hover:shadow-md hover:-translate-y-0.5
`;

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  interactive = false,
  onClick,
  href,
  as: component = 'div',
  ...props
}) {
  const isLink = !!href;
  const Component = isLink ? 'a' : onClick ? 'button' : component || 'div';

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variantStyles[variant] || variantStyles.default}
        ${paddingStyles[padding] || paddingStyles.md}
        ${interactive && !isLink ? interactiveStyles : ''}
        ${className}
      `}
      {...(isLink ? { href } : onClick ? { onClick, type: 'button' } : {})}
      {...props}
    >
      {children}
    </Component>
  );
}

// Specialized card variants
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`px-5 py-4 border-b border-border-light ${className}`} {...props}>
    {children}
  </div>
);

export const CardBody = ({ children, className = '', ...props }) => (
  <div className={`p-5 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`px-5 py-4 border-t border-border-light bg-neutral-50 rounded-b-card ${className}`} {...props}>
    {children}
  </div>
);

// Specialized card types
export const StatCard = ({ label, value, change, trend = 'neutral', icon, className = '' }) => (
  <Card variant="default" padding="md" className={className}>
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{label}</p>
        <p className="mt-1 text-2xl sm:text-3xl font-bold font-mono text-neutral-900 truncate">{value}</p>
        {change && (
          <p className={`mt-2 text-sm font-medium flex items-center gap-1 ${
            trend === 'up' ? 'text-success-main' :
            trend === 'down' ? 'text-error-main' :
            'text-neutral-500'
          }`}>
            {trend === 'up' && <span>▲</span>}
            {trend === 'down' && <span>▼</span>}
            {change}
          </p>
        )}
      </div>
      {icon && (
        <div className="flex-shrink-0 p-3 rounded-xl bg-brand-50 text-brand-600">
          {icon}
        </div>
      )}
    </div>
  </Card>
);

export const InfoCard = ({ title, description, icon, action, className = '' }) => (
  <Card variant="outlined" padding="md" className={className}>
    <div className="flex items-start gap-4">
      {icon && (
        <div className="flex-shrink-0 p-3 rounded-xl bg-brand-50 text-brand-600">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-neutral-900">{title}</h3>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
        {action && <div className="mt-3">{action}</div>}
      </div>
    </div>
  </Card>
);

export default Card;
