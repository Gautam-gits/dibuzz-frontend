import React, { useState, useRef, useCallback } from 'react';
import { designTokens } from './design-tokens';
import { Button } from './Button';
import { Progress } from './Progress';
import { Image, Upload, X, CheckCircle2, AlertCircle, Eye } from 'lucide-react';

/**
 * ImageUploader Component
 * Specialized image uploader with preview, crop, and transformation
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

const previewStyles = `
  relative
  aspect-square
  overflow-hidden
  rounded-lg
  bg-neutral-100
`;

const imageStyles = `
  w-full h-full object-cover
`;

const overlayStyles = `
  absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity
`;

const actionButtonStyles = `
  p-2 rounded-lg bg-white/90 backdrop-blur text-neutral-600 hover:text-neutral-900 hover:bg-white transition-colors
`;

const fileItemStyles = `
  relative aspect-square overflow-hidden rounded-lg bg-neutral-100
`;

const progressStyles = `
  absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-200 rounded-b-lg overflow-hidden
`;

export function ImageUploader({
  label,
  accept = 'image/*',
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  maxFiles = 5,
  onChange,
  onRemove,
  value = [],
  error,
  disabled = false,
  className = '',
  showPreview = true,
  allowCrop = false,
  cropAspectRatio = 1,
  maxDimension = 2048,
  quality = 0.9,
  ...props
}) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [files, setFiles] = useState(value);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRef = useRef(null);
  const [editingIndex, setEditingIndex] = useState(-1);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateFile = (file) => {
    if (!file.type.startsWith('image/')) {
      return 'Only image files are allowed';
    }
    if (maxSize && file.size > maxSize) {
      return `Image "${file.name}" exceeds maximum size of ${formatSize(maxSize)}`;
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
        errors.push(`Maximum ${maxFiles} images allowed`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
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

  const openEditor = (index) => {
    setEditingIndex(index);
  };

  const closeEditor = () => {
    setEditingIndex(-1);
  };

  const rotateImage = (index, degrees = 90) => {
    // Would implement canvas-based rotation
    console.log('Rotate', index, degrees);
  };

  const flipImage = (index, direction = 'horizontal') => {
    // Would implement canvas-based flip
    console.log('Flip', index, direction);
  };

  const getImagePreview = (file) => URL.createObjectURL(file);

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
          aria-label="Upload images"
        />

        <div className="flex flex-col items-center gap-3">
          <Upload className="w-12 h-12 text-brand-500" />
          <div className="text-center">
            <p className="text-lg font-medium text-neutral-900">
              {files.length > 0 ? `${files.length} image${files.length > 1 ? 's' : ''} selected` : 'Drag & drop images here, or click to browse'}
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              {maxFiles > 1 ? `Up to ${maxFiles} images` : 'Single image'} • Max ${formatSize(maxSize)} each • JPG, PNG, WebP
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && showPreview && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {files.map((file, index) => (
            <div key={index} className={fileItemStyles}>
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={getImagePreview(file)}
                  alt={file.name}
                  className={imageStyles}
                />

                <div className={overlayStyles}>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); openEditor(index); }}
                    className={actionButtonStyles}
                    aria-label="Edit image"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                    className={actionButtonStyles}
                    aria-label="Remove image"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

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

              <div className="mt-2 space-y-1">
                <p className="text-xs font-medium text-neutral-900 truncate">{file.name}</p>
                <p className="text-xs text-neutral-500">{formatSize(file.size)}</p>
                {imageDimensions[file.name] && (
                  <p className="text-xs text-neutral-400">
                    {imageDimensions[file.name].width} × {imageDimensions[file.name].height}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && !showPreview && (
        <div className="mt-6 space-y-3">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden">
                  <img src={getImagePreview(file)} alt={file.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-neutral-900 truncate max-w-xs">{file.name}</p>
                  <p className="text-sm text-neutral-500">{formatSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {uploadProgress[index] !== undefined && (
                  <Progress
                    value={uploadProgress[index] >= 0 ? uploadProgress[index] : 0}
                    size="xs"
                    showValue={false}
                    variant={uploadProgress[index] === -1 ? 'error' : uploadProgress[index] === 100 ? 'success' : 'default'}
                  />
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

      {editingIndex >= 0 && (
        <ImageEditor
          file={files[editingIndex]}
          onClose={closeEditor}
          onSave={(editedFile) => {
            const newFiles = [...files];
            newFiles[editingIndex] = editedFile;
            setFiles(newFiles);
            onChange?.(newFiles);
            closeEditor();
          }}
          aspectRatio={cropAspectRatio}
          maxDimension={maxDimension}
          quality={quality}
        />
      )}

      {props.children}
    </div>
  );
}

const dropzoneRef = { current: null }; // Placeholder for useRef

export default ImageUploader;
