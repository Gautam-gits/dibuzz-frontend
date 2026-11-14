import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';
import { Button } from './Button';

/**
 * DatePicker Component
 * Unified date picker with single date, range, and multiple selection
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
  w-full max-w-xs
  bg-white rounded-lg shadow-lg border border-border-light
  overflow-hidden
`;

const headerStyles = `
  flex items-center justify-between
  px-4 py-3
  border-b border-border-light
`;

const navStyles = `
  p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors
`;

const weekDayStyles = `
  text-center text-xs font-semibold text-neutral-500 py-2
`;

const dayStyles = `
  w-8 h-8
  text-center text-sm
  rounded-lg
  font-medium
  cursor-pointer
  transition-colors duration-150
  text-neutral-700
  hover:bg-neutral-100
`;

const daySelectedStyles = `
  bg-brand-500 text-white
  hover:bg-brand-600
`;

const dayRangeStyles = `
  bg-brand-100 text-brand-700
  hover:bg-brand-200
`;

const dayTodayStyles = `
  ring-2 ring-brand-500
`;

const dayDisabledStyles = `
  text-neutral-300 cursor-not-allowed
`;

const footerStyles = `
  flex items-center justify-end gap-2
  px-4 py-3 border-t border-border-light
`;

const monthYearStyles = `
  font-semibold text-neutral-900
`;

export function DatePicker({
  label,
  value,
  onChange,
  mode = 'single', // 'single' | 'range' | 'multiple'
  placeholder = 'Select date',
  disabled = false,
  className = '',
  error,
  helperText,
  minDate,
  maxDate,
  disabledDates = [],
  showTime = false,
  timeFormat = '24h',
  'aria-label': ariaLabel,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => value ? new Date(value) : new Date());
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    if (!disabled) setIsOpen(!isOpen);
  };

  const handleClose = () => setIsOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
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

  const handleSelect = (date) => {
    if (mode === 'range') {
      // Handle range selection
    } else if (mode === 'multiple') {
      // Handle multiple selection
    } else {
      onChange?.(date);
      setIsOpen(false);
    }
  };

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  const isDisabled = (date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(d => isSameDay(d, date));
  };

  const isSelected = (date) => {
    if (!value) return false;
    if (mode === 'range' && Array.isArray(value)) {
      return value[0] && value[1] && date >= value[0] && date <= value[1];
    }
    if (mode === 'multiple' && Array.isArray(value)) {
      return value.some(v => isSameDay(v, date));
    }
    return isSameDay(value, date);
  };

  const isInRange = (date) => {
    if (mode === 'range' && Array.isArray(value) && value[0] && value[1]) {
      return date > value[0] && date < value[1];
    }
    return false;
  };

  const isSameDay = (a, b) => {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  };

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthDays = (date) => {
    const days = [];
    const firstDay = firstDayOfMonth(date);
    const totalDays = daysInMonth(date);
    const prevMonthDays = firstDay;

    // Previous month days
    const prevMonth = new Date(date.getFullYear(), date.getMonth(), 0);
    for (let i = prevMonthDays - 1; i >= 0; i--) {
      days.unshift({ day: prevMonth.getDate() - i, isCurrentMonth: false, date: new Date(prevMonth.getFullYear(), prevMonth.getMonth(), prevMonth.getDate() - i) });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(date.getFullYear(), date.getMonth(), i) });
    }

    // Next month days
    const nextMonthStart = days.length;
    const nextMonthDays = 42 - nextMonthStart;
    for (let i = 1; i <= nextMonthDays; i++) {
      days.push({ day: i, isCurrentMonth: false, date: new Date(date.getFullYear(), date.getMonth() + 1, i) });
    }

    return days;
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
      role="dialog"
      aria-label="Choose date"
    >
      <header className={headerStyles}>
        <button
          type="button"
          onClick={() => navigateMonth(-1)}
          className={navStyles}
          aria-label="Previous month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 text-center">
          <span className={monthYearStyles}>
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <button
          type="button"
          onClick={() => navigateMonth(1)}
          className={navStyles}
          aria-label="Next month"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </header>

      <div className="grid grid-cols-7 gap-0 px-4 py-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className={weekDayStyles}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0 px-4 pb-4">
        {getMonthDays(currentMonth).map((dayData, index) => (
          <button
            key={index}
            type="button"
            role="gridcell"
            aria-selected={isSelected(dayData.date)}
            aria-disabled={dayData.isDisabled}
            onClick={() => !dayData.isDisabled && handleSelect(dayData.date)}
            className={`
              ${dayStyles}
              ${dayData.isCurrentMonth ? '' : 'text-neutral-300'}
              ${dayData.isDisabled ? dayDisabledStyles : ''}
              ${isSelected(dayData.date) ? daySelectedStyles : ''}
              ${isInRange(dayData.date) ? dayRangeStyles : ''}
              ${isSameDay(dayData.date, new Date()) ? dayTodayStyles : ''}
            `}
            disabled={dayData.isDisabled}
          >
            {dayData.day}
          </button>
        ))}
      </div>

      <footer className={footerStyles}>
        <Button variant="ghost" size="sm" onClick={() => { setCurrentMonth(new Date()); setIsOpen(false); }}>Today</Button>
        <Button variant="ghost" size="sm" onClick={handleClose}>Clear</Button>
      </footer>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <label className="block">
        {label && (
          <span className="block text-xs font-semibold text-neutral-700 mb-1.5">
            {label}
            {props.required && <span className="text-error-main ml-0.5" aria-hidden="true">*</span>}
          </span>
        )}
        <div className="relative">
          <button
            ref={triggerRef}
            type="button"
            className={triggerClassName}
            onClick={handleToggle}
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={isOpen}
            aria-label={ariaLabel}
          >
            <span className="flex-1 truncate">
              {value ? formatDate(value) : placeholder}
            </span>
            <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l4 4m-6 11V7a2 2 0 01-2-2H6a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2v10" />
            </svg>
          </button>
        </div>
        {error && <p className="mt-1.5 text-sm text-error-main" role="alert">{error}</p>}
        {helperText && !error && <p className="mt-1.5 text-sm text-neutral-500">{helperText}</p>}
      </label>
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function isSameDay(a, b) {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth() === b.getMonth() &&
         a.getDate() === b.getDate();
}

export default DatePicker;
