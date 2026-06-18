import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "../ui/Select";
import { ImageUploader } from "../ui/ImageUploader";
import { BaseCategoryForm } from "../common/forms/BaseCategoryForm";
import { SubCategoryInput } from "../../types/subCategory";
import { useCategories } from "../../hooks/useCategories";
import { SearchableSelect } from "../ui/SearchableSelect";
import { Controller } from "react-hook-form";
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
  initialData?: (SubCategoryFormValues & { image?: string; parentName?: string }) | null;
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
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState(
    initialData?.parentName || ""
  );

  const {
    data: categoriesResponse,
    isLoading: isLoadingCategories,
  } = useCategories(categorySearch, 1, 10, undefined);
  const categories = categoriesResponse?.data || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<SubCategoryFormValues>({
    resolver: zodResolver(createSubCategorySchema(t)),
    defaultValues: initialData ?? {
      name: "",
      categoryId: "",
      description: "",
      status: "Inactive",
    },
  });

  const currentCategoryId = watch("categoryId");

  useEffect(() => {
    if (currentCategoryId) {
      const c = categories.find((cat: Category) => cat.id === currentCategoryId);
      if (c) setSelectedCategoryLabel(c.name);
    }
  }, [categories, currentCategoryId]);

  const categoryOptions = categories.map((c: Category) => ({
    value: c.id,
    label: c.name,
  }));

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
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <SearchableSelect
                label={t("subCategories.form.parentCategory")}
                required
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                onSearchChange={setCategorySearch}
                selectedOptionLabel={selectedCategoryLabel || currentCategoryId}
                placeholder={t("subCategories.form.parentCategoryPlaceholder")}
                searchPlaceholder={t("subCategories.form.searchParentCategory", "Search categories...")}
                emptyMessage={t("subCategories.form.noCategories", "No categories found")}
                isLoading={isLoadingCategories}
                error={errors.categoryId?.message}
              />
            )}
          />
        </>
      }
    />
  );
};
