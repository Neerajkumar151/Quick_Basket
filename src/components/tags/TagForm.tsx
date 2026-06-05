import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tag } from '../../services/tagService';
import en from '../../locales/en.json';
import { Select } from '../ui/Select';

export const PREDEFINED_TAGS = [
  "Fresh",
  "Trending",
  "Daily Essentials",
  "Fast Delivery",
  "Recommended",
  "Best Selling",
  "New Arrivals"
];

const tagSchema = z.object({
  name: z.string().min(1, { message: en.tags.messages.errorNameRequired }),
});

export type TagFormValues = z.infer<typeof tagSchema>;

interface TagFormProps {
  initialData?: Tag | null;
  onSubmit: (data: TagFormValues) => Promise<void> | void;
  formRef?: React.MutableRefObject<HTMLFormElement | null>;
}

export const TagForm: React.FC<TagFormProps> = ({
  initialData,
  onSubmit,
  formRef
}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TagFormValues>({
    resolver: zodResolver(tagSchema),
    defaultValues: {
      name: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name
      });
    } else {
      reset({ name: '' });
    }
  }, [initialData, reset]);

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 pt-2 pb-6 px-6">
      
      <Select
        label={en.tags.form.name}
        {...register('name')}
        error={errors.name?.message}
      >
        <option value="" disabled>{en.tags.form.namePlaceholder || "Select a tag"}</option>
        {PREDEFINED_TAGS.map(tag => (
          <option key={tag} value={tag}>{tag}</option>
        ))}
      </Select>
    </form>
  );
};
