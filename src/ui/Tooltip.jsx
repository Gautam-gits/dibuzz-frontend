import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';

/**
 * Tooltip Component
 * Unified tooltip system with positioning, delays, and animations
 */

const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowPositions = {
  top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  left: 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2',
  right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2',
};

const arrowStyles = `
  w-0 h-0 border-4 border-transparent
`;

const arrowColors = {
  top: 'border-t-neutral-900',
  bottom: 'border-b-neutral-900',
  left: 'border-l-neutral-900',
  right: 'border-r-neutral-900',
};

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  hideDelay = 100,
  className = '',
  contentClassName = '',
  disabled = false,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);
  const childRef = useRef(null);
  const tooltipRef = useRef(null);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      hideTooltip();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible]);

  const clonedChild = React.cloneElement(children, {
    ref: childRef,
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
    'aria-describedby': isVisible ? 'tooltip-content' : undefined,
  });

  if (!isVisible || disabled) {
    return clonedChild;
  }

  const tooltipContent = (
    <div
      ref={tooltipRef}
      id="tooltip-content"
      role="tooltip"
      className={`
        absolute z-[9999]
        px-3 py-2
        text-sm font-medium text-white
        bg-neutral-900
        rounded-lg shadow-lg
        whitespace-nowrap
        max-w-xs
        animate-fade-in
        ${position === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-2'}
        ${position === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-2'}
        ${position === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-2'}
        ${position === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-2'}
        ${contentClassName}
      `}
      role="tooltip"
    >
      {content}
      <div
        className={`
          absolute w-0 h-0 border-4 border-transparent
          ${position === 'top' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 border-t-neutral-900'}
          ${position === 'bottom' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 border-b-neutral-900'}
          ${position === 'left' && 'right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-l-neutral-900'}
          ${position === 'right' && 'left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-r-neutral-900'}
        `}
        aria-hidden="true"
      />
    </div>
  );

  return (
    <div className="relative inline-block" ref={childRef}>
      {clonedChild}
      {isVisible && createPortal(tooltipContent, document.body)}
    </div>
  );
}

export default Tooltip;