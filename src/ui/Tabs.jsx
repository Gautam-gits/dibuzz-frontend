import React, { useState, useRef, useEffect } from 'react';
import { designTokens } from './design-tokens';

/**
 * Tabs Component
 * Unified tabs system with keyboard navigation and animations
 */

const baseStyles = `
  flex
`;

const listStyles = `
  flex
  border-b border-border-light
`;

const triggerStyles = `
  flex items-center justify-center gap-1.5
  px-4 py-3
  text-sm font-semibold
  text-neutral-500
  hover:text-neutral-700
  hover:bg-neutral-50
  transition-all duration-150
  border-b-2 border-transparent
  -mb-px
  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const activeTriggerStyles = `
  text-brand-600
  border-b-brand-500
  bg-white
`;

const panelStyles = `
  py-4
  animate-fade-in
`;

export function Tabs({
  defaultValue,
  value,
  onChange,
  children,
  variant = 'line', // 'line' | 'enclosed' | 'soft'
  orientation = 'horizontal',
  className = '',
}) {
  const [activeTab, setActiveTab] = useState(defaultValue || value);
  const tabsRef = useRef([]);

  const controlled = value !== undefined;
  const currentValue = controlled ? value : activeTab;

  const handleChange = (val) => {
    if (!controlled) setActiveTab(val);
    onChange?.(val);
  };

  const handleKeyDown = (e, index) => {
    let newIndex = -1;
    const tabs = tabsRef.current.filter((_, i) => !children[i]?.props?.disabled);

    if (orientation === 'horizontal') {
      if (e.key === 'ArrowRight') newIndex = (index + 1) % tabs.length;
      if (e.key === 'ArrowLeft') newIndex = (index - 1 + tabs.length) % tabs.length;
    } else {
      if (e.key === 'ArrowDown') newIndex = (index + 1) % tabs.length;
      if (e.key === 'ArrowUp') newIndex = (index - 1 + tabs.length) % tabs.length;
    }

    if (e.key === 'Home') newIndex = 0;
    if (e.key === 'End') newIndex = tabs.length - 1;

    if (newIndex !== -1) {
      e.preventDefault();
      const newTab = tabs[newIndex];
      if (newTab && !newTab.props.disabled) {
        handleChange(newTab.props.value);
        tabsRef.current[newIndex]?.focus();
      }
    }
  };

  return (
    <div className={className} data-orientation={orientation}>
      <div
        role="tablist"
        aria-orientation={orientation}
        className={`
          ${listStyles}
          ${variant === 'enclosed' && 'border border-border-light rounded-lg bg-white'}
          ${variant === 'soft' && 'bg-neutral-50 rounded-lg p-1'}
        `}
      >
        {React.Children.map(children, (child, index) => {
          if (!React.isValidElement(child)) return null;

          const isActive = child.props.value === currentValue;
          const disabled = child.props.disabled;

          const tabRef = (el) => {
            tabsRef.current[index] = el;
          };

          return React.cloneElement(child, {
            ref: tabRef,
            isActive,
            onClick: () => !disabled && handleChange(child.props.value),
            onKeyDown: (e) => handleKeyDown(e, index),
            'aria-selected': isActive,
            'aria-disabled': disabled,
            role: 'tab',
            tabIndex: isActive ? 0 : -1,
            id: `tab-${child.props.value}`,
            'aria-controls': `panel-${child.props.value}`,
          });
        })}
      </div>

      <div className="mt-4" role="tabpanel" aria-orientation={orientation}>
        {React.Children.map(children, (child) => {
          if (!React.isValidElement(child)) return null;
          const isActive = child.props.value === currentValue;
          return isActive ? (
            <div
              key={child.props.value}
              role="tabpanel"
              id={`panel-${child.props.value}`}
              aria-labelledby={`tab-${child.props.value}`}
              className={panelStyles}
            >
              {child.props.children}
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
}

export const Tab = ({
  value,
  children,
  disabled = false,
  className = '',
  isActive,
  onClick,
  onKeyDown,
  ...props
}) => {
  return (
    <button
      role="tab"
      type="button"
      {...props}
      disabled={disabled}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={`
        flex items-center justify-center gap-2
        px-4 py-3
        text-sm font-semibold
        transition-all duration-150
        border-b-2 border-transparent
        -mb-px
        focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset
        ${disabled
          ? 'text-neutral-400 cursor-not-allowed'
          : isActive
          ? 'text-brand-600 border-b-2 border-brand-500'
          : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50'
        }
        ${className}
      `}
    >
      {children}
    </button>
  );
};

Tab.displayName = 'Tab';

export const TabPanel = ({ value, children, className = '' }) => (
  <div role="tabpanel" className={`py-4 animate-fade-in ${className}`}>
    {children}
  </div>
);

TabPanel.displayName = 'TabPanel';

export default Tabs;
