import { useState } from "react";
import { Plus, ImageIcon, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { SearchInput } from "../../components/ui/SearchInput";
import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { EntityDrawer } from "../../components/ui/EntityDrawer";
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
import { useTranslation } from "react-i18next";
import { useEntityDrawer } from "../../hooks/useEntityDrawer";
import { useDebounce } from "../../hooks/useDebounce";
import { Pagination } from "../../components/ui/Pagination";
import { CATEGORY_TREE_QUERY_KEY } from "../../hooks/useCategoryTree";

export const CategoriesPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer
  const {
    isOpen,
    editingItem: editingCategory,
    openDrawer,
    closeDrawer,
  } = useEntityDrawer<Category>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounce search query to prevent spamming the API
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Data via TanStack Query (cached)
  const { data: responseData, isLoading } = useCategories(
    debouncedSearchQuery,
    currentPage,
    itemsPerPage,
  );

  const categories = responseData?.data || [];
  const meta = responseData?.meta || { totalPages: 1, page: 1, total: 0 };

  const handleSubmitForm = async (
    data: CategoryFormValues,
    imageFile: File | null,
  ) => {
    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await categoryService.updateCategory(
          editingCategory.id,
          {
            name: data.name,
            description: data.description,
            status: data.status || "Active",
          },
          imageFile,
        );
        toast.success(t("categories.messages.successUpdate"));
      } else {
        await categoryService.createCategory(
          {
            name: data.name,
            description: data.description,
            status: data.status || "Active",
          },
          imageFile,
        );
        toast.success(t("categories.messages.successCreate"));
      }

      // Invalidate both the admin listing and the tree cache (used by dropdowns)
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: CATEGORY_TREE_QUERY_KEY }),
      ]);
      closeDrawer();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : t("categories.messages.errorSave");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (cat: Category) => {
    try {
      const newIsActive = cat.status === "Inactive";
      await categoryService.toggleStatus(cat.id, newIsActive);
      toast.success(
        t("categories.messages.successStatus") || "Status updated successfully",
      );
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: CATEGORY_TREE_QUERY_KEY }),
      ]);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("categories.messages.errorStatus"),
      );
    }
  };

  const columns: ColumnDef<Category>[] = [
    {
      header: t("categories.table.image"),
      cell: (cat: Category) => (
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
      header: t("categories.table.name"),
      accessorKey: "name",
      cell: (cat: Category) => (
        <span className="font-bold text-foreground">{cat.name}</span>
      ),
    },
    {
      header: t("categories.table.description"),
      cell: (cat: Category) => (
        <span className="text-muted-foreground max-w-[200px] truncate block">
          {cat.description || "-"}
        </span>
      ),
    },
    {
      header: t("categories.table.products"),
      cell: (cat: Category) => (
        <Link
          to={`/dashboard/products?category=${encodeURIComponent(cat.name)}`}
          className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
          title={t("categories.messages.viewProducts")}
        >
          {cat.productsCount}
        </Link>
      ),
    },
    {
      header: t("categories.table.createdOn"),
      accessorKey: "createdAt",
      className: "text-muted-foreground",
    },
    {
      header: t("categories.table.status") || "Status",
      cell: (cat: Category) => (
        <button
          onClick={() => toggleStatus(cat)}
          className="hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={cat.status || "Active"} />
        </button>
      ),
    },
    {
      header: t("categories.table.actions") || "Actions",
      className: "text-right",
      cell: (cat: Category) => (
        <div className="flex justify-end">
          <button
            onClick={() => openDrawer(cat)}
            className="flex items-center gap-2 px-3 py-1.5 text-description font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            <Edit2 size={16} />
            {t("common.edit")}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <PageHeader
        title={t("categories.header.title")}
        description={t("categories.header.subtitle")}
        actionLabel={t("categories.header.addCategory")}
        actionIcon={<Plus size={18} />}
        onAction={() => openDrawer()}
      />

      <FilterBar>
        <div className="w-full sm:w-72">
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder={t("categories.filters.searchPlaceholder")}
          />
        </div>
      </FilterBar>

      <div className="flex flex-col">
        <DataTable
          data={categories}
          columns={columns}
          isLoading={isLoading}
          emptyTitle={t("categories.messages.emptyTitle")}
          emptyDescription={t("categories.messages.emptySubtitle")}
          pagination={false}
        />

        {meta.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <EntityDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        title={
          editingCategory
            ? t("categories.form.editTitle")
            : t("categories.form.addTitle")
        }
      >
        <CategoryForm
          initialData={editingCategory}
          onSubmit={handleSubmitForm}
          isSubmitting={isSubmitting}
          submitLabel={
            editingCategory
              ? t("categories.form.update")
              : t("categories.form.create")
          }
          onCancel={closeDrawer}
        />
      </EntityDrawer>
    </div>
  );
};
