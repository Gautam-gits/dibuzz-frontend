import React, { useState, useMemo, useCallback } from 'react';
import { designTokens } from './design-tokens';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Input';
import { Checkbox } from './Checkbox';
import { Badge } from './Badge';
import { Button as ButtonComponent } from './Button';

/**
 * DataGrid Component
 * Advanced data grid with sorting, filtering, grouping, and editing
 */

const containerStyles = `
  bg-white border border-border-light rounded-xl overflow-hidden
`;

const toolbarStyles = `
  flex flex-wrap items-center justify-between gap-4
  p-4 border-b border-border-light
`;

const searchStyles = `
  flex-1 max-w-md
`;

const columnStyles = `
  px-4 py-3
  text-left
  text-[10px] font-bold uppercase tracking-wider text-neutral-500
  bg-neutral-50 border-b border-border-light
  white-space-nowrap
`;

const cellStyles = `
  px-4 py-3
  text-sm text-neutral-900
  border-b border-border-light
`;

const rowStyles = `
  hover:bg-neutral-50
  transition-colors duration-150
`;

const paginationStyles = `
  flex flex-wrap items-center justify-between gap-4
  p-4 border-t border-border-light
`;

const actionStyles = `
  flex items-center gap-1
`;

export function DataGrid({
  columns = [],
  data = [],
  keyField = 'id',
  sortable = true,
  filterable = true,
  selectable = false,
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  toolbar,
  rowActions,
  bulkActions,
  selection = [],
  onSelectionChange,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  className = '',
  striped = true,
  hoverable = true,
  dense = false,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply filters
    if (filterable) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          result = result.filter(row => {
            const cellValue = row[key];
            if (cellValue === null || cellValue === undefined) return false;
            return String(cellValue).toLowerCase().includes(String(value).toLowerCase());
          });
        }
      });
    }

    // Apply sorting
    if (sortable && sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        const comparison = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [data, filters, sortConfig, sortable, filterable]);

  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, pagination, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = useCallback((key) => {
    if (!sortable) return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, [sortable]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleSelectAll = useCallback((checked) => {
    const ids = paginatedData.map(row => row[keyField]);
    onSelectionChange?.(checked ? ids : []);
  }, [paginatedData, keyField, onSelectionChange]);

  const handleRowSelect = useCallback((id, checked) => {
    onSelectionChange?.(
      checked
        ? [...selection, id]
        : selection.filter(id => id !== id)
    );
  }, [selection, onSelectionChange]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  if (loading) {
    return (
      <div className={`${containerStyles} ${className}`}>
        <table className="w-full" role="grid">
          <thead>
            <tr className="bg-neutral-50 border-b border-border-light">
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3">
                  <div className="animate-pulse h-4 bg-neutral-200 rounded w-24"></div>
                </th>
              ))}
              {rowActions && <th className="px-4 py-3"><div className="animate-pulse h-4 bg-neutral-200 rounded w-20"></div></th>}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border-light">
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="animate-pulse h-4 bg-neutral-200 rounded w-full"></div>
                  </td>
                ))}
                {rowActions && <td className="px-4 py-3"><div className="animate-pulse h-4 bg-neutral-200 rounded w-20"></div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const selectedCount = selection.length;
  const allSelected = paginatedData.length > 0 && selection.length === paginatedData.length;
  const indeterminate = selection.length > 0 && selection.length < paginatedData.length;

  return (
    <div className={`${containerStyles} ${className}`}>
      {toolbar && (
        <div className={toolbarStyles}>
          <div className="flex flex-wrap items-center gap-4">
            {toolbar}
          </div>
          <div className="flex items-center gap-4">
            {filterable && columns.filter(c => c.filterable !== false).map(col => (
              <Input
                key={col.key}
                size="sm"
                placeholder={`Filter ${col.header}`}
                value={filters[col.key] || ''}
                onChange={(e) => handleFilterChange(col.key, e.target.value)}
                className="w-48"
              />
            ))}
            {selectable && bulkActions && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-600">{selectedCount} selected</span>
                {bulkActions.map((action, i) => (
                  <Button
                    key={i}
                    variant={action.variant || 'ghost'}
                    size="sm"
                    onClick={() => action.onClick(selection)}
                    disabled={selection.length === 0}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    <div className="overflow-x-auto">
      <table className="w-full" role="grid">
        <thead>
          <tr className="bg-neutral-50 border-b border-border-light">
            {selectable && (
              <th className="px-4 py-3 w-12">
                <Checkbox
                  checked={allSelected}
                  indeterminate={indeterminate}
                  onChange={handleSelectAll}
                  disabled={paginatedData.length === 0}
                />
              </th>
            )}
            {columns.map(col => (
              <th
                key={col.key}
                className={columnStyles}
                style={{ width: col.width }}
              >
                <div className="flex items-center gap-1">
                  <span>{col.header}</span>
                  {sortable && col.sortable !== false && (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="p-1 text-neutral-400 hover:text-neutral-600"
                      aria-label={`Sort by ${col.header}`}
                    >
                      {sortConfig.key === col.key ? (
                        sortConfig.direction === 'asc' ? '▲' : '▼'
                      ) : (
                        '⇅'
                      )}
                    </button>
                  )}
                </div>
                {filterable && col.filterable !== false && (
                  <Input
                    size="sm"
                    placeholder={`Filter ${col.header}`}
                    value={filters[col.key] || ''}
                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                    className="mt-1 w-full"
                  />
                )}
              </th>
            ))}
            {rowActions && <th className={columnStyles}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={row[keyField]}
              className={`${rowStyles} ${striped && rowIndex % 2 === 1 ? 'bg-neutral-50' : ''}`}
              onClick={() => onRowClick?.(row)}
            >
              {selectable && (
                <td className="px-4 py-3 w-12">
                  <Checkbox
                    checked={selection.includes(row[keyField])}
                    onChange={(e) => handleRowSelect(row[keyField], e.target.checked)}
                  />
                </td>
              )}
              {columns.map(col => (
                <td key={col.key} className={cellStyles}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {rowActions && (
                <td className={cellStyles}>
                  <div className={actionStyles}>
                    {rowActions.map((action, i) => (
                      <Button
                        key={i}
                        variant={action.variant || 'ghost'}
                        size="sm"
                        onClick={() => action.onClick(row)}
                        disabled={action.disabled?.(row)}
                        className="gap-1"
                        leftIcon={action.icon}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className={paginationStyles}>
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <span>Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, filteredData.length)} of {filteredData.length}</span>
            <Select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              options={pageSizeOptions.map(opt => ({ value: opt, label: String(opt) }))}
              size="sm"
              className="w-24"
            />
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </Button>
            {pages.map(page => (
              page === '...' ? (
                <span key="ellipsis" className="px-2 text-neutral-400">...</span>
              ) : (
                <Button
                  key={page}
                  variant={page === currentPage ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className="w-8 h-8"
                >
                  {page}
                </Button>
              )
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7m-8 14l7 7-7 7" /></svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default DataGrid;
