import React, { useState, useRef, useCallback } from 'react';
import { designTokens } from './design-tokens';
import { Button } from './Button';
import { Progress } from './Progress';
import { FileText, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * FileUpload Component
 * Unified file upload with drag-drop, preview, and progress
 */

const dropzoneStyles = `
  relative
  border-2 border-dashed border-border-medium
  rounded-xl
  p-8
  text-center
  transition-all duration-200
  cursor-pointer
`;

const dropzoneActiveStyles = `
  border-brand-500 bg-brand-50
`;

const dropzoneDisabledStyles = `
  opacity-50 cursor-not-allowed
`;

const fileItemStyles = `
  flex items-center gap-3
  p-3
  bg-white border border-border-light rounded-lg
  animate-slide-in
`;

const fileInfoStyles = `
  flex-1 min-w-0
`;

const fileNameStyles = `
  font-medium text-neutral-900 truncate
`;

const fileSizeStyles = `
  text-sm text-neutral-500
`;

const progressStyles = `
  mt-2 h-1.5 bg-neutral-200 rounded-full overflow-hidden
`;

const actionStyles = `
  flex items-center gap-2
`;

export function FileUpload({
  label,
  accept = '*/*',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 10,
  onChange,
  onRemove,
  value = [],
  error,
  disabled = false,
  className = '',
  showPreview = true,
  uploadAction,
  ...props
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState(value);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (file) => {
    if (maxSize && file.size > maxSize) {
      return `File "${file.name}" exceeds maximum size of ${formatSize(maxSize)}`;
    }
    if (accept !== '*/*' && !accept.split(',').some(type => file.type.match(type.replace('*', '.*')))) {
      return `File "${file.name}" is not an accepted file type`;
    }
    return null;
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragActive(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [disabled]);

  const handleFileSelect = useCallback((e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
    e.target.value = '';
  }, []);

  const handleFiles = useCallback((newFiles) => {
    const validFiles = [];
    const errors = [];

    for (const file of newFiles) {
      const validationError = validateFile(file);
      if (validationError) {
        errors.push(validationError);
      } else if (files.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      // Could trigger toast notifications here
      console.warn(errors.join(', '));
    }

    if (validFiles.length > 0) {
      const newFiles = [...files, ...validFiles].slice(0, maxFiles);
      setFiles(newFiles);
      onChange?.(newFiles);
    }
  }, [files, maxFiles, onChange]);

  const removeFile = useCallback((index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onChange?.(newFiles);
    onRemove?.(files[index]);
  }, [files, onChange, onRemove]);

  const startUpload = useCallback(async () => {
    if (!uploadAction || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      setUploadProgress(prev => ({ ...prev, [i]: 0 }));

      try {
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({ ...prev, [i]: progress }));
        }

        await uploadAction(files[i]);
        setUploadProgress(prev => ({ ...prev, [i]: 100 }));
      } catch (err) {
        setUploadProgress(prev => ({ ...prev, [i]: -1 }));
      }
    }

    setUploadProgress({});
  }, [files, uploadAction]);

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) return (
      <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    );
    if (file.type.startsWith('video/')) return (
      <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L9 12M19 12l-6 4v-8z" /></svg>
    );
    if (file.type.startsWith('audio/')) return (
      <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 18a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h14a2 2 0 002-2v-3" /></svg>
    );
    if (file.type.includes('pdf')) return (
      <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    );
    return (
      <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-neutral-700 mb-2">
          {label}
          {props.required && <span className="text-error-main ml-0.5" aria-hidden="true">*</span>}
        </label>
      )}

      <div
        ref={dropzoneRef}
        className={`
          ${dropzoneStyles}
          ${isDragActive ? dropzoneActiveStyles : ''}
          ${disabled ? dropzoneDisabledStyles : ''}
          ${className}
        `}
        onDragOver={handleDrag}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        role="button"
        tabIndex={disabled ? undefined : 0}
        onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !disabled) { e.preventDefault(); fileInputRef.current?.click(); }}}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="sr-only"
          disabled={disabled}
          aria-label="Upload files"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className="w-12 h-12 text-brand-500" />
          <div className="text-center">
            <p className="text-lg font-medium text-neutral-900">
              {files.length > 0 ? `${files.length} file${files.length > 1 ? 's' : ''} selected` : 'Drag & drop files here, or click to browse'}
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              {maxFiles > 1 ? `Up to ${maxFiles} files` : 'Single file'} • Max ${formatSize(maxSize)} each • {accept === '*/*' ? 'Any file type' : accept}
            </p>
          </div>

          {files.length > 0 && !showPreview && (
            <div className="w-full mt-4 space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon(file)}
                    <div>
                      <p className="font-medium text-neutral-900 truncate">{file.name}</p>
                      <p className="text-sm text-neutral-500">{formatSize(file.size)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {error && <p className="mt-2 text-sm text-error-main" role="alert">{error}</p>}
        </div>

        {(files.length > 0 || uploadProgress) && (
          <div className="mt-6 space-y-4">
            {files.map((file, index) => (
              <div key={index} className={fileItemStyles}>
                {getFileIcon(file)}
                <div className={fileInfoStyles}>
                  <p className={fileNameStyles} title={file.name}>{file.name}</p>
                  <p className={fileSizeStyles}>{formatSize(file.size)}</p>
                  {uploadProgress[index] !== undefined && (
                    <div className={progressStyles}>
                      <Progress
                        value={uploadProgress[index] >= 0 ? uploadProgress[index] : 0}
                        size="xs"
                        showValue={false}
                        variant={uploadProgress[index] === -1 ? 'error' : uploadProgress[index] === 100 ? 'success' : 'default'}
                      />
                    </div>
                  )}
                </div>
                <div className={actionStyles}>
                  {uploadProgress[index] === -1 && (
                    <Button variant="ghost" size="sm" onClick={() => { /* retry */ }}>
                      Retry
                    </Button>
                  )}
                  {uploadProgress[index] !== 100 && uploadProgress[index] !== -1 && (
                    <Button variant="ghost" size="sm" onClick={() => { /* cancel */ }}>
                      Cancel
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => removeFile(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && uploadAction && (
          <div className="mt-4 flex justify-end">
            <Button onClick={startUpload} disabled={Object.values(uploadProgress).some(p => p >= 0 && p < 100)}>
              {Object.values(uploadProgress).some(p => p >= 0 && p < 100) ? 'Uploading...' : 'Upload All'}
            </Button>
          </div>
        )}

        {props.children}
      </div>
    </div>
  );
}

const dropzoneRef = { current: null }; // Will be replaced by useRef in actual implementation

export default FileUpload;