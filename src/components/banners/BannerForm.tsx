import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBannerSchema, BannerFormValues } from "../../validations/banner";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Select } from "../ui/Select";
import { ImageUploader } from "../ui/ImageUploader";
import { Button } from "../ui/Button";
import { SearchableSelect } from "../ui/SearchableSelect";
import { useCatalogMetadata } from "../../hooks/useCatalogMetadata";
import { useTranslation } from "react-i18next";
import type { Product } from "../../types/product";
import type { CatalogMetadata } from "../../services/catalogService";
import type { Banner } from "../../types/banner";
import { useProducts } from "../../hooks/useProducts";
interface BannerFormProps {
  initialData?: Banner | null;
  onSubmit: (data: BannerFormValues, imageFile: File | null) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export const BannerForm: React.FC<BannerFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  onCancel,
}) => {
  const { t } = useTranslation();
  const defaultSubmitLabel = submitLabel || t("banners.form.create");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { data: productsResponse, isLoading: isLoadingProducts } = useProducts();
  const products = productsResponse?.data || [];
  const { data: catalogMetadata, isLoading: isLoadingMetadataReq } = useCatalogMetadata();
  const categories = catalogMetadata?.categories || [];
  const isLoadingMetadata = isLoadingProducts || isLoadingMetadataReq;

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BannerFormValues>({
    resolver: zodResolver(createBannerSchema(t)) as any,
    defaultValues: initialData ?? {
      title: "",
      description: "",
      redirectType: "Product",
      redirectId: "",
      displayOrder: 1,
      status: "Inactive",
    },
  });

  const redirectType = watch("redirectType");

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setSelectedFile(null);
    } else {
      reset({
        title: "",
        description: "",
        redirectType: "Product",
        redirectId: "",
        displayOrder: 1,
        status: "Inactive",
      });
      setSelectedFile(null);
    }
  }, [initialData, reset]);

  // When redirectType changes, clear redirectId to prevent invalid associations
  useEffect(() => {
    if (!initialData || initialData.redirectType !== redirectType) {
      setValue("redirectId", "");
    }
  }, [redirectType, setValue, initialData]);

  const handleFormSubmit = async (data: BannerFormValues) => {
    let redirectName = t("common.unknown");
    if (data.redirectType === "Product") {
      const p = products.find((prod: Product) => prod.id === data.redirectId);
      if (p) redirectName = p.name;
    } else {
      const c = categories.find((cat: CatalogMetadata) => cat.id === data.redirectId);
      if (c) redirectName = c.name;
    }

    await onSubmit({ ...data, redirectName }, selectedFile);
  };

  return (
    <form
      onSubmit={handleSubmit((data) =>
        handleFormSubmit(data as BannerFormValues),
      )}
      className="flex flex-col gap-6 pt-2 pb-6 px-6"
    >
      <ImageUploader
        label={t("banners.form.image")}
        previewUrl={initialData?.image}
        onFileSelect={setSelectedFile}
        aspectRatio={16/9}
        maxWidth={1920}
        maxHeight={1080}
        quality={0.9}
      />



      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={t("banners.form.redirectType")}
          error={errors.redirectType?.message}
          {...register("redirectType")}
          value={watch("redirectType")}
        >
          <option value="Product">{t("banners.form.targetTypeProduct")}</option>
          <option value="Category">
            {t("banners.form.targetTypeCategory")}
          </option>
        </Select>

        {redirectType === "Product" ? (
          <Controller
            control={control}
            name="redirectId"
            render={({ field }) => (
              <SearchableSelect
                label={t("banners.form.selectProduct")}
                required
                options={products.map((p: Product) => ({
                  value: p.id,
                  label: p.name,
                }))}
                value={field.value}
                onChange={field.onChange}
                placeholder={t("banners.form.selectProduct")}
                searchPlaceholder={t("banners.form.searchProducts")}
                emptyMessage={t("banners.form.noProducts")}
                disabled={isLoadingMetadata}
                error={errors.redirectId?.message}
              />
            )}
          />
        ) : (
          <Select
            label={t("banners.form.redirectTarget")}
            error={errors.redirectId?.message}
            {...register("redirectId")}
            value={watch("redirectId")}
            disabled={isLoadingMetadata}
          >
            <option value="">{t("banners.form.selectCategory")}</option>
            {categories.map((c: CatalogMetadata) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          label={t("banners.form.displayOrder")}
          error={errors.displayOrder?.message}
          {...register("displayOrder")}
        />

        <Select
          label={t("banners.form.status")}
          error={errors.status?.message}
          {...register("status")}
          value={watch("status")}
        >
          <option value="Active">{t("banners.form.active")}</option>
          <option value="Inactive">{t("banners.form.inactive")}</option>
        </Select>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
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
