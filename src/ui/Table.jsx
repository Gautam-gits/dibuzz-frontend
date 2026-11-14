import React, { useState, useMemo } from 'react';
import { designTokens } from './design-tokens';
import { Button } from './Button';
import { Badge } from './Badge';
import { Input } from './Input';
import { Select } from './Input';

/**
 * Table Component
 * Unified table system with sorting, filtering, pagination, and row actions
 */

const baseTableStyles = `
  w-full
  text-left
  text-sm
`;

const headerStyles = `
  bg-neutral-50 border-b border-border-medium
  text-[10px] font-bold uppercase tracking-wider text-neutral-500
`;

const rowStyles = `
  border-b border-border-light
  hover:bg-neutral-50
  transition-colors duration-150
`;

const cellStyles = `
  px-4 py-3
`;

const emptyStyles = `
  py-12 text-center text-neutral-500
`;

export function Table({
  columns = [],
  data = [],
  keyField = 'id',
  sortable = true,
  filterable = true,
  pagination = true,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  selection = false,
  onSelectionChange,
  selectedRows = [],
  actions,
  emptyMessage = 'No data available',
  loading = false,
  className = '',
  striped = true,
  hoverable = true,
  dense = false,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  // Derived data
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

  const handleSort = (key) => {
    if (!sortable) return;
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSelectAll = (checked) => {
    const ids = paginatedData.map(row => row[keyField]);
    onSelectionChange?.(checked ? ids : []);
  };

  const handleRowSelect = (id, checked) => {
    onSelectionChange?.(
      checked
        ? [...selectedRows, id]
        : selectedRows.filter(id => id !== id)
    );
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const [pageSize, setPageSize] = useState(initialPageSize);

  if (loading) {
    return (
      <div className="relative overflow-x-auto">
        <table className={`${baseTableStyles} ${className}`}>
          <thead>
            <tr className={headerStyles}>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3">
                  <div className="animate-pulse h-4 bg-neutral-200 rounded w-24"></div>
                </th>
              ))}
              {actions && <th className="px-4 py-3"><div className="animate-pulse h-4 bg-neutral-200 rounded w-20"></div></th>}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className={rowStyles}>
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3">
                    <div className="animate-pulse h-4 bg-neutral-200 rounded w-full"></div>
                  </td>
                ))}
                {actions && <td className="px-4 py-3"><div className="animate-pulse h-4 bg-neutral-200 rounded w-20"></div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (filteredData.length === 0) {
    return (
      <div className={`overflow-x-auto ${className}`}>
        <table className={`${baseTableStyles} w-full`}>
          <thead>
            <tr className={headerStyles}>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3">
                  {filterable && col.filterable !== false && (
                    <Input
                      size="sm"
                      placeholder={`Filter ${col.header}`}
                      value={filters[col.key] || ''}
                      onChange={(e) => handleFilterChange(col.key, e.target.value)}
                      className="mt-1"
                    />
                  )}
                  <div className="flex items-center gap-1">
                    {col.header}
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
                </th>
              ))}
              {actions && <th className="px-4 py-3"></th>}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className={emptyStyles}>
                {emptyMessage}
              </td>
            </tr>
          </tbody>
        </table>
        {pagination && filteredData.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            totalItems={filteredData.length}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className={`${baseTableStyles} w-full`}>
        <thead>
          <tr className={headerStyles}>
            {selection && (
              <th className="px-4 py-3 w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                  indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedData.length}
                  onChange={handleSelectAll}
                  className="h-4 w-4 rounded border-border-medium text-brand-500 focus:ring-2 focus:ring-brand-500"
                />
              </th>
            )}
            {columns.map(col => (
              <th key={col.key} className={`px-4 py-3 ${cellStyles}`}>
                <div className="flex items-center gap-1">
                  {col.header}
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
                    key={`filter-${col.key}`}
                    size="sm"
                    placeholder={`Filter ${col.header}`}
                    value={filters[col.key] || ''}
                    onChange={(e) => handleFilterChange(col.key, e.target.value)}
                    className="mt-1 w-36"
                  />
                )}
              </th>
            ))}
            {actions && <th className={`px-4 py-3 ${cellStyles}`}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, rowIndex) => (
            <tr key={row[keyField]} className={`${rowStyles} ${striped && rowIndex % 2 === 1 ? 'bg-neutral-50' : ''}`}>
              {selection && (
                <td className={cellStyles}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(row[keyField])}
                    onChange={(e) => handleRowSelect(row[keyField], e.target.checked)}
                    className="h-4 w-4 rounded border-border-medium text-brand-500 focus:ring-2 focus:ring-brand-500"
                  />
                </td>
              )}
              {columns.map(col => (
                <td key={col.key} className={cellStyles}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className={cellStyles}>
                  <div className="flex items-center gap-2">
                    {actions.map((action, i) => (
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          pageSize={pageSize}
          onPageSizeChange={handlePageSizeChange}
          totalItems={filteredData.length}
        />
      )}
      </div>
    );
}

// Pagination sub-component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}) {
  const pages = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages = [1];
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-4 px-4 py-3 border-t border-border-light">
      <div className="flex items-center gap-2 text-sm text-neutral-600">
        <span>Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems}</span>
        <Select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          options={[
            { value: 10, label: '10' },
            { value: 25, label: '25' },
            { value: 50, label: '50' },
            { value: 100, label: '100' },
          ]}
          size="sm"
          className="w-24"
        />
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 rounded-lg hover:bg-neutral-100"
          aria-label="First page"
        >
          ««
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 rounded-lg hover:bg-neutral-100"
          aria-label="Previous page"
        >
          «
        </button>
        {pages.map(page => (
          page === '...' ? (
            <span key="ellipsis" className="px-2 text-neutral-400">...</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-brand-500 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              {page}
            </button>
          ))) }
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 rounded-lg hover:bg-neutral-100"
          aria-label="Next page"
        >
          »
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 rounded-lg hover:bg-neutral-100"
          aria-label="Last page"
        >
          »»
        </button>
      </div>
    </div>
  );
}

export default Table;
