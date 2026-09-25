"use client";

import React from "react"

import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Upload,
  Check,
  X,
  FileText,
  ImageIcon,
  CreditCard,
  Home,
  Zap,
  FileSpreadsheet,
  Receipt,
} from "lucide-react";

interface DocumentUploadCardProps {
  title: string;
  description: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  file: File | null;
  required?: boolean;
  icon?: "id" | "property" | "utility" | "quotation" | "receipt";
}

const iconMap = {
  id: CreditCard,
  property: Home,
  utility: Zap,
  quotation: FileSpreadsheet,
  receipt: Receipt,
};

export function DocumentUploadCard({
  title,
  description,
  accept = "image/*,.pdf",
  onFileSelect,
  file,
  required = true,
  icon = "id",
}: DocumentUploadCardProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const IconComponent = iconMap[icon];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        onFileSelect(droppedFile);
      }
    },
    [onFileSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    onFileSelect(selectedFile);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const isImage = file?.type.startsWith("image/");
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl transition-all duration-300",
        file
          ? "bg-primary/5 border-2 border-primary/30"
          : isDragOver
            ? "bg-primary/10 border-2 border-primary border-dashed"
            : "bg-card border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="sr-only"
        id={`upload-${title.replace(/\s+/g, "-").toLowerCase()}`}
      />

      {file ? (
        <div className="p-5">
          <div className="flex items-start gap-4">
            {/* Success Icon */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                {isImage ? (
                  <ImageIcon className="w-5 h-5 text-primary" />
                ) : (
                  <FileText className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{title}</p>
                  <p className="text-sm text-primary font-medium truncate mt-0.5">
                    {file.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatFileSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="flex-shrink-0 w-8 h-8 rounded-lg bg-muted hover:bg-destructive/10 flex items-center justify-center transition-colors group/btn"
                  aria-label="Remove file"
                >
                  <X className="w-4 h-4 text-muted-foreground group-hover/btn:text-destructive transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={`upload-${title.replace(/\s+/g, "-").toLowerCase()}`}
          className="block cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
                  isDragOver || isHovered
                    ? "bg-primary/10"
                    : "bg-muted"
                )}
              >
                <IconComponent
                  className={cn(
                    "w-5 h-5 transition-colors duration-300",
                    isDragOver || isHovered
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{title}</p>
                  {required && (
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {description}
                </p>
              </div>
            </div>

            {/* Upload Area */}
            <div
              className={cn(
                "mt-4 rounded-lg border-2 border-dashed p-4 text-center transition-all duration-300",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-border group-hover:border-primary/30"
              )}
            >
              <Upload
                className={cn(
                  "w-5 h-5 mx-auto mb-2 transition-colors duration-300",
                  isDragOver ? "text-primary" : "text-muted-foreground"
                )}
              />
              <p className="text-sm">
                <span className="font-medium text-primary">Click to upload</span>
                <span className="text-muted-foreground"> or drag and drop</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG or PDF up to 10MB
              </p>
            </div>
          </div>
        </label>
      )}
    </div>
  );
}
