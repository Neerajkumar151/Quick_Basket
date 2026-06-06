import React, { ReactNode } from "react";
import { UseFormRegister, FieldErrors, Path } from "react-hook-form";
import { Input } from "../../ui/Input";
import { TextArea } from "../../ui/TextArea";
import { Select } from "../../ui/Select";
import { Button } from "../../ui/Button";
import en from "../../../locales/en.json";

interface BaseCategoryFormProps<TFieldValues extends Record<string, any>> {
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel?: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  nameLabel: string;
  namePlaceholder: string;
  prependChildren?: ReactNode; // Elements before the name field (e.g. ImageUploader or ParentCategory)
  appendChildren?: ReactNode; // Elements after status field if any
}

export const BaseCategoryForm = <TFieldValues extends Record<string, any>>({
  register,
  errors,
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
  nameLabel,
  namePlaceholder,
  prependChildren,
  appendChildren,
}: BaseCategoryFormProps<TFieldValues>) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 pt-2 pb-6 px-6">
      <div className="flex flex-col gap-4">
        {prependChildren}

        <Input
          label={nameLabel}
          placeholder={namePlaceholder}
          {...register("name" as Path<TFieldValues>)}
          error={errors.name?.message as string}
        />

        <TextArea
          label={en.categories.form.description}
          placeholder={en.categories.form.descriptionPlaceholder}
          {...register("description" as Path<TFieldValues>)}
          error={errors.description?.message as string}
        />

        <Select
          label={en.categories.form.status}
          {...register("status" as Path<TFieldValues>)}
          error={errors.status?.message as string}
        >
          <option value="Active">{en.categories.form.active}</option>
          <option value="Inactive">{en.categories.form.inactive}</option>
        </Select>

        {appendChildren}
      </div>

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
