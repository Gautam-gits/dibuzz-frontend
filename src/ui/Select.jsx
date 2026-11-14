import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';
import { Button } from './Button';

/**
 * Select Component
 * Unified select dropdown with search, multi-select, and async options
 */

const triggerStyles = `
  w-full
  rounded-control
  border border-border-medium
  bg-white
  px-4 py-2.5
  text-sm text-neutral-900
  placeholder:text-neutral-400
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
  disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
`;

const dropdownStyles = `
  absolute z-[9999] mt-1
  w-full max-h-60
  bg-white rounded-lg shadow-lg border border-border-light
  overflow-hidden
`;

const optionStyles = `
  px-4 py-2
  text-sm text-neutral-700
  hover:bg-neutral-50
  cursor-pointer
  transition-colors duration-150
`;

const groupStyles = `
  px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-neutral-500 bg-neutral-50
`;

export function Select({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  value,
  onChange,
  disabled = false,
  searchable = false,
  multi = false,
  clearable = false,
  className = '',
  name,
  required,
  'aria-label': ariaLabel,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const focusedIndexRef = useRef(-1);

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          handleClose();
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
    const visibleOptions = options.filter(opt => !opt.disabled && (opt.group ? opt.group : true));
    if (visibleOptions.length === 0) return;

    if (e.key === 'Escape') {
      handleClose();
      triggerRef.current?.focus();
      return;
    }

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const direction = e.key === 'ArrowDown' ? 1 : -1;
      let newIndex = focusedIndexRef.current + direction;
      while (newIndex >= 0 && newIndex < options.length && options[newIndex].disabled) {
        newIndex += e.key === 'ArrowDown' ? 1 : -1;
      }
      if (newIndex >= 0 && newIndex < options.length) {
        focusedIndexRef.current = newIndex;
      }
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const option = options[focusedIndexRef.current];
      if (option && !option.disabled) {
        handleSelect(option);
      }
    }
  };

  const filteredOptions = searchable
    ? options.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const handleSelect = (option) => {
    if (option.disabled) return;
    if (multi) {
      const newValue = value.includes(option.value)
        ? value.filter(v => v !== option.value)
        : [...value, option.value];
      onChange?.(newValue);
    } else {
      onChange?.(option.value);
      handleClose();
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.(multi ? [] : '');
    handleClose();
  };

  const triggerClassName = `
    ${triggerStyles}
    ${error ? 'border-error-main focus:ring-error-main' : ''}
    ${className}
  `;

  const dropdownContent = isOpen && (
    <div
      ref={dropdownRef}
      className={dropdownStyles}
      role="listbox"
      aria-label={ariaLabel}
    >
      {searchable && (
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="w-full px-4 py-2 border-b border-border-light rounded-t-lg focus:outline-none"
        />
      )}
      <div className="max-h-60 overflow-y-auto">
        {options.map((option, index) => {
          if (option.group) {
            return (
              <div key={`group-${index}`} className={groupStyles}>
                {option.group}
              </div>
            );
          }
          return (
            <button
              key={option.value}
              type="button"
              role="option"
              aria-selected={multi ? value?.includes(option.value) : value === option.value}
              aria-disabled={option.disabled}
              onClick={() => handleSelect(option)}
              onMouseEnter={() => { focusedIndexRef.current = index; }}
              disabled={option.disabled}
              className={`
                ${optionStyles}
                w-full text-left
                ${option.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                ${(multi ? value?.includes(option.value) : value === option.value) ? 'bg-brand-50 text-brand-700' : ''}
                ${focusedIndexRef.current === index ? 'bg-neutral-50 outline-none' : ''}
              `}
            >
              {multi && (
                <svg className={`w-4 h-4 flex-shrink-0 ${value?.includes(option.value) ? 'text-brand-500' : 'text-neutral-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              <span className="flex-1 truncate">{option.label}</span>
            </button>
          );
        })}
      </div>
      {filteredOptions.length === 0 && (
        <div className="px-4 py-4 text-center text-neutral-500 text-sm">No options found</div>
      )}
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        {label && (
          <span className="block text-xs font-semibold text-neutral-700 mb-1.5">
            {label}
            {required && <span className="text-error-main ml-0.5" aria-hidden="true">*</span>}
          </span>
        )}
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            className={triggerClassName}
            onClick={handleToggle}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label={ariaLabel}
          >
            <span className="flex-1 truncate">
              {multi
                ? value?.length
                  ? value.map(v => options.find(o => o.value === v)?.label).join(', ')
                  : placeholder
                : options.find(o => o.value === value)?.label || placeholder
              }
            </span>
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 rounded"
                aria-label="Clear selection"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            )}
            <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {error && <p className="mt-1.5 text-sm text-error-main" role="alert">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>}
      </label>
      {isOpen && (
        <div
          className={dropdownStyles}
          role="listbox"
          aria-label={ariaLabel}
        >
          {searchable && (
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-4 py-2 border-b border-border-light rounded-t-lg focus:outline-none"
            />
          )}
          <div className="max-h-60 overflow-y-auto">
            {options.map((option, index) => {
              if (option.group) {
                return (
                  <div key={`group-${index}`} className="px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-neutral-500 bg-neutral-50">
                    {option.group}
                  </div>
                );
              }
              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={multi ? value?.includes(option.value) : value === option.value}
                  aria-disabled={option.disabled}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => { focusedIndexRef.current = index; }}
                  disabled={option.disabled}
                  className={`
                    w-full px-4 py-2 text-sm text-left text-neutral-700
                    hover:bg-neutral-50 cursor-pointer
                    ${option.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                    ${(multi ? value?.includes(option.value) : value === option.value) ? 'bg-brand-50 text-brand-700' : ''}
                  `}
                >
                  {multi && (
                    <svg className={`w-4 h-4 flex-shrink-0 ${value?.includes(option.value) ? 'text-brand-500' : 'text-neutral-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className="flex-1 truncate">{option.label}</span>
                </button>
              );
            })}
          </div>
          {filteredOptions.length === 0 && (
            <div className="px-4 py-4 text-center text-neutral-500 text-sm">No options found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Select;
