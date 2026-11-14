import React from 'react';
import { designTokens } from './design-tokens';
import { Button } from './Button';
import { Spinner } from './Spinner';

/**
 * EmptyState Component
 * Unified empty state illustrations and messages
 */

const illustrations = {
  default: (
    <svg className="w-16 h-16 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  search: (
    <svg className="w-16 h-16 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  folder: (
    <svg className="w-16 h-16 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-1-1H4a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-8a2 2 0 00-2-2H9a2 2 0 00-2 2z" />
    </svg>
  ),
  inbox: (
    <svg className="w-16 h-16 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  users: (
    <svg className="w-16 h-16 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  certificate: (
    <svg className="w-16 h-16 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-16 h-16 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  notifications: (
    <svg className="w-16 h-16 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  lock: (
    <svg className="w-16 h-16 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  video: (
    <svg className="w-16 h-16 text-neutral-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L9 12M19 12l-6 4v-8z" />
    </svg>
  ),
};

const layoutStyles = `
  flex flex-col items-center justify-center
  px-6 py-12 sm:px-8
  text-center
`;

const titleStyles = `
  mt-4 text-xl sm:text-2xl font-bold text-neutral-900
`;

const descriptionStyles = `
  mt-2 text-sm sm:text-base text-neutral-500 max-w-md mx-auto
`;

const actionStyles = `
  mt-6 flex flex-col sm:flex-row items-center justify-center gap-3
`;

export function EmptyState({
  illustration = 'default',
  title,
  description,
  action,
  secondaryAction,
  className = '',
  customIllustration,
}) {
  const illustrationElement = customIllustration || illustrations[illustration] || illustrations.default;

  return (
    <section className={`mx-auto max-w-xl ${className}`}>
      <div className={layoutStyles}>
        <div className="text-neutral-400">
          {illustrationElement}
        </div>

        {title && <h1 className={titleStyles}>{title}</h1>}

        {description && <p className={descriptionStyles}>{description}</p>}

        {(action || secondaryAction) && (
          <div className={actionStyles}>
            {secondaryAction && (
              <Button variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
            {action && (
              <Button
                variant={action.variant || 'primary'}
                size={action.size || 'md'}
                onClick={action.onClick}
                disabled={action.disabled}
                loading={action.loading}
                leftIcon={action.leftIcon}
                rightIcon={action.rightIcon}
              >
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// Predefined empty states for common use cases
export const EmptyStates = {
  noPrograms: () => (
    <EmptyState
      illustration="folder"
      title="No programs yet"
      description="When you join a program, or your application is accepted, it will appear here."
      action={{ label: 'Explore programs', variant: 'primary', onClick: () => {} }}
    />
  ),

  noApplications: () => (
    <EmptyState
      illustration="inbox"
      title="No applications yet"
      description="Programs you apply to will be tracked here."
      action={{ label: 'Explore programs', variant: 'primary', onClick: () => {} }}
    />
  ),

  noCertificates: () => (
    <EmptyState
      illustration="certificate"
      title="No certificates yet"
      description="Complete a program to earn your verified completion certificate."
    />
  ),

  noResults: (searchTerm) => (
    <EmptyState
      illustration="search"
      title="No results found"
      description={searchTerm ? `No results for "${searchTerm}". Try a different search term.` : 'No results match your filters.'}
      secondaryAction={{ label: 'Clear filters', onClick: () => {} }}
    />
  ),

  noData: (message = 'No data available') => (
    <EmptyState
      illustration="default"
      title="No data"
      description={message}
    />
  ),

  loading: (message = 'Loading...') => (
    <div className="flex flex-col items-center justify-center px-6 py-12 sm:px-8 text-center">
      <Spinner size="lg" />
      <p className="mt-4 text-sm font-medium text-neutral-600">{message}</p>
    </div>
  ),

  error: (message = 'Something went wrong', onRetry) => (
    <EmptyState
      illustration="lock"
      title="Unable to load"
      description={message}
      action={{ label: 'Try again', variant: 'primary', onClick: onRetry }}
    />
  ),

  noAccess: () => (
    <EmptyState
      illustration="lock"
      title="Access restricted"
      description="You don't have permission to view this content. Please contact support if you believe this is an error."
      action={{ label: 'Contact support', variant: 'primary', onClick: () => {} }}
    />
  ),
};

export default EmptyState;