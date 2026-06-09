import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tag } from "../../types/tag";
import { BaseCategoryForm } from "../common/forms/BaseCategoryForm";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

const createTagSchema = (t: TFunction) => z.object({
  name: z.string().min(1, { message: t("tags.messages.errorNameRequired") }),
  description: z.string().optional(), // Required by BaseCategoryForm type signature, even though we hide it
  status: z.enum(["Active", "Inactive"]).optional(),
});

export type TagFormValues = z.infer<ReturnType<typeof createTagSchema>>;

interface TagFormProps {
  initialData?: Tag | null;
  onSubmit: (data: TagFormValues) => Promise<void> | void;
  isSubmitting?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}

export const TagForm: React.FC<TagFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting = false,
  submitLabel,
  onCancel,
}) => {
  const { t } = useTranslation();
  const defaultSubmitLabel = submitLabel || t("tags.form.create");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TagFormValues>({
    resolver: zodResolver(createTagSchema(t)),
    defaultValues: {
      name: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        status: initialData.status || "Active",
      });
    } else {
      reset({ name: "", status: "Active" });
    }
  }, [initialData, reset]);

  return (
    <BaseCategoryForm<TagFormValues>
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      submitLabel={defaultSubmitLabel}
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
      nameLabel={t("tags.form.name")}
      namePlaceholder={t("tags.form.namePlaceholder") || "e.g. Trending, Fresh"}
      showDescription={false}
    />
  );
};
