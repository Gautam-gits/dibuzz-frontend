import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';
import { Button } from './Button';

/**
 * Dialog Component
 * Accessible dialog component with focus management (similar to Modal but simpler)
 */

const overlayStyles = `
  fixed inset-0 z-[9999]
  flex items-center justify-center
  p-4
  bg-neutral-900/60 backdrop-blur-sm
`;

const contentStyles = `
  relative w-full max-w-lg max-h-[90vh]
  bg-white rounded-2xl shadow-2xl
  overflow-hidden
  animate-dialog-in
`;

const headerStyles = `
  flex items-center justify-between
  px-6 py-4
  border-b border-border-light
`;

const bodyStyles = `
  p-6
  max-h-[60vh]
  overflow-y-auto
`;

const footerStyles = `
  flex items-center justify-end gap-3
  px-6 py-4
  border-t border-border-light
  bg-neutral-50
  rounded-b-2xl
`;

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className = '',
  contentClassName = '',
}) {
  const contentRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => contentRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen && closeOnEscape && e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) onClose();
  };

  if (!isOpen) return null;

  const content = (
    <div className={`${overlayStyles} ${className}`} onClick={handleOverlayClick} role="dialog" aria-modal="true" aria-labelledby={title ? 'dialog-title' : undefined} aria-describedby={description ? 'dialog-description' : undefined}>
      <div ref={contentRef} tabIndex={-1} className={`${contentStyles} ${contentClassName}`}>
        <header className={headerStyles}>
          <div>
            {title && <h2 id="dialog-title" className="text-lg font-bold text-neutral-900">{title}</h2>}
            {description && <p id="dialog-description" className="mt-1 text-sm text-neutral-500">{description}</p>}
          </div>
          {showCloseButton && (
            <button onClick={onClose} className="p-2 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          )}
        </header>
        <div className={bodyStyles}>{children}</div>
        {footer && <footer className={footerStyles}>{footer}</footer>}
      </div>
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
}

export const AlertDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) => (
  <Dialog isOpen={isOpen} onClose={onClose} title={title} size="sm" footer={
    <>
      <Button variant="ghost" onClick={onClose} disabled={loading}>{cancelText}</Button>
      <Button variant={variant} onClick={() => { onConfirm(); onClose(); }} disabled={loading}>
        {loading ? 'Processing...' : confirmText}
      </Button>
    </>
  }>
    <p className="text-neutral-600">{message}</p>
  </Dialog>
);

export default Dialog;