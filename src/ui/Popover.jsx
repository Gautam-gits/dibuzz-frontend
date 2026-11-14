import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';

/**
 * Popover Component
 * Floating content anchored to a trigger element
 */

const positions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};

const arrowStyles = `
  absolute w-0 h-0 border-6 border-transparent
`;

const arrowColors = {
  top: 'border-t-white',
  bottom: 'border-b-white',
  left: 'border-l-white',
  right: 'border-r-white',
};

const contentStyles = `
  absolute z-[9999]
  min-w-[200px] max-w-md
  bg-white rounded-lg shadow-lg border border-border-light
  overflow-hidden
  animate-fade-in
`;

const headerStyles = `
  px-4 py-3 border-b border-border-light
  font-semibold text-neutral-900
`;

const bodyStyles = `
  p-4
`;

const footerStyles = `
  px-4 py-3 border-t border-border-light bg-neutral-50
  flex items-center justify-end gap-2
`;

export function Popover({
  content,
  children,
  position = 'bottom',
  align = 'center', // 'start' | 'center' | 'end'
  trigger = 'click', // 'click' | 'hover' | 'focus'
  className = '',
  contentClassName = '',
  disabled = false,
  closeOnClickOutside = true,
  closeOnEscape = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        if (popoverRef.current && !popoverRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  const triggerProps = {
    ref: triggerRef,
    onClick: (e) => {
      if (!disabled && trigger === 'click') {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }
      children.props?.onClick?.(e);
    },
    onMouseEnter: () => {
      if (!disabled && trigger === 'hover') setIsOpen(true);
      children.props?.onMouseEnter?.();
    },
    onMouseLeave: () => {
      if (trigger === 'hover') setIsOpen(false);
      children.props?.onMouseLeave?.();
    },
    onFocus: () => {
      if (!disabled && trigger === 'focus') setIsOpen(true);
      children.props?.onFocus?.();
    },
    onBlur: () => {
      if (trigger === 'focus') setIsOpen(false);
      children.props?.onBlur?.();
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': isOpen,
    'aria-controls': 'popover-content',
  };

  const clonedChild = React.cloneElement(children, triggerProps);

  if (!isOpen || disabled) {
    return clonedChild;
  }

  const alignStyles = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0',
  };

  const popoverContent = (
    <div
      ref={popoverRef}
      id="popover-content"
      role="dialog"
      className={`
        ${contentStyles}
        ${positions[position] || positions.bottom}
        ${alignStyles[align] || alignStyles.center}
        ${contentClassName}
      `}
      role="dialog"
      aria-describedby="popover-content"
    >
      <div className={`
        ${headerStyles}
        ${className}
      `}>
        {content}
      </div>
    </div>
  );

  return (
    <div className="relative inline-block" ref={triggerRef}>
      {clonedChild}
      {isOpen && createPortal(popoverContent, document.body)}
    </div>
  );
}

export default Popover;