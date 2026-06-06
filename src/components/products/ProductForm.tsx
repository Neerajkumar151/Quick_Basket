import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema, ProductFormValues } from "../../validations/product";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { Select } from "../ui/Select";
import { MultiSelect } from "../ui/MultiSelect";
import { MultipleImageUploader } from "./MultipleImageUploader";
import { categoryService, Category } from "../../services/categoryService";
import { tagService, Tag } from "../../services/tagService";
import en from "../../locales/en.json";

interface ProductFormProps {
  initialData?: ProductFormValues | null;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  formRef?: React.RefObject<HTMLFormElement>;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  formRef,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: initialData || {
      name: "",
      description: "",
      sellingPrice: 0,
      mrp: 0,
      stockQuantity: 0,
      categoryId: "",
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

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, tgs] = await Promise.all([
          categoryService.getCategories(),
          tagService.getTags()
        ]);
        setCategories(cats);
        setTags(tgs);
      } catch (error) {
        console.error("Failed to load categories/tags", error);
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    fetchMetadata();
  }, []);

  const handleFormSubmit = async (data: ProductFormValues) => {
    await onSubmit(data);
  };

  return (
    <form
      ref={formRef as any}
      onSubmit={handleSubmit(handleFormSubmit as any)}
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
            disabled={isLoadingMetadata}
          >
            <option value="">{en.products.form.categoryPlaceholder}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>

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
              options={tags.map(t => ({ value: t.id, label: t.name }))}
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
    </form>
  );
};
