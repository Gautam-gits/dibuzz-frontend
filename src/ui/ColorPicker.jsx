import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';
import { Button } from './Button';

/**
 * ColorPicker Component
 * Unified color picker with multiple formats and formats
 */

const triggerStyles = `
  relative
  w-full
  rounded-control
  border-2 border-border-medium
  bg-white
  text-sm text-neutral-900
  transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
  disabled:bg-neutral-50 disabled:text-neutral-500 disabled:cursor-not-allowed
  overflow-hidden
`;

const dropdownStyles = `
  absolute z-[9999] mt-1
  w-64
  bg-white rounded-lg shadow-lg border border-border-light
  overflow-hidden
`;

const headerStyles = `
  flex items-center justify-between
  px-4 py-3
  border-b border-border-light
`;

const paletteStyles = `
  p-3
`;

const swatchStyles = `
  w-8 h-8 rounded-lg border-2 border-transparent
  cursor-pointer
  transition-all duration-150
  flex-shrink-0
`;

const swatchActiveStyles = `
  border-brand-500 ring-2 ring-brand-500/20
`;

const inputStyles = `
  w-full px-3 py-2
  text-sm text-neutral-900
  border border-border-medium rounded-lg
  focus:outline-none focus:ring-2 focus:ring-brand-500
  font-mono
`;

const formatStyles = `
  px-3 py-2 text-sm text-neutral-500 border-t border-border-light
`;

const colorFormats = [
  { key: 'hex', label: 'HEX', regex: /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/ },
  { key: 'rgb', label: 'RGB', regex: /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/ },
  { key: 'hsl', label: 'HSL', regex: /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/ },
];

const defaultColors = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E',
  '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E',
  '#FFFFFF', '#F8FAFC', '#F1F5F9', '#E2E8F0', '#CBD5E1', '#94A3B8',
  '#64748B', '#475569', '#334155', '#1E293B', '#0F172A', '#000000',
];

function hexToRgb(hex) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex.length === 3 ? cleanHex.split('').map(c => c + c).join('') : cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
}

function parseColor(str) {
  if (!str) return null;
  const clean = str.trim().toLowerCase();

  // Hex
  if (clean.startsWith('#')) {
    const rgb = hexToRgb(clean);
    return { r: rgb.r, g: rgb.g, b: rgb.b, format: 'hex' };
  }

  // RGB
  const rgbMatch = clean.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
  if (rgbMatch) {
    return { r: parseInt(rgbMatch[1]), g: parseInt(rgbMatch[2]), b: parseInt(rgbMatch[3]), format: 'rgb' };
  }

  // HSL
  const hslMatch = clean.match(/hsl\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*\)/);
  if (hslMatch) {
    const { r, g, b } = hslToRgb(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]));
    return { r, g, b, format: 'hsl' };
  }

  return null;
}

function formatColor(r, g, b, format) {
  switch (format) {
    case 'hex': return rgbToHex(r, g, b);
    case 'rgb': return `rgb(${r}, ${g}, ${b})`;
    case 'hsl': {
      const { h, s, l } = rgbToHsl(r, g, b);
      return `hsl(${h}, ${s}%, ${l}%)`;
    }
    default: return rgbToHex(r, g, b);
  }
}

export function ColorPicker({
  label,
  value = '#3B82F6',
  onChange,
  disabled = false,
  className = '',
  showAlpha = false,
  showFormats = true,
  showPalette = true,
  presetColors = defaultColors,
  'aria-label': ariaLabel,
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [color, setColor] = useState(value);
  const [format, setFormat] = useState('hex');
  const [alpha, setAlpha] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  // Parse initial color
  const parsed = parseColor(value);
  if (parsed) {
    setColor({ r: parsed.r, g: parsed.g, b: parsed.b, a: 1 });
  }

  const handleToggle = () => {
    if (!disabled) setShowDropdown(!showDropdown);
  };

  const handleClose = () => setShowDropdown(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target)) {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setShowDropdown(false);
        }
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const updateColor = (r, g, b, a = alpha) => {
    const newColor = { r, g, b, a };
    setColor(newColor);
    const formatted = formatColor(r, g, b, format);
    const finalValue = format === 'hex' ? formatted : format === 'rgb' ? `rgb(${r}, ${g}, ${b})` : `hsl(${r}, ${g}, ${b})`;
    onChange?.(finalValue);
  };

  const handlePaletteSelect = (hex) => {
    const rgb = hexToRgb(hex);
    updateColor(rgb.r, rgb.g, rgb.b);
    setShowDropdown(false);
  };

  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  const handleInputChange = (e) => {
    const parsed = parseColor(e.target.value);
    if (parsed) {
      updateColor(parsed.r, parsed.g, parsed.b);
    }
  };

  const currentHex = formatColor(color.r, color.g, color.b, 'hex');

  const triggerClassName = `
    ${triggerStyles}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const dropdownContent = showDropdown && (
    <div
      ref={dropdownRef}
      className={dropdownStyles}
      role="dialog"
      aria-label="Color picker"
    >
      {/* Current color preview */}
      <div className="p-4 border-b border-border-light">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-lg border-2 border-border-light overflow-hidden"
            style={{ background: `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})` }}
          />
          <div className="flex-1">
            <input
              type="text"
              value={formatColor(color.r, color.g, color.b, format)}
              onChange={handleInputChange}
              className={inputStyles}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Color palette */}
      {showPalette && (
        <div className={paletteStyles}>
          <div className="grid grid-cols-8 gap-2 mb-4">
            {presetColors.map(hex => (
              <button
                key={hex}
                type="button"
                onClick={() => handlePaletteSelect(hex)}
                className={`${swatchStyles} ${currentHex.toLowerCase() === hex.toLowerCase() ? swatchActiveStyles : ''}`}
                style={{ background: hex }}
                aria-label={hex}
              />
            ))}
          </div>
        </div>
      )}

      {/* Custom color input */}
      <div className="px-4 py-3 border-t border-border-light">
        <div className="mb-3">
          <label className="block text-xs font-medium text-neutral-700 mb-1">Custom Color</label>
          <input
            type="text"
            value={formatColor(color.r, color.g, color.b, format)}
            onChange={handleInputChange}
            className={inputStyles}
            disabled={disabled}
            placeholder="#RRGGBB"
          />
        </div>
      </div>

      {/* Format selector */}
      {showFormats && (
        <div className={formatStyles}>
          <select
            value={format}
            onChange={handleFormatChange}
            className="w-full px-3 py-2 text-sm border border-border-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            disabled={disabled}
          >
            {colorFormats.map(f => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Alpha slider */}
      {showAlpha && (
        <div className="px-4 py-3 border-t border-border-light">
          <label className="block text-xs font-medium text-neutral-700 mb-2">Opacity: {Math.round(alpha * 100)}%</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            className="w-full"
            disabled={disabled}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="px-4 py-3 border-t border-border-light flex justify-end gap-2">
        <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={handleClose}>Select</Button>
      </div>
    </div>
  );

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={showDropdown}
        aria-label={ariaLabel}
      >
        <div
          className="w-full h-10 rounded-control border-2 border-border-medium overflow-hidden flex items-center"
          style={{ background: `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})` }}
        >
          <span className="flex-1 text-center text-sm font-mono text-neutral-700">
            {formatColor(color.r, color.g, color.b, format)}
          </span>
        </div>
      </button>
      {showDropdown && createPortal(dropdownContent, document.body)}
    </div>
  );
}

export default ColorPicker;