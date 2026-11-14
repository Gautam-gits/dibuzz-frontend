import React from 'react';
import { designTokens } from './design-tokens';
import { Link } from 'react-router-dom';

/**
 * Breadcrumb Component
 * Unified breadcrumb navigation
 */

const containerStyles = `
  flex items-center gap-1.5
  flex-wrap
  text-sm
`;

const separatorStyles = `
  flex items-center
  text-neutral-400
  mx-1
`;

const itemStyles = `
  flex items-center gap-1.5
`;

const linkStyles = `
  text-neutral-500 hover:text-brand-600
  font-medium
  transition-colors duration-150
`;

const currentStyles = `
  text-neutral-900 font-semibold
`;

export function Breadcrumb({
  items = [],
  separator = '/',
  className = '',
  separatorIcon,
  ...props
}) {
  const Separator = separatorIcon || (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      <ol className={containerStyles}>
        {items.map((item, index) => (
          <li key={item.href || item.label || index} className={itemStyles}>
            {index > 0 && (
              <span className={separatorStyles} aria-hidden="true">
                {separatorIcon || Separator}
              </span>
            )}
            {item.href ? (
              <Link
                to={item.href}
                className={linkStyles}
                aria-current={item.isCurrent ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={currentStyles}
                aria-current={item.isCurrent ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Helper to generate breadcrumbs from path
export function useBreadcrumb(pathname, routes = []) {
  return useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const items = [{ label: 'Home', href: '/' }];

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const route = routes.find(r => r.path === currentPath) ||
                   routes.find(r => r.path === `/${segment}`);

      items.push({
        label: route?.breadcrumb || segment.charAt(0).toUpperCase() + segment.slice(1),
        href: currentPath,
        isCurrent: index === segments.length - 1,
      });
    });

    return items;
  }, [pathname, routes]);
}

export default Breadcrumb;