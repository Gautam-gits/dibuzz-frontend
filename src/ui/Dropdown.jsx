import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';
import { Button } from './Button';

/**
 * Dropdown Component
 * Unified dropdown menu with keyboard navigation and portal rendering
 */

const dropdownStyles = `
  absolute z-[9999]
  min-w-[160px]
  bg-white rounded-lg shadow-lg border border-border-light
  overflow-hidden
  animate-fade-in
`;

const itemStyles = `
  flex items-center gap-2
  px-3 py-2
  text-sm text-neutral-700
  hover:bg-neutral-50
  transition-colors duration-150
  cursor-pointer
`;

const dividerStyles = `
  border-t border-border-light my-1
`;

const headerStyles = `
  px-3 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-neutral-500
`;

export function Dropdown({
  trigger,
  items = [],
  position = 'bottom', // 'bottom' | 'top' | 'left' | 'right'
  align = 'left', // 'left' | 'right'
  className = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const focusedIndexRef = useRef(-1);

  const toggle = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          close();
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
    const enabledItems = items.filter(item => !item.disabled);
    if (enabledItems.length === 0) return;

    if (e.key === 'Escape') {
      close();
      triggerRef.current?.focus();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' ? 1 : -1;
      let newIndex = focusedIndexRef.current + direction;

      // Find next enabled item
      let attempts = 0;
      while (attempts < items.length) {
        if (newIndex >= items.length) newIndex = 0;
        if (newIndex < 0) newIndex = items.length - 1;
        if (!items[newIndex].disabled) break;
        newIndex += direction;
        attempts++;
      }

      focusedIndexRef.current = newIndex;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = items[focusedIndexRef.current];
      if (item && !item.disabled) {
        item.onClick?.();
        close();
      }
    }
  };

  const handleItemClick = (item) => {
    if (item.disabled) return;
    item.onClick?.();
    close();
  };

  const clonedTrigger = React.cloneElement(trigger, {
    ref: triggerRef,
    onClick: (e) => {
      if (!disabled) {
        e.stopPropagation();
        setIsOpen(!isOpen);
      }
      trigger.props.onClick?.(e);
    },
    onKeyDown: (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
      trigger.props.onKeyDown?.(e);
    },
    'aria-haspopup': 'true',
    'aria-expanded': isOpen,
    'aria-controls': 'dropdown-menu',
  });

  const positionStyles = {
    bottom: 'top-full mt-1',
    top: 'bottom-full mb-1',
    left: 'right-full mr-1',
    right: 'left-full ml-1',
  };

  const alignStyles = {
    left: 'left-0',
    right: 'right-0',
  };

  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      id="dropdown-menu"
      role="menu"
      className={`
        ${dropdownStyles}
        ${positionStyles[position] || positionStyles.bottom}
        ${alignStyles[align] || alignStyles.left}
        ${className}
      `}
      role="menu"
      onKeyDown={(e) => e.stopPropagation()}
    >
      {items.map((item, index) => (
        item.divider ? (
          <div key={`divider-${index}`} className={dividerStyles} role="separator" />
        ) : item.header ? (
          <div key={`header-${index}`} className={headerStyles} role="none">
            {item.header}
          </div>
        ) : (
          <button
            key={index}
            type="button"
            role="menuitem"
            tabIndex={focusedIndexRef.current === index ? 0 : -1}
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => { focusedIndexRef.current = index; }}
            disabled={item.disabled}
            className={`
              ${itemStyles}
              w-full text-left
              ${item.disabled ? 'opacity-40 cursor-not-allowed' : ''}
              ${focusedIndexRef.current === index ? 'bg-neutral-50 outline-none' : ''}
            `}
            role="menuitem"
            aria-disabled={item.disabled}
          >
            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
            <span className="flex-1 truncate">{item.label}</span>
            {item.shortcut && <span className="text-xs text-neutral-400 ml-auto">{item.shortcut}</span>}
          </button>
        )
      ))}
    </div>
  );

  return (
    <div className="relative inline-block" ref={triggerRef}>
      {clonedTrigger}
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
}

export default Dropdown;