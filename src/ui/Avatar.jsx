import React from 'react';
import { designTokens } from './design-tokens';

/**
 * Avatar Component
 * Unified avatar system with fallbacks, sizes, and status indicators
 */

const sizeStyles = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-sm',
  md: 'h-10 w-10 text-base',
  lg: 'h-12 w-12 text-lg',
  xl: 'h-16 w-16 text-xl',
  '2xl': 'h-24 w-24 text-2xl',
};

const statusSizeStyles = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-4 h-4',
};

const statusPositionStyles = {
  bottomRight: 'bottom-0 right-0',
  bottomLeft: 'bottom-0 left-0',
  topRight: 'top-0 right-0',
  topLeft: 'top-0 left-0',
};

const statusColorStyles = {
  online: 'bg-success-main',
  offline: 'bg-neutral-400',
  busy: 'bg-warning-main',
  away: 'bg-warning-main',
  error: 'bg-error-main',
};

export function Avatar({
  src,
  alt,
  name,
  size = 'md',
  shape = 'circle', // 'circle' | 'square'
  status,
  statusPosition = 'bottomRight',
  className = '',
  ...props
}) {
  const shapeClass = shape === 'square' ? 'rounded-xl' : 'rounded-full';
  const sizeClass = sizeStyles[size] || sizeStyles.md;
  const shapeRadius = shape === 'square' ? 'rounded-xl' : 'rounded-full';

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = name ? getInitials(name) : '?';
  const bgColorClass = `bg-brand-500`; // Could be enhanced with hash-based colors

  return (
    <div className={`relative inline-flex ${className}`} {...props}>
      <div className={`${shapeRadius} ${sizeClass} overflow-hidden bg-brand-500 flex items-center justify-center`}>
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className={`${shapeRadius} ${sizeClass} w-full h-full object-cover`}
          />
        ) : (
          <span className={`${sizeClass} font-semibold text-white select-none`}>
            {initials}
          </span>
        )}
      </div>

      {status && (
        <span
          className={`
            absolute
            ${statusSizeStyles[size] || sizeStyles.md}
            rounded-full border-2 border-white
            ${statusColorStyles[status] || statusColorStyles.online}
            ${statusPositionStyles[statusPosition] || statusPositionStyles.bottomRight}
            -translate-x-1/2 -translate-y-1/2
          `}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
}

export const AvatarGroup = ({
  avatars = [],
  max = 5,
  size = 'md',
  className = '',
  ...props
}) => {
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={`flex -space-x-2 ${className}`} {...props}>
      {avatars.map((avatar, index) => (
        <Avatar
          key={avatar.id || index}
          {...avatar}
          size={size}
          className={index > 0 ? '-ml-2' : ''}
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={`
            ${sizeStyles[size] || sizeStyles.md}
            rounded-full
            bg-neutral-200
            border-2 border-white
            flex items-center justify-center
            text-xs font-semibold text-neutral-600
            -ml-2
          `}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default Avatar;