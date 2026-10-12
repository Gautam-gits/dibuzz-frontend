import React from 'react';

/* Shared DIBUZZ building blocks (Phase 2). Colours come from the tokens in index.css. */

const BUTTON_STYLES = {
  primary: 'bg-brand text-white hover:bg-brand-hover',
  secondary: 'border border-line bg-white text-brand hover:bg-soft',
  ghost: 'text-navy hover:bg-soft',
};

export function Button({ as: Tag = 'button', variant = 'primary', className = '', ...props }) {
  const extra = Tag === 'button' && !props.type ? { type: 'button' } : {};
  return (
    <Tag
      className={`inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-control px-5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${BUTTON_STYLES[variant] || BUTTON_STYLES.primary} ${className}`}
      {...extra}
      {...props}
    />
  );
}

const BADGE_TONES = {
  brand: 'bg-soft text-brand',
  ok: 'bg-ok-bg text-ok',
  warn: 'bg-warn-bg text-warn',
  bad: 'bg-bad-bg text-bad',
};

export function Badge({ tone = 'brand', className = '', children }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider ${BADGE_TONES[tone] || BADGE_TONES.brand} ${className}`}>
      {children}
    </span>
  );
}

export function Card({ className = '', ...props }) {
  return <div className={`rounded-card border border-line bg-white p-5 ${className}`} {...props} />;
}

export function Spinner() {
  return (
    <span
      role="status"
      aria-label="Loading"
      className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-line border-t-brand"
    />
  );
}

export function EmptyState({ title, text, action }) {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-3xl font-extrabold tracking-tight text-navy">{title}</h1>
      {text && <p className="mt-3 text-base leading-relaxed text-muted">{text}</p>}
      {action && <div className="mt-6">{action}</div>}
    </section>
  );
}
