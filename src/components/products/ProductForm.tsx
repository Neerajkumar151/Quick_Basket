import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema, ProductFormValues } from "../../validations/product";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Select } from "../ui/Select";
import { MultiSelect } from "../ui/MultiSelect";
import { MultipleImageUploader } from "./MultipleImageUploader";
import { Button } from "../ui/Button";
import { useCatalogMetadata } from "../../hooks/useCatalogMetadata";
import { useCategories } from "../../hooks/useCategories";
import { useSubCategories } from "../../hooks/useSubCategories";
import { SearchableSelect } from "../ui/SearchableSelect";
import { useTranslation } from "react-i18next";
import type { CatalogMetadata } from "../../services/catalogService";

interface ProductFormProps {
  initialData?: (ProductFormValues & { categoryName?: string; subCategoryName?: string }) | null;
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
  const tags = catalogMetadata?.tags || [];

  const [categorySearch, setCategorySearch] = useState("");
  const [subCategorySearch, setSubCategorySearch] = useState("");
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState(initialData?.categoryName || "");
  const [selectedSubCategoryLabel, setSelectedSubCategoryLabel] = useState(initialData?.subCategoryName || "");

  const { data: categoriesResponse, isLoading: isLoadingCategories } = useCategories(categorySearch, 1, 10, undefined);
  const categories = categoriesResponse?.data || [];

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
  const selectedSubCategoryId = watch("subCategoryId");

  const { data: subCategoriesResponse, isLoading: isLoadingSubCategories } = useSubCategories(
    subCategorySearch,
    selectedCategoryId,
    1,
    10,
    undefined
  );
  const subCategories = subCategoriesResponse?.data || [];
  
  // Update selected labels when ID matches fetched items
  useEffect(() => {
    if (selectedCategoryId) {
      const c = categories.find((cat: any) => cat.id === selectedCategoryId);
      if (c) setSelectedCategoryLabel(c.name);
    }
  }, [categories, selectedCategoryId]);

  useEffect(() => {
    if (selectedSubCategoryId) {
      const sc = subCategories.find((cat: any) => cat.id === selectedSubCategoryId);
      if (sc) setSelectedSubCategoryLabel(sc.name);
    }
  }, [subCategories, selectedSubCategoryId]);

  // Reset subCategory when category changes (but not on initial load)
  useEffect(() => {
    if (selectedCategoryId && initialData?.categoryId !== selectedCategoryId) {
      setValue("subCategoryId", "");
    }
  }, [selectedCategoryId, setValue, initialData]);

  const categoryOptions = categories.map((c: any) => ({
    value: c.id,
    label: c.name,
  }));

  const subCategoryOptions = subCategories.map((c: any) => ({
    value: c.id,
    label: c.name,
  }));

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data as ProductFormValues))}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        {/* Name */}
        <Input
          label={t("products.form.name")}
          required
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
            required
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
          <Controller
            control={control}
            name="categoryId"
            render={({ field }) => (
              <SearchableSelect
                label={t("products.form.category")}
                required
                options={categoryOptions}
                value={field.value}
                onChange={field.onChange}
                onSearchChange={setCategorySearch}
                selectedOptionLabel={selectedCategoryLabel || selectedCategoryId}
                placeholder={t("products.form.categoryPlaceholder")}
                searchPlaceholder={t("banners.form.searchCategories", "Search categories...")}
                emptyMessage={t("subCategories.form.noCategories", "No categories found")}
                isLoading={isLoadingCategories}
                error={errors.categoryId?.message}
                disabled={isLoadingCategories}
              />
            )}
          />

          <Controller
            control={control}
            name="subCategoryId"
            render={({ field }) => (
              <SearchableSelect
                label={t("products.form.subCategory")}
                required
                options={subCategoryOptions}
                value={field.value || ""}
                onChange={field.onChange}
                onSearchChange={setSubCategorySearch}
                selectedOptionLabel={selectedSubCategoryLabel || selectedSubCategoryId}
                placeholder={t("products.form.subCategoryPlaceholder")}
                searchPlaceholder={t("banners.form.searchCategories", "Search sub-categories...")}
                emptyMessage={t("subCategories.form.noCategories", "No sub-categories found")}
                isLoading={isLoadingSubCategories}
                error={errors.subCategoryId?.message}
                disabled={isLoadingSubCategories || !selectedCategoryId}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            required
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
          value={watch("status")}
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
              required
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
