import React, { useState, useRef, useEffect } from 'react';
import { designTokens } from './design-tokens';

/**
 * TreeView Component
 * Unified tree view with checkboxes, expansion, and drag-drop support
 */

const containerStyles = `
  bg-white border border-border-light rounded-xl overflow-hidden
`;

const itemStyles = `
  border-b border-border-light
  last:border-b-0
`;

const rowStyles = `
  flex items-center gap-2
  px-4 py-3
  hover:bg-neutral-50
  transition-colors duration-150
`;

const indentStyles = (level) => `pl-${4 + level * 4}`;

const checkboxStyles = `
  h-4 w-4
  border-border-medium
  text-brand-500
  focus:ring-2 focus:ring-brand-500 focus:ring-offset-2
  cursor-pointer
`;

const labelStyles = `
  flex-1 text-sm font-medium text-neutral-700 cursor-pointer
  truncate
`;

const iconStyles = `
  flex-shrink-0 w-5 h-5 text-neutral-400
`;

const childrenStyles = `
  border-l-2 border-border-light ml-6
`;

const expandIconStyles = `
  w-5 h-5 text-neutral-400
  transition-transform duration-200
`;

export function TreeView({
  nodes = [],
  selected = [],
  onSelect,
  expanded = [],
  onExpand,
  showCheckboxes = true,
  showIcons = true,
  disabled = false,
  className = '',
  ...props
}) {
  const [internalExpanded, setInternalExpanded] = useState(expanded);

  const isExpanded = (id) => expanded.includes(id) || internalExpanded.includes(id);
  const isSelected = (id) => selected.includes(id);

  const handleToggleExpand = (id) => {
    if (isExpanded(id)) {
      setInternalExpanded(prev => prev.filter(e => e !== id));
      onExpand?.(internalExpanded.filter(e => e !== id));
    } else {
      setInternalExpanded(prev => [...prev, id]);
      onExpand?.([...internalExpanded, id]);
    }
  };

  const handleSelect = (id) => {
    if (isSelected(id)) {
      onSelect?.(selected.filter(s => s !== id));
    } else {
      onSelect?.([...selected, id]);
    }
  };

  const renderNode = (node, level = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const expanded = isExpanded(node.id);
    const selected = isSelected(node.id);

    return (
      <div key={node.id} className={itemStyles}>
        <div className={`${rowStyles} ${indentStyles(level)}`}>
          {showCheckboxes && (
            <input
              type="checkbox"
              checked={selected}
              onChange={() => handleSelect(node.id)}
              disabled={disabled}
              className={checkboxStyles}
              aria-label={`Select ${node.label}`}
            />
          )}
          {showIcons && node.icon && (
            <span className={iconStyles} aria-hidden="true">{node.icon}</span>
          )}
          {hasChildren && (
            <button
              type="button"
              onClick={() => handleToggleExpand(node.id)}
              className={expandIconStyles}
              aria-expanded={expanded}
              aria-controls={`tree-children-${node.id}`}
            >
              <svg className={`w-5 h-5 ${expanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <span
            className={`${labelStyles} ${selected ? 'text-brand-600 font-semibold' : ''}`}
            onClick={() => !disabled && handleSelect(node.id)}
          >
            {node.label}
          </span>
          {node.badge && (
            <span className="px-2 py-0.5 text-xs font-semibold text-brand-700 bg-brand-50 rounded-full">
              {node.badge}
            </span>
          )}
        </div>
        {hasChildren && expanded && (
          <div id={`tree-children-${node.id}`} className={childrenStyles} role="group" aria-label={`${node.label} children`}>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`${containerStyles} ${className}`} {...props} role="tree" aria-label="Tree view">
      {nodes.map(node => renderNode(node))}
    </div>
  );
}

export default TreeView;