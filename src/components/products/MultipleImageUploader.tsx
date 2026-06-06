import React from 'react';
import { X, UploadCloud } from "lucide-react";
import toast from 'react-hot-toast';
import en from "../../locales/en.json";

interface MultipleImageUploaderProps {
  label?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  images: string[];
  onChange: (images: string[]) => void;
  error?: string;
}

export const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = ({
  label = "Images",
  maxFiles = 5,
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  images,
  onChange,
  error
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (images.length + files.length > maxFiles) {
      toast.error(`${en.products.messages.errorMaxImages} ${maxFiles} ${en.products.messages.images}`);
      return;
    }

    const newImages: string[] = [];
    let processed = 0;

    files.forEach(file => {
      if (!acceptedFormats.includes(file.type)) {
        toast.error(`${en.products.messages.errorInvalidFormat} ${file.name}`);
        processed++;
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${en.products.messages.errorSizeTooLarge} ${file.name} (${en.products.messages.max} ${maxSizeMB}MB)`);
        processed++;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newImages.push(reader.result as string);
        processed++;
        if (processed === files.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
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
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-1.5 bg-error text-white rounded-full hover:bg-error/80 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}

        {images.length < maxFiles && (
          <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-border rounded-lg cursor-pointer bg-input/50 hover:bg-input transition-colors">
            <div className="flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-center">
              <UploadCloud className="w-6 h-6 text-muted-foreground/50 mb-1 group-hover:text-primary transition-colors" />
              <p className="text-caption font-semibold">{en.common.upload.title}</p>
            </div>
            <input type="file" multiple className="hidden" accept={acceptedFormats.join(',')} onChange={handleFileChange} />
          </label>
        )}
      </div>

      {error && <p className="text-caption text-error">{error}</p>}
    </div>
  );
};
