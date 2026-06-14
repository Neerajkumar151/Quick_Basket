import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, ProductFormValues } from "../../validations/product";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Select } from "../ui/Select";
import { MultiSelect } from "../ui/MultiSelect";
import { MultipleImageUploader } from "./MultipleImageUploader";
import { Button } from "../ui/Button";
import { useCatalogMetadata, useSubCategoryMetadata } from "../../hooks/useCatalogMetadata";
import { useTranslation } from "react-i18next";
import type { CatalogMetadata } from "../../services/catalogService";

interface ProductFormProps {
  initialData?: ProductFormValues | null;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  onCancel,
}) => {
  const { t } = useTranslation();
  const defaultSubmitLabel = submitLabel || t("products.form.create");
  const { data: catalogMetadata, isLoading: isLoadingMetadata } = useCatalogMetadata();
  const categories = catalogMetadata?.categories || [];
  const tags = catalogMetadata?.tags || [];

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema(t)) as any,
    defaultValues: initialData ?? {
      name: "",
      description: "",
      sellingPrice: 0,
      mrp: 0,
      stockQuantity: 0,
      categoryId: "",
      subCategoryId: "",
      tagIds: [],
      images: [],
      status: "Inactive",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const selectedCategoryId = watch("categoryId");
  const { data: subCategories = [], isLoading: isLoadingSubCategories } = useSubCategoryMetadata(selectedCategoryId);
  
  // Update isFetchingMetadata to include subCategories
  const isFetchingMetadata = isLoadingMetadata || isLoadingSubCategories;

  // Reset subCategory when category changes (but not on initial load)
  useEffect(() => {
    if (selectedCategoryId && initialData?.categoryId !== selectedCategoryId) {
      setValue("subCategoryId", "");
    }
  }, [selectedCategoryId, setValue, initialData]);

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as ProductFormValues))}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        {/* Name */}
        <Input
          label={t("products.form.name")}
          placeholder={t("products.form.namePlaceholder")}
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Description */}
        <TextArea
          label={t("products.form.description")}
          placeholder={t("products.form.descriptionPlaceholder")}
          error={errors.description?.message}
          {...register("description")}
        />

        {/* Brand */}
        <Input
          label={t("products.form.brand") || "Brand"}
          placeholder={t("products.form.brandPlaceholder") || "e.g. Amul, Nestle"}
          error={errors.brand?.message}
          {...register("brand")}
        />

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            step="0.01"
            label={t("products.form.sellingPrice")}
            error={errors.sellingPrice?.message}
            {...register("sellingPrice")}
          />
          <Input
            type="number"
            step="0.01"
            label={t("products.form.mrp")}
            error={errors.mrp?.message}
            {...register("mrp")}
          />
        </div>

        {/* Category & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={t("products.form.category")}
            error={errors.categoryId?.message}
            {...register("categoryId")}
            disabled={isFetchingMetadata}
          >
            <option value="">{t("products.form.categoryPlaceholder")}</option>
            {categories.map((cat: CatalogMetadata) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <Select
            label={t("products.form.subCategory")}
            error={errors.subCategoryId?.message}
            {...register("subCategoryId")}
            disabled={isFetchingMetadata || !selectedCategoryId || subCategories.length === 0}
          >
            <option value="">{t("products.form.subCategoryPlaceholder")}</option>
            {subCategories.map((subCat: CatalogMetadata) => (
              <option key={subCat.id} value={subCat.id}>
                {subCat.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label={t("products.form.initialStock")}
            error={errors.stockQuantity?.message}
            {...register("stockQuantity")}
          />
        </div>

        <Controller
          name="tagIds"
          control={control}
          render={({ field }) => (
            <MultiSelect
              label={t("products.form.tags")}
              options={tags.map((tg: CatalogMetadata) => ({ value: tg.id, label: tg.name }))}
              value={field.value}
              onChange={field.onChange}
              error={errors.tagIds?.message}
              placeholder={t("products.form.loadingTags")}
            />
          )}
        />

        {/* Status */}
        <Select
          label={t("products.form.status")}
          error={errors.status?.message}
          {...register("status")}
        >
          <option value="Active">{t("products.form.active")}</option>
          <option value="Inactive">{t("products.form.inactive")}</option>
        </Select>

        {/* Images */}
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <MultipleImageUploader
              label={t("products.form.images")}
              images={field.value}
              onChange={field.onChange}
              error={errors.images?.message}
            />
          )}
        />
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t("common.cancel")}
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "..." : defaultSubmitLabel}
        </Button>
      </div>
    </form>
  );
};
