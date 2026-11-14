import React, { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { designTokens } from './design-tokens';
import { Command } from 'lucide-react';

/**
 * CommandPalette Component
 * Unified command palette with fuzzy search and keyboard navigation
 */

const overlayStyles = `
  fixed inset-0 z-[9999]
  flex items-start justify-center
  pt-16
  bg-neutral-900/60 backdrop-blur-sm
`;

const panelStyles = `
  w-full max-w-2xl
  bg-white rounded-2xl shadow-2xl border border-border-light
  overflow-hidden
  animate-slide-down
`;

const headerStyles = `
  flex items-center gap-3
  px-6 py-4
  border-b border-border-light
`;

const searchStyles = `
  flex-1
  w-full px-4 py-3
  text-base text-neutral-900
  bg-neutral-50 border border-border-medium rounded-lg
  focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500
  placeholder:text-neutral-400
`;

const shortcutStyles = `
  flex items-center gap-2
  px-2 py-1
  text-xs font-mono text-neutral-400 bg-neutral-100 rounded
`;

const listStyles = `
  max-h-96 overflow-y-auto
`;

const itemStyles = `
  flex items-center gap-3
  px-4 py-3
  text-left
  hover:bg-neutral-50
  cursor-pointer
  transition-colors duration-150
`;

const itemSelectedStyles = `
  bg-brand-50
`;

const iconStyles = `
  flex-shrink-0 w-5 h-5 text-neutral-400
`;

const labelStyles = `
  flex-1 min-w-0
`;

const titleStyles = `
  font-medium text-neutral-900 truncate
`;

const descriptionStyles = `
  text-sm text-neutral-500 truncate
`;

const shortcutLabelStyles = `
  text-xs font-mono text-neutral-400 ml-auto
`;

const sectionStyles = `
  px-4 py-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-neutral-500 bg-neutral-50 border-b border-border-light
`;

const emptyStyles = `
  py-8 text-center text-neutral-500
`;

const footerStyles = `
  px-4 py-3 border-t border-border-light
  text-xs text-neutral-500 text-center
`;

export function CommandPalette({
  isOpen,
  onClose,
  items = [],
  placeholder = 'Type a command or search...',
  className = '',
  onSubmit,
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef(null);

  const filteredItems = useMemo(() => {
    if (!query.trim()) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(item =>
      item.label.toLowerCase().includes(lowerQuery) ||
      item.description?.toLowerCase().includes(lowerQuery) ||
      item.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
    );
  }, [items, query]);

  const selectedItem = filteredItems[selectedIndex];

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'Escape':
        onClose();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedItem) {
          selectedItem.onSelect?.();
          onClose();
        }
        break;
      case 'Home':
        e.preventDefault();
        setSelectedIndex(0);
        break;
      case 'End':
        e.preventDefault();
        setSelectedIndex(filteredItems.length - 1);
        break;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // This would be handled by parent component
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedItem && listRef.current) {
      const element = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      element?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex, filteredItems]);

  const handleItemClick = (item) => {
    item.onSelect?.();
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className={overlayStyles} onClick={onClose}>
      <div
        className={`${panelStyles} ${className}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
      >
        <header className={headerStyles}>
          <Command className="w-5 h-5 text-neutral-400" aria-hidden="true" />
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={searchStyles}
            autoFocus
            aria-label="Search commands"
          />
          <kbd className={shortcutStyles}>
            <span>⌘</span>K
          </kbd>
        </header>

        <div className={listStyles} ref={listRef} role="listbox" aria-label="Commands">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-neutral-500">
              No commands found
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                role="option"
                aria-selected={index === selectedIndex}
                onClick={() => { item.onSelect?.(); onClose(); }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`
                  ${itemStyles}
                  ${index === selectedIndex ? itemSelectedStyles : ''}
                `}
                data-index={index}
              >
                {item.icon && <span className={iconStyles} aria-hidden="true">{item.icon}</span>}
                <div className={labelStyles}>
                  <div className={titleStyles}>{item.label}</div>
                  {item.description && <div className={descriptionStyles}>{item.description}</div>}
                </div>
                {item.shortcut && <span className={shortcutLabelStyles}>{item.shortcut}</span>}
              </button>
            ))) }
        </div>

        <footer className={footerStyles}>
          <kbd className="px-2 py-1 text-neutral-400 bg-neutral-100 rounded">↑</kbd>
          <span className="text-neutral-500">Navigate</span>
          <kbd className="px-2 py-1 text-neutral-400 bg-neutral-100 rounded">⏎</kbd>
          <span className="text-neutral-500">Select</span>
          <kbd className="px-2 py-1 text-neutral-400 bg-neutral-100 rounded">Esc</kbd>
          <span className="text-neutral-500">Close</span>
        </footer>
      </div>
    </div>,
    document.body
  );
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close, setIsOpen };
}

export default CommandPalette;
