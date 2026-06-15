import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "../ui/Select";
import { ImageUploader } from "../ui/ImageUploader";
import { BaseCategoryForm } from "../common/forms/BaseCategoryForm";
import { SubCategoryInput } from "../../types/subCategory";
import { useCategoryTree } from "../../hooks/useCategoryTree";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import type { Category } from "../../types/category";

const createSubCategorySchema = (t: TFunction) => z.object({
  name: z.string().min(1, t("subCategories.messages.errorNameRequired")),
  categoryId: z.string().min(1, t("subCategories.messages.errorParentRequired")),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
});

export type SubCategoryFormValues = z.infer<ReturnType<typeof createSubCategorySchema>>;

interface SubCategoryFormProps {
  initialData?: (SubCategoryFormValues & { image?: string }) | null;
  onSubmit: (data: SubCategoryInput, imageFile: File | null) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export const SubCategoryForm: React.FC<SubCategoryFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  onCancel,
}) => {
  const { t } = useTranslation();
  const defaultSubmitLabel = submitLabel || t("subCategories.form.create");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = useCategoryTree();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SubCategoryFormValues>({
    resolver: zodResolver(createSubCategorySchema(t)),
    defaultValues: initialData ?? {
      name: "",
      categoryId: "",
      description: "",
      status: "Inactive",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setSelectedFile(null);
    } else {
      reset({ name: "", categoryId: "", description: "", status: "Active" });
      setSelectedFile(null);
    }
  }, [initialData, reset]);

  return (
    <BaseCategoryForm<SubCategoryFormValues>
      register={register}
      watch={watch}
      errors={errors}
      isSubmitting={isSubmitting}
      submitLabel={defaultSubmitLabel}
      onCancel={onCancel}
      onSubmit={handleSubmit((data) => onSubmit(data, selectedFile))}
      nameLabel={t("subCategories.form.name")}
      namePlaceholder={t("subCategories.form.namePlaceholder")}
      prependChildren={
        <>
          <ImageUploader
            label="Image (Optional)"
            previewUrl={initialData?.image}
            onFileSelect={setSelectedFile}
          />
          <Select
            label={t("subCategories.form.parentCategory")}
            error={errors.categoryId?.message}
            {...register("categoryId")}
            value={watch("categoryId")}
            disabled={isLoadingCategories}
          >
            <option value="">
              {t("subCategories.form.parentCategoryPlaceholder")}
            </option>
            {categories.map((cat: Category) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </>
      }
    />
  );
};
