import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "../../validations/product";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Select } from "../ui/Select";
import { MultiSelect } from "../ui/MultiSelect";
import { MultipleImageUploader } from "./MultipleImageUploader";
import { Button } from "../ui/Button";
import { useCategories } from "../../hooks/useCategories";
import { useTags } from "../../hooks/useTags";
import { useSubCategoriesByParent } from "../../hooks/useSubCategories";
import en from "../../locales/en.json";

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
  submitLabel = en.products.form.create,
  onCancel,
}) => {
  const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
  const { data: tags = [], isLoading: isLoadingTags } = useTags();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
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
  const { data: subCategories = [], isLoading: isLoadingSubCategories } = useSubCategoriesByParent(selectedCategoryId);
  
  // Update isLoadingMetadata to include subCategories
  const isFetchingMetadata = isLoadingCategories || isLoadingTags || isLoadingSubCategories;

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
          label={en.products.form.name}
          placeholder={en.products.form.namePlaceholder}
          error={errors.name?.message}
          {...register("name")}
        />

        {/* Description */}
        <TextArea
          label={en.products.form.description}
          placeholder={en.products.form.descriptionPlaceholder}
          error={errors.description?.message}
          {...register("description")}
        />

        {/* Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            step="0.01"
            label={en.products.form.sellingPrice}
            error={errors.sellingPrice?.message}
            {...register("sellingPrice")}
          />
          <Input
            type="number"
            step="0.01"
            label={en.products.form.mrp}
            error={errors.mrp?.message}
            {...register("mrp")}
          />
        </div>

        {/* Category & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label={en.products.form.category}
            error={errors.categoryId?.message}
            {...register("categoryId")}
            disabled={isFetchingMetadata}
          >
            <option value="">{en.products.form.categoryPlaceholder}</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>

          <Select
            label={en.products.form.subCategory}
            error={errors.subCategoryId?.message}
            {...register("subCategoryId")}
            disabled={isFetchingMetadata || !selectedCategoryId || subCategories.length === 0}
          >
            <option value="">{en.products.form.subCategoryPlaceholder}</option>
            {subCategories.map((subCat: any) => (
              <option key={subCat.id} value={subCat.id}>
                {subCat.name}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            label={en.products.form.initialStock}
            error={errors.stockQuantity?.message}
            {...register("stockQuantity")}
          />
        </div>

        <Controller
          name="tagIds"
          control={control}
          render={({ field }) => (
            <MultiSelect
              label={en.products.form.tags}
              options={tags.map((t: any) => ({ value: t.id, label: t.name }))}
              value={field.value}
              onChange={field.onChange}
              error={errors.tagIds?.message}
              placeholder={en.products.form.loadingTags}
            />
          )}
        />

        {/* Status */}
        <Select
          label={en.products.form.status}
          error={errors.status?.message}
          {...register("status")}
        >
          <option value="Active">{en.products.form.active}</option>
          <option value="Inactive">{en.products.form.inactive}</option>
        </Select>

        {/* Images */}
        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <MultipleImageUploader
              label={en.products.form.images}
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
            {en.common.cancel}
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
