import { useState, useMemo } from "react";
import { Plus, ImageIcon, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { SearchInput } from "../../components/ui/SearchInput";
import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { EntityDrawer } from "../../components/ui/EntityDrawer";
import { Pagination } from "../../components/ui/Pagination";
import { StatusBadge } from "../../components/ui/StatusBadge";

import {
  CategoryForm,
  CategoryFormValues,
} from "../../components/categories/CategoryForm";
import { categoryService } from "../../services/categoryService";
import { Category } from "../../types/category";
import { useCategories } from "../../hooks/useCategories";
import { queryClient } from "../../providers/QueryProvider";
import { CATEGORIES_QUERY_KEY } from "../../hooks/useCategories";
import { useSubCategories } from "../../hooks/useSubCategories";
import en from "../../locales/en.json";

export const CategoriesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data via TanStack Query (cached)
  const { data: categories = [], isLoading } = useCategories();
  const { data: subCategories = [] } = useSubCategories();

  const handleOpenDrawer = (category?: Category) => {
    setEditingCategory(category || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingCategory(null);
  };

  const handleSubmitForm = async (
    data: CategoryFormValues,
    imageFile: File | null
  ) => {
    setIsSubmitting(true);
    try {
      let imageUrl = editingCategory?.image;
      if (imageFile) {
        imageUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, {
          ...data,
          status: data.status || "Active",
          image: imageUrl,
        });
        toast.success(en.categories.messages.successUpdate);
      } else {
        await categoryService.createCategory({
          ...data,
          status: data.status || "Active",
          image: imageUrl,
        });
        toast.success(en.categories.messages.successCreate);
      }

      await queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
      handleCloseDrawer();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : en.categories.messages.errorSave;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (cat: Category) => {
    try {
      await categoryService.toggleStatus(cat.id);
      toast.success(
        en.categories.messages.successStatus || "Status updated successfully"
      );
      await queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : en.categories.messages.errorStatus
      );
    }
  };

  // Filter & Pagination Logic
  const filteredCategories = useMemo(() => {
    return categories.filter((c: any) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [categories, searchQuery]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: ColumnDef<Category>[] = [
    {
      header: en.categories.table.image,
      cell: (cat: any) => (
        <div className="w-10 h-10 rounded-lg bg-input overflow-hidden flex items-center justify-center border border-border shadow-sm">
          {cat.image ? (
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon size={20} className="text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      header: en.categories.table.name,
      accessorKey: "name",
      cell: (cat: any) => (
        <span className="font-bold text-foreground">{cat.name}</span>
      ),
    },
    {
      header: en.categories.table.description,
      cell: (cat: any) => (
        <span className="text-muted-foreground max-w-[200px] truncate block">
          {cat.description || "-"}
        </span>
      ),
    },
    {
      header: en.subCategories.header.title || "Sub-Categories",
      cell: (cat: any) => {
        const count = subCategories.filter((sc: any) => sc.categoryId === cat.id).length;
        return (
          <Link
            to={`/dashboard/sub-categories?category=${encodeURIComponent(cat.id)}`}
            className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
            title={en.subCategories.header.title}
          >
            {count}
          </Link>
        );
      },
    },
    {
      header: en.categories.table.products,
      cell: (cat: any) => (
        <Link
          to={`/dashboard/products?category=${encodeURIComponent(cat.name)}`}
          className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
          title={en.categories.messages.viewProducts}
        >
          {cat.productsCount}
        </Link>
      ),
    },
    {
      header: en.categories.table.createdOn,
      accessorKey: "createdAt",
      className: "text-muted-foreground",
    },
    {
      header: en.categories.table.status || "Status",
      cell: (cat: any) => (
        <button
          onClick={() => toggleStatus(cat)}
          className="hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={cat.status || "Active"} />
        </button>
      ),
    },
    {
      header: en.categories.table.actions || "Actions",
      className: "text-right",
      cell: (cat: any) => (
        <div className="flex justify-end">
          <button
            onClick={() => handleOpenDrawer(cat)}
            className="flex items-center gap-2 px-3 py-1.5 text-description font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            <Edit2 size={16} />
            {en.common.edit}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <PageHeader
        title={en.categories.header.title}
        description={en.categories.header.subtitle}
        actionLabel={en.categories.header.addCategory}
        actionIcon={<Plus size={18} />}
        onAction={() => handleOpenDrawer()}
      />

      <FilterBar>
        <div className="w-full sm:w-72">
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={en.categories.filters.searchPlaceholder}
          />
        </div>
      </FilterBar>

      <div className="flex flex-col">
        <DataTable
          data={paginatedCategories}
          columns={columns}
          isLoading={isLoading}
          emptyTitle={en.categories.messages.emptyTitle}
          emptyDescription={en.categories.messages.emptySubtitle}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* EntityDrawer has no onSubmit — CategoryForm manages its own submit button */}
      <EntityDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          editingCategory
            ? en.categories.form.editTitle
            : en.categories.form.addTitle
        }
      >
        <CategoryForm
          initialData={editingCategory}
          onSubmit={handleSubmitForm}
          isSubmitting={isSubmitting}
          submitLabel={
            editingCategory
              ? en.categories.form.update
              : en.categories.form.create
          }
          onCancel={handleCloseDrawer}
        />
      </EntityDrawer>
    </div>
  );
};
