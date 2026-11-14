import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';

/**
 * Modal Component
 * Unified modal system with sizes, focus management, and animations
 */

const baseOverlayStyles = `
  fixed inset-0 z-[9999]
  flex items-center justify-center
  p-4 sm:p-6
  bg-neutral-900/60 backdrop-blur-sm
  overflow-y-auto
`;

const baseContentStyles = `
  relative w-full max-h-[90vh]
  bg-white rounded-2xl shadow-2xl
  transform transition-all duration-200
  animate-modal-in
`;

const sizeStyles = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-[90vw] max-h-[90vh]',
};

const headerStyles = `
  sticky top-0 z-10
  flex items-center justify-between
  gap-4
  px-6 py-4
  border-b border-border-light
  bg-white/95 backdrop-blur-sm
  rounded-t-2xl
`;

const bodyStyles = `
  p-6
  max-h-[60vh]
  overflow-y-auto
  pr-2
`;

const footerStyles = `
  sticky bottom-0 z-10
  flex items-center justify-end gap-3
  px-6 py-4
  border-t border-border-light
  bg-white/95 backdrop-blur-sm
  rounded-b-2xl
`;

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  hideHeader = false,
  className = '',
  contentClassName = '',
}) {
  const contentRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      // Focus first focusable element
      setTimeout(() => {
        contentRef.current?.focus();
      }, 50);
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen || !closeOnEscape) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent scroll on overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className={`
        ${baseOverlayStyles}
        ${className}
      `}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={contentRef}
        tabIndex={-1}
        className={`
          ${baseContentStyles}
          ${sizeStyles[size] || sizeStyles.md}
          ${contentClassName}
        `}
      >
        {!hideHeader && (
          <header className={headerStyles}>
            <div className="flex-1">
              {title && (
                <h2 id="modal-title" className="text-lg font-bold text-neutral-900">
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className="mt-1 text-sm text-neutral-500">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className={`
                  p-2 rounded-lg text-neutral-400
                  hover:text-neutral-600 hover:bg-neutral-100
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-brand-500
                `}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </header>
        )}

        <div className={bodyStyles}>
          {children}
        </div>

        {footer && (
          <footer className={footerStyles}>
            {footer}
          </footer>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// Specialized modal variants
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger' | 'primary' | 'warning'
  loading = false,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => { onConfirm(); onClose(); }}
          disabled={loading}
          className={`
            px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors
            ${variant === 'danger'
              ? 'bg-error-main hover:bg-error-dark'
              : variant === 'warning'
              ? 'bg-warning-main hover:bg-warning-dark'
              : 'bg-brand-500 hover:bg-brand-600'
            }
            disabled:opacity-50
          `}
        >
          {loading ? 'Processing...' : confirmText}
        </button>
      </>
    }
  >
    <p className="text-neutral-600">{message}</p>
  </Modal>
);

export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  children,
  submitText = 'Save',
  cancelText = 'Cancel',
  loading = false,
  size = 'md',
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    description={description}
    size={size}
    footer={
      <>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="submit"
          form="modal-form"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : submitText}
        </button>
      </>
    }
  >
    <form id="modal-form" onSubmit={onSubmit}>
      {children}
    </form>
  </Modal>
);

export default Modal;