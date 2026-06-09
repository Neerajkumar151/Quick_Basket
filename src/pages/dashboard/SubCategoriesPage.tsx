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
import { useTranslation } from "react-i18next";
import { useEntityDrawer } from "../../hooks/useEntityDrawer";

export const SubCategoriesPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategoryFilter = searchParams.get("category") || "";

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState(initialCategoryFilter);

  // Drawer
  const { isOpen, editingItem: editingSubCategory, openDrawer, closeDrawer } = useEntityDrawer<SubCategory>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data via TanStack Query (cached)
  const { data: subCategories = [], isLoading } = useSubCategories();
  const { data: categories = [] } = useCategories();



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
        toast.success(t("subCategories.messages.successUpdate"));
      } else {
        await subCategoryService.createSubCategory({
          ...data,
          status: data.status || "Active",
          image: imageUrl,
        });
        toast.success(t("subCategories.messages.successCreate"));
      }

      await queryClient.invalidateQueries({ queryKey: SUB_CATEGORIES_QUERY_KEY });
      closeDrawer();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("subCategories.messages.errorSave");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (subCat: SubCategory) => {
    try {
      await subCategoryService.toggleStatus(subCat.id);
      toast.success(
        t("subCategories.messages.successStatus") || "Status updated successfully"
      );
      await queryClient.invalidateQueries({ queryKey: SUB_CATEGORIES_QUERY_KEY });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("subCategories.messages.errorStatus")
      );
    }
  };

  // Filter Logic
  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((sc: SubCategory) => {
      const matchesSearch = sc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter ? sc.categoryId === categoryFilter : true;
      return matchesSearch && matchesCategory;
    });
  }, [subCategories, searchQuery, categoryFilter]);

  const columns: ColumnDef<SubCategory>[] = [
    {
      header: t("subCategories.table.image"),
      cell: (sc: SubCategory) => (
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
      header: t("subCategories.table.name"),
      accessorKey: "name",
      cell: (sc: SubCategory) => (
        <span className="font-bold text-foreground">{sc.name}</span>
      ),
    },
    {
      header: t("subCategories.table.parent"),
      cell: (sc: SubCategory) => {
        const parent = categories.find((c: any) => c.id === sc.categoryId);
        return (
          <span className="text-muted-foreground font-medium">
            {parent?.name || "Unknown"}
          </span>
        );
      },
    },
    {
      header: t("subCategories.table.description"),
      cell: (sc: SubCategory) => (
        <span className="text-muted-foreground max-w-[200px] truncate block">
          {sc.description || "-"}
        </span>
      ),
    },
    {
      header: t("subCategories.table.products"),
      cell: (sc: SubCategory) => (
        <Link
          to={`/dashboard/products?subCategory=${encodeURIComponent(sc.id)}`}
          className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
          title={t("subCategories.messages.viewProducts")}
        >
          {sc.productsCount}
        </Link>
      ),
    },
    {
      header: t("subCategories.table.createdOn"),
      accessorKey: "createdAt",
      className: "text-muted-foreground",
    },
    {
      header: t("subCategories.table.status") || "Status",
      cell: (sc: SubCategory) => (
        <button
          onClick={() => toggleStatus(sc)}
          className="hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={sc.status || "Active"} />
        </button>
      ),
    },
    {
      header: t("subCategories.table.actions") || "Actions",
      className: "text-right",
      cell: (sc: SubCategory) => (
        <div className="flex justify-end">
          <button
            onClick={() => openDrawer(sc)}
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
        title={t("subCategories.header.title")}
        description={t("subCategories.header.subtitle")}
        actionLabel={t("subCategories.header.addSubCategory")}
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
            placeholder={t("subCategories.filters.searchPlaceholder")}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSearchParams(e.target.value ? { category: e.target.value } : {});
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
          data={filteredSubCategories}
          columns={columns}
          isLoading={isLoading}
          emptyTitle={t("subCategories.messages.emptyTitle")}
          emptyDescription={t("subCategories.messages.emptySubtitle")}
          itemsPerPage={10}
        />
      </div>

      <EntityDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        title={
          editingSubCategory
            ? t("subCategories.form.editTitle")
            : t("subCategories.form.addTitle")
        }
      >
        <SubCategoryForm
          initialData={editingSubCategory}
          onSubmit={handleSubmitForm}
          isSubmitting={isSubmitting}
          submitLabel={
            editingSubCategory
              ? t("subCategories.form.update")
              : t("subCategories.form.create")
          }
          onCancel={closeDrawer}
        />
      </EntityDrawer>
    </div>
  );
};
