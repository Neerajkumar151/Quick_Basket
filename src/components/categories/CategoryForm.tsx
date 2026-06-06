import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImageUploader } from "../ui/ImageUploader";
import { BaseCategoryForm } from "../common/forms/BaseCategoryForm";
import { Category } from "../../types/category";
import en from "../../locales/en.json";

const categorySchema = z.object({
  name: z.string().min(1, { message: en.categories.messages.errorNameRequired }),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Category | null;
  onSubmit: (data: CategoryFormValues, imageFile: File | null) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel = en.categories.form.create,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || "",
        status: initialData.status || "Active",
      });
      setSelectedFile(null);
    } else {
      reset({ name: "", description: "", status: "Active" });
      setSelectedFile(null);
    }
  }, [initialData, reset]);

  return (
    <BaseCategoryForm<CategoryFormValues>
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
      onCancel={onCancel}
      onSubmit={handleSubmit((data) => onSubmit(data, selectedFile))}
      nameLabel={en.categories.form.name}
      namePlaceholder={en.categories.form.namePlaceholder}
      prependChildren={
        <ImageUploader
          label={en.categories.form.image}
          previewUrl={initialData?.image}
          onFileSelect={setSelectedFile}
        />
      }
    />
  );
};
