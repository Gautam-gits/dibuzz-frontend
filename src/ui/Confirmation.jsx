import React from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';
import { Button } from './Button';

/**
 * Confirmation Dialog Component
 * Unified confirmation dialog with variants
 */

const overlayStyles = `
  fixed inset-0 z-[9999]
  flex items-center justify-center
  p-4
  bg-neutral-900/60 backdrop-blur-sm
`;

const contentStyles = `
  relative w-full max-w-md
  bg-white rounded-2xl shadow-2xl
  overflow-hidden
  animate-slide-in
`;

const iconWrapperStyles = `
  mx-auto mt-6 mb-4
  w-16 h-16 rounded-full
  flex items-center justify-center
`;

const titleStyles = `
  text-center text-xl font-bold text-neutral-900
`;

const messageStyles = `
  mt-3 text-center text-neutral-600
`;

const footerStyles = `
  flex items-center justify-center gap-3
  px-6 py-4 border-t border-border-light
`;

const variantStyles = {
  danger: 'bg-error-light border-error-main text-error-main',
  warning: 'bg-warning-light border-warning-main text-warning-main',
  info: 'bg-info-light border-info-main text-info-main',
  success: 'bg-success-light border-success-main text-success-main',
  default: 'bg-neutral-100 border-neutral-300 text-neutral-800',
};

const iconVariants = {
  danger: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  warning: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  info: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  question: (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.5-3 3-1.879 0-3.267-1.077-3.5-2.55" />
    </svg>
  ),
};

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  variant = 'question', // 'danger' | 'warning' | 'info' | 'success' | 'question'
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger', // 'danger' | 'primary' | 'warning'
  loading = false,
  className = '',
  showCancel = true,
}) {
  if (!isOpen) return null;

  const icon = variant === 'danger' ? (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ) : variant === 'warning' ? (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ) : variant === 'success' ? (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : variant === 'info' ? (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ) : (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.5-3 3-1.879 0-3.267-1.077-3.5-2.55" />
    </svg>
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-slide-in ${className}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className="mx-auto mt-6 mb-4 w-16 h-16 rounded-full flex items-center justify-center bg-brand-100 text-brand-600">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.5-3 3-1.879 0-3.267-1.077-3.5-2.55" />
          </svg>
        </div>

        <div className="px-6">
          <h2 id="confirm-title" className="text-center text-xl font-bold text-neutral-900">{title}</h2>
          <p id="confirm-message" className="mt-4 text-center text-neutral-600">{message}</p>
        </div>

        <div className="flex items-center justify-center gap-3 px-6 py-6 border-t border-neutral-200">
          {showCancel && (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 text-sm font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
          )}
          <button
            type="button"
            onClick={() => { onConfirm(); onClose(); }}
            disabled={loading}
            className={`
              ${showCancel ? 'flex-1' : ''}
              px-6 py-3 text-sm font-semibold text-white rounded-xl transition-colors disabled:opacity-50
              ${confirmVariant === 'danger'
                ? 'bg-error-main hover:bg-error-dark'
                : confirmVariant === 'warning'
                ? 'bg-warning-main hover:bg-warning-dark text-white'
                : 'bg-brand-500 hover:bg-brand-600'
              }
            `}
          >
            {loading ? 'Processing...' : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default ConfirmationDialog;