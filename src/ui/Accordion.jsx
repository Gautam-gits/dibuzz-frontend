import React, { useState, useRef, useEffect } from 'react';
import { designTokens } from './design-tokens';

/**
 * Accordion Component
 * Unified accordion/collapse component with animations
 */

const itemStyles = `
  border border-border-light rounded-xl overflow-hidden
  bg-white
  transition-all duration-200
`;

const headerStyles = `
  flex items-center justify-between
  w-full px-5 py-4
  text-left
  bg-white
  border-none
  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const contentStyles = `
  overflow-hidden
  transition-all duration-300 ease-in-out
`;

const iconStyles = `
  flex-shrink-0
  w-5 h-5
  text-neutral-400
  transition-transform duration-300
  flex-shrink-0
`;

const contentInnerStyles = `
  px-5 pb-4
  text-neutral-600
`;

export function Accordion({
  items = [],
  allowMultiple = false,
  defaultOpen = [],
  className = '',
  allowToggle = true,
  ...props
}) {
  const [openItems, setOpenItems] = useState(
    allowMultiple ? defaultOpen : (defaultOpen[0] ? [defaultOpen[0]] : [])
  );

  const toggleItem = (value) => {
    setOpenItems(prev => {
      if (allowMultiple) {
        return prev.includes(value)
          ? prev.filter(v => v !== value)
          : [...prev, value];
      }
      return prev.includes(value) && allowToggle ? [] : [value];
    });
  };

  return (
    <div className={`${className}`} {...props}>
      <div className="space-y-3" data-accordion>
        {items.map((item, index) => (
          <AccordionItem
            key={item.value || index}
            item={item}
            isOpen={openItems.includes(item.value)}
            onToggle={() => toggleItem(item.value)}
            disabled={item.disabled}
          />
        ))}
      </div>
    </div>
  );
}

function AccordionItem({ item, isOpen, onToggle, disabled }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className={`${itemStyles} ${isOpen ? 'shadow-md' : ''} ${disabled ? 'opacity-50' : ''}`}>
      <button
        type="button"
        onClick={() => !disabled && onToggle()}
        disabled={disabled}
        className={`${headerStyles} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${item.value}`}
        id={`accordion-header-${item.value}`}
      >
        <span className="flex-1 text-left font-semibold text-neutral-900 pr-4">
          {item.label}
        </span>
        {item.icon && <span className="flex-shrink-0 text-neutral-400">{item.icon}</span>}
        <svg
          className={`${iconStyles} ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        id={`accordion-content-${item.value}`}
        role="region"
        aria-labelledby={`accordion-header-${item.value}`}
        className={contentStyles}
        style={{ maxHeight: isOpen ? height : 0 }}
      >
        <div className={contentInnerStyles} ref={contentRef}>
          {item.content}
        </div>
      </div>
    </div>
  );
}

export default Accordion;