import React, { useState } from 'react';
import { X, UploadCloud } from "lucide-react";
import toast from 'react-hot-toast';
import en from "../../locales/en.json";

interface ImageUploaderProps {
  label?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  previewUrl?: string | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = "Image",
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  previewUrl: initialPreviewUrl,
  onFileSelect,
  error
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl || null);

  // Sync with prop changes (e.g. form reset)
  React.useEffect(() => {
    setPreviewUrl(initialPreviewUrl || null);
  }, [initialPreviewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!acceptedFormats.includes(file.type)) {
        toast.error("Invalid file format");
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSizeMB}MB`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    }
  };

  const removeImage = () => {
    setPreviewUrl(null);
    onFileSelect(null);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-description font-medium text-foreground">{label}</label>}
      {previewUrl ? (
        <div className="relative w-32 h-32 rounded-lg border border-border overflow-hidden group bg-input flex items-center justify-center">
          <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={removeImage}
              className="p-1.5 bg-error text-white rounded-full hover:bg-error/80 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-input/50 hover:bg-input transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground hover:text-foreground transition-colors text-center">
            <UploadCloud className="w-8 h-8 text-muted-foreground/50 mb-2 group-hover:text-primary transition-colors" />
            <p className="text-description font-semibold">{en.common.upload.title}</p>
            <p className="text-caption mt-1 text-muted-foreground/70">{en.common.upload.allowed}: {acceptedFormats.map(f => f.split('/')[1].toUpperCase()).join(', ')} ({en.common.upload.max} {maxSizeMB}MB)</p>
          </div>
          <input type="file" className="hidden" accept={acceptedFormats.join(',')} onChange={handleFileChange} />
        </label>
      )}
      {error && <p className="text-caption text-error">{error}</p>}
    </div>
  );
};
