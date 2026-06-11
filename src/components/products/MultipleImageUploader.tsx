import React, { useState, useEffect } from 'react';
import { UploadCloud, Trash2, Edit2 } from "lucide-react";
import toast from 'react-hot-toast';
import { useTranslation } from "react-i18next";
import { resizeImage } from "../../utils/image";
import { ImageCropperModal } from '../ui/ImageCropperModal';

interface MultipleImageUploaderProps {
  label?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = ({
  label = "Images",
  maxFiles = 5,
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  images,
  onChange,
  error,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.8
}) => {
  const { t } = useTranslation();
  
  // Cropper Queue State
  const [cropperQueue, setCropperQueue] = useState<File[]>([]);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  useEffect(() => {
    if (cropperQueue.length > 0 && !isCropperOpen && replaceIndex === null) {
      const file = cropperQueue[0];
      const reader = new FileReader();
      reader.onload = () => {
        setRawImageSrc(reader.result?.toString() || null);
        setIsCropperOpen(true);
      };
      reader.readAsDataURL(file);
    }
  }, [cropperQueue, isCropperOpen, replaceIndex]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + cropperQueue.length + files.length > maxFiles) {
      toast.error(`${t("products.messages.errorMaxImages")} ${maxFiles} ${t("products.messages.images")}`);
      return;
    }

    const validFiles = files.filter(file => {
      if (!acceptedFormats.includes(file.type)) {
        toast.error(`${t("products.messages.errorInvalidFormat")} ${file.name}`);
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${t("products.messages.errorSizeTooLarge")} ${file.name} (${t("products.messages.max")} ${maxSizeMB}MB)`);
        return false;
      }
      return true;
    });

    setCropperQueue(prev => [...prev, ...validFiles]);
    e.target.value = '';
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!acceptedFormats.includes(file.type)) {
      toast.error(`${t("products.messages.errorInvalidFormat")} ${file.name}`);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`${t("products.messages.errorSizeTooLarge")} ${file.name} (${t("products.messages.max")} ${maxSizeMB}MB)`);
      return;
    }

    setReplaceIndex(index);
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result?.toString() || null);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    try {
      const resizedDataUrl = await resizeImage(croppedFile, maxWidth, maxHeight, quality);
      if (replaceIndex !== null) {
        const updated = [...images];
        updated[replaceIndex] = resizedDataUrl;
        onChange(updated);
      } else {
        onChange([...images, resizedDataUrl]);
      }
    } catch (err) {
      toast.error(t("common.upload.errorProcessing", "Failed to process cropped image"));
    } finally {
      setIsCropperOpen(false);
      setRawImageSrc(null);
      if (replaceIndex !== null) {
        setReplaceIndex(null);
      } else {
        setCropperQueue(prev => prev.slice(1));
      }
    }
  };

  const handleCropCancel = () => {
    setIsCropperOpen(false);
    setRawImageSrc(null);
    if (replaceIndex !== null) {
      setReplaceIndex(null);
    } else {
      setCropperQueue(prev => prev.slice(1));
    }
  };

  const removeImage = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    onChange(updated);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-description font-medium text-foreground">{label}</label>}
      
      <div className="flex flex-wrap gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative w-24 h-24 rounded-lg border border-border overflow-hidden group bg-input flex items-center justify-center">
            <img src={img} alt={`Preview ${index}`} className="max-w-full max-h-full object-cover" />
            <div className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
              <label className="p-2 bg-background/20 hover:bg-background/30 text-background rounded-full cursor-pointer transition-all hover:scale-105 backdrop-blur-md shadow-sm">
                <Edit2 size={14} />
                <input 
                  type="file" 
                  className="hidden" 
                  accept={acceptedFormats.join(',')} 
                  onChange={(e) => handleReplaceFileChange(e, index)} 
                />
              </label>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-2 bg-error/80 hover:bg-error text-background rounded-full cursor-pointer transition-all hover:scale-105 backdrop-blur-md shadow-sm"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {images.length < maxFiles && (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer bg-input/50 hover:bg-input transition-colors">
            <div className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-center">
              <UploadCloud className="w-6 h-6 text-muted-foreground/50 mb-1 group-hover:text-primary transition-colors" />
              <p className="text-caption font-semibold">{t("common.upload.title")}</p>
            </div>
            <input type="file" multiple className="hidden" accept={acceptedFormats.join(',')} onChange={handleFileChange} />
          </label>
        )}
      </div>

      {error && <p className="text-caption text-error">{error}</p>}

      {rawImageSrc && (
        <ImageCropperModal
          isOpen={isCropperOpen}
          onClose={handleCropCancel}
          imageSrc={rawImageSrc}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
        />
      )}
    </div>
  );
};
