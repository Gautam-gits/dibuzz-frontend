import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';
import { Button } from './Button';

/**
 * TagInput Component
 * Unified tag/token input with autocomplete suggestions
 */

const containerStyles = `
  relative
  w-full
`;

const tagsContainerStyles = `
  flex flex-wrap gap-2
  min-h-[42px]
  px-3 py-2
  rounded-control
  border-2 border-border-medium
  bg-white
  transition-all duration-200
  focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20
`;

const tagStyles = `
  inline-flex items-center gap-1.5
  px-2.5 py-1
  bg-brand-50 text-brand-700
  rounded-full
  text-sm font-medium
  animate-slide-in
`;

const inputStyles = `
  flex-1 min-w-[80px]
  bg-transparent border-none outline-none
  text-sm text-neutral-900
  placeholder:text-neutral-400
`;

const dropdownStyles = `
  absolute z-[9999] mt-1
  w-full max-h-60
  bg-white rounded-lg shadow-lg border border-border-light
  overflow-hidden
`;

const suggestionStyles = `
  px-4 py-2
  text-sm text-neutral-700
  hover:bg-neutral-50
  cursor-pointer
  transition-colors duration-150
`;

const selectedSuggestionStyles = `
  bg-brand-50 text-brand-700
`;

const noResultsStyles = `
  px-4 py-4 text-center text-neutral-500 text-sm
`;

export function TagInput({
  label,
  value = [],
  onChange,
  suggestions = [],
  placeholder = 'Add tags...',
  maxTags = 10,
  allowCustom = true,
  disabled = false,
  error,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const filteredSuggestions = suggestions.filter(s =>
    s.label.toLowerCase().includes(inputValue.toLowerCase()) &&
    !value.some(v => v === s.value)
  );

  const handleAddTag = (tag) => {
    if (value.length >= maxTags) return;
    if (value.some(v => v === tag)) return;
    onChange?.([...value, tag]);
    setInputValue('');
    setSelectedSuggestion(-1);
    if (!showDropdown) setShowDropdown(false);
  };

  const handleRemoveTag = (tag) => {
    onChange?.(value.filter(v => v !== tag));
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowDropdown(true);
    setSelectedSuggestion(-1);
  };

  const handleKeyDown = (e) => {
    const filtered = filteredSuggestions;
    if (filtered.length === 0) {
      if (e.key === 'Enter' && inputValue.trim() && allowCustom) {
        e.preventDefault();
        addCustomTag();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => Math.min(prev + 1, filtered.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filtered[selectedSuggestion]) {
          addTag(filtered[selectedSuggestion]);
        } else if (inputValue.trim() && allowCustom) {
          addCustomTag();
        }
        break;
      case 'Backspace':
        if (!inputValue && value.length > 0) {
          removeTag(value[value.length - 1]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        inputRef.current?.blur();
        break;
    }
  };

  const addCustomTag = () => {
    const tag = inputValue.trim();
    if (tag) addTag(tag);
  };

  const addTag = (tag) => {
    const tagValue = typeof tag === 'object' ? tag.value : tag;
    if (!value.includes(tagValue) && value.length < maxTags) {
      onChange?.([...value, tagValue]);
      setInputValue('');
      setShowDropdown(false);
    }
  };

  const removeTag = (tag) => {
    onChange?.(value.filter(v => v !== tag));
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowDropdown(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setShowDropdown(false);
    }, 200);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <div ref={containerRef} className={className}>
      {label && (
        <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
          {label}
          {props.required && <span className="text-error-main ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}

      <div
        ref={containerRef}
        className={`
          ${tagsContainerStyles}
          ${error ? 'border-error-main' : ''}
          ${disabled ? 'opacity-50' : ''}
          ${className}
        `}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {value.map((tag, index) => (
          <span key={index} className={tagStyles}>
            <span>{typeof tag === 'object' ? tag.label : tag}</span>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
                className="p-0.5 text-brand-500 hover:text-brand-700 rounded-full hover:bg-brand-100"
                aria-label={`Remove ${typeof tag === 'object' ? tag.label : tag}`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={value.length === 0 ? placeholder : ''}
          disabled={disabled || value.length >= maxTags}
          className={inputStyles}
          aria-label={ariaLabel}
          disabled={disabled || value.length >= maxTags}
        />

        {value.length >= maxTags && (
          <span className="text-xs text-neutral-500 px-2">Max tags reached</span>
        )}
      </div>

      {showDropdown && filteredSuggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className={dropdownStyles}
          role="listbox"
          aria-label="Suggestions"
        >
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.value}
              type="button"
              role="option"
              aria-selected={index === selectedSuggestion}
              onClick={() => addTag(suggestion)}
              onMouseEnter={() => setSelectedSuggestion(index)}
              className={`
                ${suggestionStyles}
                ${index === selectedSuggestion ? selectedSuggestionStyles : ''}
              `}
            >
              {suggestion.label}
            </button>
          ))}
          {allowCustom && inputValue && !filteredSuggestions.some(s => s.value === inputValue.trim()) && (
            <button
              key="custom"
              type="button"
              role="option"
              aria-selected={selectedSuggestion === filteredSuggestions.length}
              onClick={() => addCustomTag()}
              onMouseEnter={() => setSelectedSuggestion(filteredSuggestions.length)}
              className={suggestionStyles}
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                <span>Create "<strong>{inputValue.trim()}</strong>"</span>
              </span>
            </button>
          )}
          {filteredSuggestions.length === 0 && inputValue && !allowCustom && (
            <div className={noResultsStyles}>No suggestions found</div>
          )}
        </div>
      )}

      {error && <p className="mt-1.5 text-sm text-error-main" role="alert">{error}</p>}
      {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500">{props.helperText}</p>}
    </div>
  );
}

export default TagInput;
