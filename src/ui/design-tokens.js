/**
 * DIBUZZ Design Tokens
 * Single source of truth for all design decisions
 * Import from '@/ui/design-tokens' or '@/ui'
 */

export const colors = {
  // Brand colors
  brand: {
    50: '#EAF2FD',
    100: '#D4E4FA',
    200: '#A8C8F4',
    300: '#7CAEF0',
    400: '#4F94EC',
    500: '#0A6FD6',    // Primary brand
    600: '#0859AB',
    700: '#064380',
    800: '#042D55',
    900: '#02162A',
  },

  // Semantic colors
  semantic: {
    success: {
      light: '#ECFDF5',
      main: '#0F7A55',
      dark: '#064E2E',
      onMain: '#FFFFFF',
    },
    warning: {
      light: '#FFFAEB',
      main: '#B54708',
      dark: '#7A2E0E',
      onMain: '#FFFFFF',
    },
    error: {
      light: '#FEF3F2',
      main: '#B42318',
      dark: '#7B1A13',
      onMain: '#FFFFFF',
    },
    info: {
      light: '#EFF8FF',
      main: '#1D65A6',
      dark: '#103D6E',
      onMain: '#FFFFFF',
    },
  },

  // Neutral colors
  neutral: {
    0: '#FFFFFF',
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },

  // Surface colors
  surface: {
    primary: '#FFFFFF',
    secondary: '#F8FAFC',
    tertiary: '#F1F5F9',
    inverted: '#0F172A',
  },

  // Text colors
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    tertiary: '#94A3B8',
    inverted: '#FFFFFF',
    link: '#0A6FD6',
    linkHover: '#0859AB',
  },

  // Border colors
  border: {
    light: '#E2E8F0',
    medium: '#CBD5E1',
    dark: '#94A3B8',
    focus: '#0A6FD6',
    error: '#B42318',
  },

  // Overlay
  overlay: {
    light: 'rgba(15, 23, 42, 0.3)',
    medium: 'rgba(15, 23, 42, 0.5)',
    heavy: 'rgba(15, 23, 42, 0.7)',
  },
};

export const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px,
};

export const typography = {
  fontFamilies: {
    sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
    heading: ['Outfit', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },

  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },

  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },

  lineHeights: {
    tight: 1.1,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
  card: '1.25rem',  // 20px - for cards
  control: '0.75rem', // 12px - for buttons, inputs
};

export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  focus: '0 0 0 3px rgb(10 111 214 / 0.4)',
  focusError: '0 0 0 3px rgb(180 35 24 / 0.4)',
};

export const transitions = {
  fast: '150ms ease',
  normal: '200ms ease',
  slow: '300ms ease',
  slower: '500ms ease',
  spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
}

export const zIndex = {
  hide: -1,
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modalBackdrop: 400,
  modal: 500,
  popover: 600,
  tooltip: 700,
  toast: 800,
  max: 9999,
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const container = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
  full: '100%',
};

export const iconSizes = {
  xs: '0.75rem',   // 12px
  sm: '1rem',      // 16px
  md: '1.25rem',   // 20px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '2.5rem', // 40px
  '3xl': '3rem',   // 48px
};

export const componentSizes = {
  // Button heights
  button: {
    sm: '2rem',      // 32px
    md: '2.5rem',    // 40px
    lg: '3rem',      // 48px
    xl: '3.5rem',    // 56px
  },
  // Input heights
  input: {
    sm: '2rem',      // 32px
    md: '2.5rem',    // 40px
    lg: '3rem',      // 48px
  },
  // Modal widths
  modal: {
    sm: '20rem',     // 320px
    md: '28rem',     // 448px
    lg: '32rem',     // 512px
    xl: '48rem',     // 768px
    xl: '64rem',     // 1024px
    full: '100%',
  },
  // Sidebar widths
  sidebar: {
    collapsed: '4rem',    // 64px
    expanded: '16rem',    // 256px
  },
};

export const animation = {
  durations: {
    fast: '100ms',
    normal: '200ms',
    slow: '300ms',
  },
  easings: {
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

export const focusRing = {
  default: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
  error: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-error-500 focus-visible:ring-offset-2',
  inset: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset',
};

// Export all tokens as a single object for convenience
export const tokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  zIndex,
  breakpoints,
  container,
  iconSizes,
  componentSizes,
  animation,
  focusRing,
};

// Backwards-compatible name used by the component library.
export const designTokens = tokens;

export default tokens;
