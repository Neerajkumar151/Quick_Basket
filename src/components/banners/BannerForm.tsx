import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bannerSchema, BannerFormValues } from '../../validations/banner';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { ImageUploader } from '../ui/ImageUploader';
import en from '../../locales/en.json';
import { Banner } from '../../services/bannerService';
import { productService, Product } from '../../services/productService';
import { Category, categoryService } from '../../services/categoryService';
import { SearchableSelect } from '../ui/SearchableSelect';

interface BannerFormProps {
  initialData?: Banner | null;
  onSubmit: (data: BannerFormValues, imageFile: File | null) => Promise<void>;
  formRef?: React.MutableRefObject<HTMLFormElement | null>;
}

export const BannerForm: React.FC<BannerFormProps> = ({ initialData, onSubmit, formRef }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);

  const { register, handleSubmit, watch, control, formState: { errors }, reset, setValue } = useForm<BannerFormValues>({
    resolver: zodResolver(bannerSchema) as any,
    defaultValues: initialData || {
      title: '',
      description: '',
      redirectType: 'Product',
      redirectId: '',
      displayOrder: 1,
      status: 'Inactive'
    }
  });

  const redirectType = watch('redirectType');

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setSelectedFile(null);
    } else {
      reset({
        title: '',
        description: '',
        redirectType: 'Product',
        redirectId: '',
        displayOrder: 1,
        status: 'Inactive'
      });
      setSelectedFile(null);
    }
  }, [initialData, reset]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [prods, cats] = await Promise.all([
          productService.getProducts(),
          categoryService.getCategories()
        ]);
        setProducts(prods);
        setCategories(cats);
      } catch (error) {
        console.error("Failed to load products/categories", error);
      } finally {
        setIsLoadingMetadata(false);
      }
    };
    fetchMetadata();
  }, []);

  // When redirectType changes, clear redirectId to prevent invalid associations
  useEffect(() => {
    if (!initialData || initialData.redirectType !== redirectType) {
      setValue('redirectId', '');
    }
  }, [redirectType, setValue, initialData]);

  const handleFormSubmit = async (data: BannerFormValues) => {
    let redirectName = 'Unknown';
    if (data.redirectType === 'Product') {
      const p = products.find(prod => prod.id === data.redirectId);
      if (p) redirectName = p.name;
    } else {
      const c = categories.find(cat => cat.id === data.redirectId);
      if (c) redirectName = c.name;
    }
    
    await onSubmit({ ...data, redirectName }, selectedFile);
  };

  return (
    <form
      ref={formRef as any}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-6 pt-2 pb-6 px-6"
    >
      <ImageUploader 
        label={en.banners.form.image}
        previewUrl={initialData?.image}
        onFileSelect={setSelectedFile}
      />

      <Input
        label={en.banners.form.title}
        placeholder={en.banners.form.titlePlaceholder}
        error={errors.title?.message}
        {...register("title")}
      />

      <TextArea
        label={en.banners.form.description}
        placeholder={en.banners.form.descriptionPlaceholder}
        error={errors.description?.message}
        {...register("description")}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label={en.banners.form.redirectType}
          error={errors.redirectType?.message}
          {...register("redirectType")}
        >
          <option value="Product">{en.banners.form.targetTypeProduct}</option>
          <option value="Category">{en.banners.form.targetTypeCategory}</option>
        </Select>

        {redirectType === 'Product' ? (
          <Controller
            control={control}
            name="redirectId"
            render={({ field }) => {
              return (
                <SearchableSelect
                  label={en.banners.form.selectProduct}
                  required
                  options={products.map(p => ({ value: p.id, label: p.name }))}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder={en.banners.form.selectProduct}
                  searchPlaceholder={en.banners.form.searchProducts}
                  emptyMessage={en.banners.form.noProducts}
                  disabled={isLoadingMetadata}
                  error={errors.redirectId?.message}
                />
              );
            }}
          />
        ) : (
          <Select
            label={en.banners.form.redirectTarget}
            error={errors.redirectId?.message}
            {...register("redirectId")}
            disabled={isLoadingMetadata}
          >
            <option value="">
              {en.banners.form.selectCategory}
            </option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="number"
          label={en.banners.form.displayOrder}
          error={errors.displayOrder?.message}
          {...register("displayOrder")}
        />

        <Select
          label={en.banners.form.status}
          error={errors.status?.message}
          {...register("status")}
        >
          <option value="Active">{en.banners.form.active}</option>
          <option value="Inactive">{en.banners.form.inactive}</option>
        </Select>
      </div>
    </form>
  );
};
