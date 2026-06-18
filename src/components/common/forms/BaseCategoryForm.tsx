import React, { ReactNode } from "react";
import { UseFormRegister, FieldErrors, Path, UseFormWatch } from "react-hook-form";
import { Input } from "../../ui/Input";
import { TextArea } from "../../ui/TextArea";
import { Select } from "../../ui/Select";
import { Button } from "../../ui/Button";
import { useTranslation } from "react-i18next";
import type { FieldValues } from "react-hook-form";

interface BaseCategoryFormProps<TFieldValues extends FieldValues> {
  register: UseFormRegister<TFieldValues>;
  watch?: UseFormWatch<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel?: () => void;
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  nameLabel: string;
  namePlaceholder: string;
  prependChildren?: ReactNode; // Elements before the name field (e.g. ImageUploader or ParentCategory)
  appendChildren?: ReactNode; // Elements after status field if any
  showDescription?: boolean; // Set to false if the entity does not have a description
}

export const BaseCategoryForm = <TFieldValues extends FieldValues>({
  register,
  watch,
  errors,
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
  nameLabel,
  namePlaceholder,
  prependChildren,
  appendChildren,
  showDescription = true,
}: BaseCategoryFormProps<TFieldValues>) => {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 pt-2 pb-6 px-6">
      <div className="flex flex-col gap-4">
        {prependChildren}

        <Input
          label={nameLabel}
          required
          placeholder={namePlaceholder}
          {...register("name" as Path<TFieldValues>)}
          error={errors.name?.message as string}
        />

        {showDescription && (
          <TextArea
            label={t("categories.form.description")}
            placeholder={t("categories.form.descriptionPlaceholder")}
            {...register("description" as Path<TFieldValues>)}
            error={errors.description?.message as string}
          />
        )}

        <Select
          label={t("categories.form.status")}
          {...register("status" as Path<TFieldValues>)}
          value={watch ? watch("status" as Path<TFieldValues>) : undefined}
          error={errors.status?.message as string}
        >
          <option value="Active">{t("categories.form.active")}</option>
          <option value="Inactive">{t("categories.form.inactive")}</option>
        </Select>

        {appendChildren}
      </div>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            {t("common.cancel")}
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? "..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
