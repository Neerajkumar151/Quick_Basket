import { useState, useMemo } from "react";
import { Plus, Edit2, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { EntityDrawer } from "../../components/ui/EntityDrawer";
import { Pagination } from "../../components/ui/Pagination";
import { StatusBadge } from "../../components/ui/StatusBadge";

import {
  SubCategoryForm,
  SubCategoryFormValues,
} from "../../components/sub-categories/SubCategoryForm";
import { subCategoryService } from "../../services/subCategoryService";
import { SubCategory } from "../../types/subCategory";
import { useSubCategories, SUB_CATEGORIES_QUERY_KEY } from "../../hooks/useSubCategories";
import { useCategories } from "../../hooks/useCategories";
import { queryClient } from "../../providers/QueryProvider";
import en from "../../locales/en.json";

export const SubCategoriesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategoryFilter = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState<SubCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data via TanStack Query (cached)
  const { data: subCategories = [], isLoading } = useSubCategories();
  const { data: categories = [] } = useCategories();

  const handleOpenDrawer = (subCat?: SubCategory) => {
    setEditingSubCategory(subCat || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingSubCategory(null);
  };

  const handleSubmitForm = async (data: SubCategoryFormValues, imageFile: File | null) => {
    setIsSubmitting(true);
    try {
      let imageUrl = editingSubCategory?.image;
      if (imageFile) {
        imageUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      if (editingSubCategory) {
        await subCategoryService.updateSubCategory(editingSubCategory.id, {
          ...data,
          status: data.status || "Active",
          image: imageUrl,
        });
        toast.success(en.subCategories.messages.successUpdate);
      } else {
        await subCategoryService.createSubCategory({
          ...data,
          status: data.status || "Active",
          image: imageUrl,
        });
        toast.success(en.subCategories.messages.successCreate);
      }

      await queryClient.invalidateQueries({ queryKey: SUB_CATEGORIES_QUERY_KEY });
      handleCloseDrawer();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : en.subCategories.messages.errorSave;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (subCat: SubCategory) => {
    try {
      await subCategoryService.toggleStatus(subCat.id);
      toast.success(
        en.subCategories.messages.successStatus || "Status updated successfully"
      );
      await queryClient.invalidateQueries({ queryKey: SUB_CATEGORIES_QUERY_KEY });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : en.subCategories.messages.errorStatus
      );
    }
  };

  // Filter & Pagination Logic
  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((sc: any) => {
      const matchesSearch = sc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? sc.categoryId === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [subCategories, searchQuery, categoryFilter]);

  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
  const paginatedSubCategories = filteredSubCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: ColumnDef<SubCategory>[] = [
    {
      header: en.subCategories.table.image,
      cell: (sc: any) => (
        <div className="w-10 h-10 rounded-lg bg-input overflow-hidden flex items-center justify-center border border-border shadow-sm">
          {sc.image ? (
            <img
              src={sc.image}
              alt={sc.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon size={20} className="text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      header: en.subCategories.table.name,
      accessorKey: "name",
      cell: (sc: any) => (
        <span className="font-bold text-foreground">{sc.name}</span>
      ),
    },
    {
      header: en.subCategories.table.parent,
      cell: (sc: any) => {
        const parent = categories.find((c: any) => c.id === sc.categoryId);
        return (
          <span className="text-muted-foreground font-medium">
            {parent?.name || "Unknown"}
          </span>
        );
      },
    },
    {
      header: en.subCategories.table.description,
      cell: (sc: any) => (
        <span className="text-muted-foreground max-w-[200px] truncate block">
          {sc.description || "-"}
        </span>
      ),
    },
    {
      header: en.subCategories.table.products,
      cell: (sc: any) => (
        <Link
          to={`/dashboard/products?subCategory=${encodeURIComponent(sc.id)}`}
          className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
          title={en.subCategories.messages.viewProducts}
        >
          {sc.productsCount}
        </Link>
      ),
    },
    {
      header: en.subCategories.table.createdOn,
      accessorKey: "createdAt",
      className: "text-muted-foreground",
    },
    {
      header: en.subCategories.table.status || "Status",
      cell: (sc: any) => (
        <button
          onClick={() => toggleStatus(sc)}
          className="hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={sc.status || "Active"} />
        </button>
      ),
    },
    {
      header: en.subCategories.table.actions || "Actions",
      className: "text-right",
      cell: (sc: any) => (
        <div className="flex justify-end">
          <button
            onClick={() => handleOpenDrawer(sc)}
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
        title={en.subCategories.header.title}
        description={en.subCategories.header.subtitle}
        actionLabel={en.subCategories.header.addSubCategory}
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
            placeholder={en.subCategories.filters.searchPlaceholder}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSearchParams(e.target.value ? { category: e.target.value } : {});
              setCurrentPage(1);
            }}
            aria-label="Filter by Category"
          >
            <option value="">{"All Categories"}</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </Select>
        </div>
      </FilterBar>

      <div className="flex flex-col">
        <DataTable
          data={paginatedSubCategories}
          columns={columns}
          isLoading={isLoading}
          emptyTitle={en.subCategories.messages.emptyTitle}
          emptyDescription={en.subCategories.messages.emptySubtitle}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <EntityDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          editingSubCategory
            ? en.subCategories.form.editTitle
            : en.subCategories.form.addTitle
        }
      >
        <SubCategoryForm
          initialData={editingSubCategory}
          onSubmit={handleSubmitForm}
          isSubmitting={isSubmitting}
          submitLabel={
            editingSubCategory
              ? en.subCategories.form.update
              : en.subCategories.form.create
          }
          onCancel={handleCloseDrawer}
        />
      </EntityDrawer>
    </div>
  );
};
