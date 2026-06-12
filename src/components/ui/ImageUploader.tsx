import React, { useState } from 'react';
import { UploadCloud, Edit2 } from "lucide-react";
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import { resizeImage } from "../../utils/image";
import { ImageCropperModal } from './ImageCropperModal';

interface ImageUploaderProps {
  label?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  previewUrl?: string | null;
  onFileSelect: (file: File | null) => void;
  error?: string;
  previewClassName?: string;
  emptyClassName?: string;
  className?: string;
  compact?: boolean;
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label = "Image",
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  previewUrl: initialPreviewUrl,
  onFileSelect,
  error,
  previewClassName = "w-32 h-32",
  emptyClassName = "w-full h-32",
  className = "w-full",
  compact = false,
  aspectRatio = 1,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.8
}) => {
  const { t } = useTranslation();
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreviewUrl || null);
  
  // Cropper state
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  // Sync with prop changes (e.g. form reset)
  React.useEffect(() => {
    setPreviewUrl(initialPreviewUrl || null);
  }, [initialPreviewUrl]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!acceptedFormats.includes(file.type)) {
        toast.error(t("common.upload.invalidFormat", "Invalid file format"));
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(t("common.upload.sizeLimit", `File size must be less than ${maxSizeMB}MB`, { max: maxSizeMB }));
        return;
      }
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setRawImageSrc(reader.result?.toString() || null);
        setIsCropperOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsCropperOpen(false);
    setRawImageSrc(null);
    try {
      const resizedDataUrl = await resizeImage(croppedFile, maxWidth, maxHeight, quality);
      setPreviewUrl(resizedDataUrl);
      onFileSelect(croppedFile);
    } catch (err) {
      toast.error(t("common.upload.errorProcessing", "Failed to process cropped image"));
    }
  };


  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-description font-medium text-foreground">{label}</label>}
      {previewUrl ? (
        <div className={`relative rounded-lg border border-border overflow-hidden group bg-input flex items-center justify-center ${previewClassName}`}>
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
            <label className="p-2.5 bg-background/20 hover:bg-background/30 text-background rounded-full cursor-pointer transition-all hover:scale-105 backdrop-blur-md shadow-sm">
              <Edit2 size={18} />
              <input type="file" className="hidden" accept={acceptedFormats.join(',')} onChange={handleFileChange} />
            </label>
          </div>
        </div>
      ) : (
        <label className={`flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg cursor-pointer bg-input/50 hover:bg-input transition-colors ${emptyClassName}`}>
          <div className={`flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-center ${compact ? "p-2" : "pt-5 pb-6"}`}>
            <UploadCloud className={`text-muted-foreground/50 group-hover:text-primary transition-colors ${compact ? "w-6 h-6" : "w-8 h-8 mb-2"}`} />
            {!compact && (
              <>
                <p className="text-description font-semibold">{t("common.upload.title")}</p>
                <p className="text-caption mt-1 text-muted-foreground/70">{t("common.upload.allowed")}: {acceptedFormats.map(f => (f.split('/')[1] || '').toUpperCase()).join(', ')} ({t("common.upload.max")} {maxSizeMB}MB)</p>
              </>
            )}
          </div>
          <input type="file" className="hidden" accept={acceptedFormats.join(',')} onChange={handleFileChange} />
        </label>
      )}
      {error && <p className="text-caption text-error">{error}</p>}

      {rawImageSrc && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          onClose={() => {
            setIsCropperOpen(false);
            setRawImageSrc(null);
          }}
          imageSrc={rawImageSrc}
          onCropComplete={handleCropComplete}
          aspectRatio={aspectRatio}
        />
      )}
    </div>
  );
};
