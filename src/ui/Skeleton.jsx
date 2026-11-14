import React from 'react';
import { designTokens } from './design-tokens';

/**
 * Skeleton Component
 * Unified skeleton loading placeholders
 */

const baseStyles = `
  animate-pulse
  bg-neutral-200
  rounded
`;

const variants = {
  text: (width = '100%', height = '1rem') => (
    <div className={baseStyles} style={{ width, height }} />
  ),
  circular: (size = '3rem') => (
    <div className={`${baseStyles} rounded-full`} style={{ width: size, height: size }} />
  ),
  rectangular: (width = '100%', height = '4rem') => (
    <div className={`${baseStyles} rounded-lg`} style={{ width, height }} />
  ),
  card: (width = '100%') => (
    <div className="space-y-4 animate-pulse" style={{ width }}>
      <div className="h-6 bg-neutral-200 rounded w-3/4" />
      <div className="h-4 bg-neutral-200 rounded w-full" />
      <div className="h-4 bg-neutral-200 rounded w-5/6" />
      <div className="mt-4 h-8 bg-neutral-200 rounded w-1/3" />
    </div>
  ),
  avatar: (size = '4rem') => (
    <div className={`${baseStyles} rounded-full`} style={{ width: size, height: size }} />
  ),
  button: (width = '8rem', height = '2.5rem') => (
    <div className={`${baseStyles} rounded-control`} style={{ width, height }} />
  ),
  input: (width = '100%', height = '2.5rem') => (
    <div className={`${baseStyles} rounded-control`} style={{ width, height }} />
  ),
  table: (rows = 5, columns = 4) => (
    <div className="animate-pulse">
      <div className="space-y-3">
        {/* Header */}
        <div className="grid gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-neutral-200 rounded w-1/3" />
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, row) => (
          <div key={row} className="grid gap-4 mt-4">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="h-4 bg-neutral-200 rounded" style={{ width: i === 0 ? '40%' : '80%' }} />
            ))}
          </div>
        ))}
      </div>
    </div>
    ),
  list: (items = 5) => (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-neutral-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
            <div className="h-3 bg-neutral-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  ),
  image: (aspectRatio = '16/9') => (
    <div className={`${baseStyles} relative`} style={{ aspectRatio }}>
      <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 bg-[length:200%_100%] animate-shimmer" />
    </div>
  ),
  video: () => (
    <div className="animate-pulse aspect-video">
      <div className="w-full h-full bg-neutral-200 rounded-xl animate-pulse" />
    </div>
  ),
  comment: () => (
    <div className="animate-pulse space-y-3">
      <div className="flex gap-3">
        <div className="w-10 h-10 rounded-full bg-neutral-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-neutral-200 rounded w-1/4" />
          <div className="h-3 bg-neutral-200 rounded w-full" />
          <div className="h-3 bg-neutral-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  ),
  profile: () => (
    <div className="animate-pulse space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-neutral-200" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-neutral-200 rounded w-1/2" />
          <div className="h-4 bg-neutral-200 rounded w-1/3" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-neutral-200 rounded-lg" />
        ))}
      </div>
    </div>
  ),
  dashboard: () => (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-neutral-200 rounded w-1/3" />
        <div className="h-8 bg-neutral-200 rounded w-1/4" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-neutral-200 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-neutral-200 rounded-xl" />
    </div>
  ),
};

export function Skeleton({
  variant = 'text',
  width = '100%',
  height,
  className = '',
  count = 1,
  ...props
}) {
  const Variant = variants[variant] || variants.text;

  if (variant === 'list' || variant === 'table' || variant === 'card' || variant === 'avatar' || variant === 'button' || variant === 'input') {
    return (
      <div className={className} {...props}>
        {Variant({ width, height, count })}
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      {Variant({ width, height })}
    </div>
  );
}

// Page-level skeleton compositions
export const PageSkeletons = {
  dashboard: () => (
    <div className="animate-pulse space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-neutral-200 rounded w-1/3" />
        <div className="h-8 bg-neutral-200 rounded w-1/4" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-neutral-200 rounded-xl" />
        ))}
      </div>
      <div className="h-64 bg-neutral-200 rounded-xl" />
    </div>
  ),

  profile: () => (
    <div className="animate-pulse space-y-4 max-w-xl mx-auto p-6">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-neutral-200" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-neutral-200 rounded w-1/2" />
          <div className="h-4 bg-neutral-200 rounded w-1/3" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-neutral-200 rounded-lg" />
        ))}
      </div>
    </div>
  ),

  learning: () => (
    <div className="animate-pulse space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 bg-neutral-200 rounded w-1/3" />
          <div className="h-4 bg-neutral-200 rounded w-1/4 mt-1" />
        </div>
        <div className="h-8 bg-neutral-200 rounded w-1/4" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="grid overflow-hidden rounded-xl border border-neutral-200 bg-white md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            <div className="relative min-h-44 bg-gradient-to-br from-neutral-200 to-neutral-100" />
            <div className="p-6 sm:p-8 space-y-4">
              <div className="h-5 bg-neutral-200 rounded w-1/3" />
              <div className="h-8 bg-neutral-200 rounded w-full" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-2.5 bg-neutral-200 rounded-full w-full" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  certificates: () => (
    <div className="animate-pulse space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-neutral-200 rounded w-1/3" />
          <div className="h-4 bg-neutral-200 rounded w-1/2 mt-1" />
        </div>
        <div className="h-8 bg-neutral-200 rounded w-1/4" />
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex flex-col h-full bg-white border border-neutral-200 rounded-xl p-5 shadow-sm">
            <div className="flex h-10 items-center justify-between">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200" />
              <div className="h-5 bg-neutral-200 rounded-full w-16" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-5 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
            </div>
            <div className="mt-6 w-full h-10 bg-neutral-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  ),

  adminPrograms: () => (
    <div className="animate-pulse space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-6 bg-neutral-200 rounded w-1/3" />
          <div className="h-4 bg-neutral-200 rounded w-1/2 mt-1" />
        </div>
        <div className="h-10 bg-neutral-200 rounded w-1/3" />
      </div>
      <div className="grid gap-3 rounded-xl border border-neutral-200 bg-white p-4 md:grid-cols-[1fr_auto_auto]">
        <div className="animate-pulse h-10 bg-neutral-200 rounded w-full" />
        <div className="animate-pulse h-10 bg-neutral-200 rounded w-32" />
        <div className="animate-pulse h-10 bg-neutral-200 rounded w-32" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="flex gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap gap-2">
                  <div className="h-4 bg-neutral-200 rounded-full w-16" />
                </div>
                <div className="mt-2 h-6 bg-neutral-200 rounded w-3/4" />
                <div className="mt-1 h-3 bg-neutral-200 rounded w-1/2" />
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <div className="h-8 bg-neutral-200 rounded-full w-20" />
              <div className="h-8 bg-neutral-200 rounded-full w-20" />
              <div className="h-8 bg-neutral-200 rounded-full w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export default Skeleton;
