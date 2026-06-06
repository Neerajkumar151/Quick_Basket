import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "../ui/Select";
import { ImageUploader } from "../ui/ImageUploader";
import { BaseCategoryForm } from "../common/forms/BaseCategoryForm";
import en from "../../locales/en.json";
import { SubCategoryInput } from "../../types/subCategory";
import { useCategories } from "../../hooks/useCategories";

const subCategorySchema = z.object({
  name: z.string().min(1, en.subCategories.messages.errorNameRequired),
  categoryId: z.string().min(1, en.subCategories.messages.errorParentRequired),
  description: z.string().optional(),
  status: z.enum(["Active", "Inactive"]),
});

export type SubCategoryFormValues = z.infer<typeof subCategorySchema>;

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
  submitLabel = en.subCategories.form.create,
  onCancel,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { data: categories = [], isLoading: isLoadingCategories } =
    useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubCategoryFormValues>({
    resolver: zodResolver(subCategorySchema),
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
      errors={errors}
      isSubmitting={isSubmitting}
      submitLabel={submitLabel}
      onCancel={onCancel}
      onSubmit={handleSubmit((data) => onSubmit(data, selectedFile))}
      nameLabel={en.subCategories.form.name}
      namePlaceholder={en.subCategories.form.namePlaceholder}
      prependChildren={
        <>
          <ImageUploader
            label="Image (Optional)"
            previewUrl={initialData?.image}
            onFileSelect={setSelectedFile}
          />
          <Select
            label={en.subCategories.form.parentCategory}
            error={errors.categoryId?.message}
            {...register("categoryId")}
            disabled={isLoadingCategories}
          >
            <option value="">
              {en.subCategories.form.parentCategoryPlaceholder}
            </option>
            {categories.map((cat: any) => (
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
