import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { ImageUploader } from '../ui/ImageUploader';
import en from '../../locales/en.json';
import { Category } from '../../services/categoryService';

const categorySchema = z.object({
  name: z.string().min(1, { message: en.categories.messages.errorNameRequired }),
  description: z.string().optional(),
  status: z.enum(['Active', 'Inactive']).optional()
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  initialData?: Category | null;
  onSubmit: (data: CategoryFormValues, imageFile: File | null) => Promise<void>;
  formRef?: React.MutableRefObject<HTMLFormElement | null>;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSubmit, formRef }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'Active'
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        status: initialData.status || 'Active'
      });
      setSelectedFile(null); // The ImageUploader takes care of initial preview via prop
    } else {
      reset({ name: '', description: '', status: 'Active' });
      setSelectedFile(null);
    }
  }, [initialData, reset]);

  return (
    <form ref={formRef} onSubmit={handleSubmit((data) => onSubmit(data, selectedFile))} className="flex flex-col gap-6 pt-2 pb-6 px-6">
      
      <ImageUploader 
        label={en.categories.form.image}
        previewUrl={initialData?.image}
        onFileSelect={setSelectedFile}
      />

      <Input
        label={en.categories.form.name}
        placeholder={en.categories.form.namePlaceholder}
        {...register('name')}
        error={errors.name?.message}
      />

      <TextArea
        label={en.categories.form.description}
        placeholder={en.categories.form.descriptionPlaceholder}
        {...register('description')}
        error={errors.description?.message}
      />

      <Select
        label={en.categories.form.status}
        {...register('status')}
        error={errors.status?.message}
      >
        <option value="Active">{en.categories.form.active}</option>
        <option value="Inactive">{en.categories.form.inactive}</option>
      </Select>
    </form>
  );
};
