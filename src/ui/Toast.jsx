import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';
import { Button } from './Button';

/**
 * Toast System
 * Unified notification system with queue management and animations
 */

const positions = {
  'top-right': 'top-5 right-5',
  'top-left': 'top-5 left-5',
  'bottom-right': 'bottom-5 right-5',
  'bottom-left': 'bottom-5 left-5',
  'top-center': 'top-5 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2',
};

const variantStyles = {
  success: 'bg-success-light border-success-main text-success-main',
  error: 'bg-error-light border-error-main text-error-main',
  warning: 'bg-warning-light border-warning-main text-warning-main',
  info: 'bg-info-light border-info-main text-info-main',
  default: 'bg-neutral-100 border-neutral-300 text-neutral-800',
};

const iconStyles = {
  success: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m-2 2l2 2m-2 2l-2 2m-2 2l-2 2" />
    </svg>
  ),
  warning: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const containerStyles = `
  fixed z-[9999]
  flex flex-col gap-3
  p-4
  pointer-events-none
`;

const toastStyles = `
  pointer-events-auto
  flex items-center gap-3
  px-4 py-3 rounded-xl
  shadow-lg border
  text-sm font-medium
  backdrop-blur-sm
  min-w-[300px] max-w-md
  animate-slide-in
`;

const iconVariants = {
  success: iconStyles.success,
  error: iconStyles.error,
  warning: iconStyles.warning,
  info: iconStyles.info,
  default: iconStyles.info,
};

const toastVariants = {
  success: 'bg-success-light border-success-main text-success-main',
  error: 'bg-error-light border-error-main text-error-main',
  warning: 'bg-warning-light border-warning-main text-warning-main',
  info: 'bg-info-light border-info-main text-info-main',
  default: 'bg-neutral-100 border-neutral-300 text-neutral-800',
};

// Toast Context for global access
const ToastContext = React.createContext(null);

export function ToastProvider({ children, position = 'top-right', maxToasts = 5 }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = Date.now() + Math.random();
    const toast = {
      id,
      message,
      type,
      duration: options.duration ?? 5000,
      action: options.action,
      dismissible: options.dismissible !== false,
      ...options,
    };

    setToasts(prev => {
      const newToasts = [...prev, toast];
      return newToasts.slice(-maxToasts);
    });

    return id;
  }, [maxToasts]);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, dismissAll }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} position={position} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onRemove, position }) {
  return (
    <div
      className={`${containerStyles} ${positions[position] || positions['top-right']}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onRemove(toast.id), 200);
      }, toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  const variantStyle = toastVariants[toast.type] || toastVariants.default;
  const icon = iconVariants[toast.type] || iconVariants.default;

  return (
    <div
      className={`
        ${toastStyles}
        ${variantStyle}
        ${isExiting ? 'animate-slide-out' : 'animate-slide-in'}
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0" aria-hidden="true">
        {icon}
      </div>
      <p className="flex-1">{toast.message}</p>
      {toast.dismissible && (
        <button
          onClick={() => { setIsExiting(true); setTimeout(() => onRemove(toast.id), 200); }}
          className="flex-shrink-0 p-1 text-current opacity-50 hover:opacity-75 rounded transition-opacity"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      {toast.action && (
        <Button
          variant="ghost"
          size="sm"
          onClick={toast.action.onClick}
          className="flex-shrink-0 text-sm font-medium underline"
        >
          {toast.action.label}
        </Button>
      )}
    </div>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Helper hooks for common toast types
export function useToastHelpers() {
  const { addToast } = useToast();

  return {
    success: (message, options) => addToast(message, 'success', options),
    error: (message, options) => addToast(message, 'error', options),
    warning: (message, options) => addToast(message, 'warning', options),
    info: (message, options) => addToast(message, 'info', options),
  };
}

// Export individual toast functions for direct use
export function toast(message, type = 'info', options) {
  // This would be used with a global toast instance
  console.warn('Use useToast() hook or ToastProvider context instead');
}

export default {
  success: (message, options) => ({ type: 'success', message, ...options }),
  error: (message, options) => ({ type: 'error', message, ...options }),
  warning: (message, options) => ({ type: 'warning', message, ...options }),
  info: (message, options) => ({ type: 'info', message, ...options }),
};