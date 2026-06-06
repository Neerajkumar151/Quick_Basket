import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tag } from "../../types/tag";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import en from "../../locales/en.json";

export const PREDEFINED_TAGS = [
  "Fresh",
  "Trending",
  "Daily Essentials",
  "Fast Delivery",
  "Recommended",
  "Best Selling",
  "New Arrivals",
];

const tagSchema = z.object({
  name: z.string().min(1, { message: en.tags.messages.errorNameRequired }),
  status: z.enum(["Active", "Inactive"]).optional(),
});

export type TagFormValues = z.infer<typeof tagSchema>;

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
  submitLabel = en.tags.form.create,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 pt-2 pb-6 px-6"
    >
      <Select
        label={en.tags.form.name}
        {...register("name")}
        error={errors.name?.message}
      >
        <option value="" disabled>
          {en.tags.form.namePlaceholder || "Select a tag"}
        </option>
        {PREDEFINED_TAGS.map((tag: any) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </Select>

      <Select
        label={en.tags.form.status}
        {...register("status")}
        error={errors.status?.message}
      >
        <option value="Active">{en.tags.form.active}</option>
        <option value="Inactive">{en.tags.form.inactive}</option>
      </Select>

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
