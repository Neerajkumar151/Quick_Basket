import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ImageUploader } from "../ui/ImageUploader";
import { BaseCategoryForm } from "../common/forms/BaseCategoryForm";
import { Category } from "../../types/category";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

const createCategorySchema = (t: TFunction) => z.object({
  name: z.string().min(1, { message: t("categories.messages.errorNameRequired") }),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export type CategoryFormValues = z.infer<ReturnType<typeof createCategorySchema>>;



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
  submitLabel,
  onCancel,
}) => {
  const { t } = useTranslation();
  const defaultSubmitLabel = submitLabel || t("categories.form.create");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategorySchema(t)),
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
      watch={watch}
      errors={errors}
      isSubmitting={isSubmitting}
      submitLabel={defaultSubmitLabel}
      onCancel={onCancel}
      onSubmit={handleSubmit((data) => onSubmit(data, selectedFile))}
      nameLabel={t("categories.form.name")}
      namePlaceholder={t("categories.form.namePlaceholder")}
      prependChildren={
        <ImageUploader
          label={t("categories.form.image")}
          previewUrl={initialData?.image}
          onFileSelect={setSelectedFile}
        />
      }
    />
  );
};
