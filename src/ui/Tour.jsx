import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';
import { Button } from './Button';

/**
 * Tour Component
 * Unified product tour / onboarding walkthrough
 */

const overlayStyles = `
  fixed inset-0 z-[9999]
  bg-neutral-900/60
`;

const stepStyles = `
  fixed z-[10000]
  max-w-sm
  bg-white rounded-xl shadow-2xl border border-border-light
  overflow-hidden
  animate-slide-in
`;

const headerStyles = `
  flex items-center justify-between
  px-4 py-3
  border-b border-border-light
`;

const bodyStyles = `
  p-4
`;

const footerStyles = `
  flex items-center justify-between gap-2
  px-4 py-3
  border-t border-border-light
`;

const progressStyles = `
  h-1.5 bg-neutral-200 rounded-full overflow-hidden
`;

const progressBarStyles = `
  h-full bg-brand-500 rounded-full transition-all duration-300
`;

const skipStyles = `
  text-sm text-neutral-500 hover:text-neutral-700
`;

const counterStyles = `
  text-sm font-medium text-neutral-500
`;

export function Tour({
  isOpen,
  onClose,
  onComplete,
  steps = [],
  currentStep = 0,
  showProgress = true,
  showCounter = true,
  showSkip = true,
  className = '',
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(currentStep);
  const stepRef = useRef(null);
  const targetRefs = useRef({});

  const step = steps[currentStepIndex];
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const nextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onComplete?.();
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  // Position tooltip relative to target
  useEffect(() => {
    if (step && step.target) {
      const target = document.querySelector(step.target);
      if (target && stepRef.current) {
        const rect = target.getBoundingClientRect();
        const stepRect = stepRef.current.getBoundingClientRect();
        const position = step.position || 'bottom';

        let top, left;

        switch (position) {
          case 'top':
            top = rect.top - stepRect.height - 12;
            left = rect.left + rect.width / 2 - stepRect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 12;
            left = rect.left + rect.width / 2 - stepRect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2 - stepRect.height / 2;
            left = rect.left - stepRect.width - 12;
            break;
          case 'right':
            top = rect.top + rect.height / 2 - stepRect.height / 2;
            left = rect.right + 12;
            break;
          default:
            top = rect.bottom + 12;
            left = rect.left + rect.width / 2 - stepRect.width / 2;
        }

        stepRef.current.style.top = `${top}px`;
        stepRef.current.style.left = `${left}px`;
      }
    }
  }, [step, currentStepIndex]);

  if (!isOpen || !step) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay with hole for target */}
      <div className="fixed inset-0 bg-neutral-900/60" onClick={onClose}>
        {step.target && (
          <div
            className="absolute"
            style={{
              top: targetRefs.current[step.target]?.top,
              left: targetRefs.current[step.target]?.left,
              width: targetRefs.current[step.target]?.width,
              height: targetRefs.current[step.target]?.height,
            }}
          >
            <div
              className="absolute inset-0 bg-neutral-900/60 rounded-lg ring-4 ring-white ring-offset-4 ring-offset-neutral-900/60"
              style={{
                borderRadius: '8px',
                boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.6)',
              }}
            />
          </div>
        )}
      </div>

      {/* Tour step */}
      <div
        ref={stepRef}
        className={`
          fixed z-[10001]
          max-w-sm
          bg-white rounded-xl shadow-2xl border border-border-light
          animate-slide-in
        `}
        role="dialog"
        aria-label={`Step ${currentStepIndex + 1} of ${steps.length}`}
      >
        <header className="flex items-center justify-between px-4 py-3 border-b border-border-light">
          <h3 className="font-semibold text-neutral-900">{step.title}</h3>
          {showSkip && (
            <button onClick={skipTour} className="text-sm text-neutral-500 hover:text-neutral-700">
              Skip
            </button>
          )}
        </header>

        <div className="p-4">
          <p className="text-neutral-600">{step.content}</p>
        </div>

        <footer className="flex items-center justify-between gap-2 px-4 py-3 border-t border-border-light">
          {showProgress && (
            <div className="flex-1">
              <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            {showCounter && (
              <span className="text-sm font-medium text-neutral-500">
                {currentStepIndex + 1} / {steps.length}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={prevStep} disabled={isFirst}>
              Previous
            </Button>
            <Button variant={isLast ? 'primary' : 'primary'} size="sm" onClick={nextStep}>
              {isLast ? 'Finish' : 'Next'}
            </Button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
}

export function useTour(steps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const start = useCallback(() => {
    setCurrentStep(0);
    setIsOpen(true);
  }, []);

  const next = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  }, [steps]);

  const prev = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setCurrentStep(0);
  }, []);

  const complete = useCallback(() => {
    setIsOpen(false);
    setCurrentStep(0);
  }, []);

  return {
    isOpen,
    currentStep,
    start,
    next,
    prev,
    close,
    complete,
    setCurrentStep,
  };
}

export default Tour;