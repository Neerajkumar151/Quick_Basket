import { useState, useMemo } from "react";
import { Plus, ImageIcon, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { EntityDrawer } from "../../components/ui/EntityDrawer";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { formatCurrency } from "../../utils/number";

import { ProductForm } from "../../components/products/ProductForm";
import { ProductFormValues } from "../../validations/product";
import { productService } from "../../services/productService";
import { Product } from "../../types/product";
import { useProducts, PRODUCTS_QUERY_KEY } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import { useSubCategories, useSubCategoriesByParent } from "../../hooks/useSubCategories";
import { queryClient } from "../../providers/QueryProvider";
import { useTranslation } from "react-i18next";
import { useEntityDrawer } from "../../hooks/useEntityDrawer";

export const ProductsPage = () => {
  const { t } = useTranslation();
  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Drawer
  const { isOpen, editingItem: editingProduct, openDrawer, closeDrawer } = useEntityDrawer<Product>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data via TanStack Query (cached, no double-fetch)
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: allSubCategories = [] } = useSubCategories();
  
  // Fetch subcategories only for the selected category filter
  const { data: subCategoriesForFilter = [] } = useSubCategoriesByParent(
    categoryFilter !== "all" ? categoryFilter : undefined
  );



  const handleSubmitForm = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, data);
        toast.success(t("products.messages.successUpdate"));
      } else {
        await productService.createProduct(data);
        toast.success(t("products.messages.successCreate"));
      }
      // Invalidate cache so both ProductsPage and any other consumer refresh
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      closeDrawer();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("products.messages.errorSave");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (prod: Product) => {
    try {
      const newStatus = prod.status === "Active" ? "Inactive" : "Active";
      await productService.updateProduct(prod.id, { status: newStatus });
      toast.success(t("products.messages.successStatus"));
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    } catch {
      toast.error(t("products.messages.errorStatus"));
    }
  };

  // Processing Data (Filter -> Sort)
  const processedProducts = useMemo(() => {
    let filtered = products.filter((p: Product) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || p.categoryId === categoryFilter;
      const matchesSubCategory =
        subCategoryFilter === "all" || p.subCategoryId === subCategoryFilter;
      const matchesStatus =
        statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
    });

    filtered.sort((a: Product, b: Product) => {
      switch (sortBy) {
        case "nameAsc":
          return a.name.localeCompare(b.name);
        case "nameDesc":
          return b.name.localeCompare(a.name);
        case "priceAsc":
          return a.sellingPrice - b.sellingPrice;
        case "priceDesc":
          return b.sellingPrice - a.sellingPrice;
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "newest":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  }, [products, searchQuery, categoryFilter, subCategoryFilter, statusFilter, sortBy]);

  const columns: ColumnDef<Product>[] = [
    {
      header: t("products.table.image"),
      cell: (prod: Product) => {
        const extraImagesCount = prod.images ? prod.images.length - 1 : 0;
        return (
          <div
            className="relative w-10 h-10 rounded-lg bg-input overflow-hidden flex items-center justify-center border border-border shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => openDrawer(prod)}
            title={t("common.edit")}
          >
            {prod.images && prod.images.length > 0 ? (
              <>
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover"
                />
                {extraImagesCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-caption font-semibold">
                      +{extraImagesCount}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <ImageIcon size={20} className="text-muted-foreground" />
            )}
          </div>
        );
      },
    },
    {
      header: t("products.table.name"),
      cell: (prod: Product) => {
        const catName = categories.find((c: any) => c.id === prod.categoryId)?.name || t("products.messages.unknownCategory");
        const subCatName = allSubCategories.find((sc: any) => sc.id === prod.subCategoryId)?.name;
        
        return (
          <div className="flex flex-col">
            <span className="font-bold text-foreground">{prod.name}</span>
            <span className="text-caption text-muted-foreground truncate max-w-40">
              {subCatName ? `${catName} > ${subCatName}` : catName}
            </span>
          </div>
        );
      },
    },
    {
      header: t("products.table.price"),
      cell: (prod: Product) => (
        <div className="flex flex-col">
          <span className="font-bold">{formatCurrency(prod.sellingPrice)}</span>
          {prod.mrp && prod.mrp > prod.sellingPrice && (
            <span className="text-caption text-muted-foreground line-through">
              {formatCurrency(prod.mrp)}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("products.table.stock"),
      cell: (prod: Product) => (
        <div className="flex flex-col gap-1 items-start">
          <span className="text-description font-medium">
            {prod.stockQuantity}
          </span>
        </div>
      ),
    },
    {
      header: t("products.table.status"),
      cell: (prod: Product) => (
        <button
          onClick={() => toggleStatus(prod)}
          className="hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={prod.status} />
        </button>
      ),
    },
    {
      header: t("products.table.actions"),
      className: "text-right",
      cell: (prod: Product) => (
        <div className="flex justify-end">
          <button
            onClick={() => openDrawer(prod)}
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
        title={t("products.header.title")}
        description={t("products.header.subtitle")}
        actionLabel={t("products.header.addProduct")}
        actionIcon={<Plus size={18} />}
        onAction={() => openDrawer()}
      />

      <FilterBar>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder={t("products.filters.searchPlaceholder")}
          />
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSubCategoryFilter("all");
            }}
          >
            <option value="">{t("products.filters.categoryAll")}</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          
          {categoryFilter !== "all" && (
            <Select
              value={subCategoryFilter}
              onChange={(e) => {
                setSubCategoryFilter(e.target.value);
              }}
            >
              <option value="all">{t("products.filters.subCategoryAll")}</option>
              {subCategoriesForFilter.map((sc: any) => (
                <option key={sc.id} value={sc.id}>
                  {sc.name}
                </option>
              ))}
            </Select>
          )}

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
            }}
          >
            <option value="all">{t("products.filters.statusAll")}</option>
            <option value="Active">{t("banners.form.active", "Active")}</option>
            <option value="Inactive">{t("banners.form.inactive", "Inactive")}</option>
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
            }}
          >
            <option value="newest">{t("products.filters.sortOptions.newest")}</option>
            <option value="oldest">{t("products.filters.sortOptions.oldest")}</option>
            <option value="nameAsc">{t("products.filters.sortOptions.nameAsc")}</option>
            <option value="nameDesc">{t("products.filters.sortOptions.nameDesc")}</option>
            <option value="priceAsc">{t("products.filters.sortOptions.priceAsc")}</option>
            <option value="priceDesc">{t("products.filters.sortOptions.priceDesc")}</option>
          </Select>
        </div>
      </FilterBar>

      <div className="flex flex-col">
        <DataTable
          data={processedProducts}
          columns={columns}
          isLoading={isLoading}
          emptyTitle={t("products.messages.emptyTitle")}
          emptyDescription={t("products.messages.emptySubtitle")}
          itemsPerPage={10}
        />
      </div>

      {/* EntityDrawer has no onSubmit — ProductForm manages its own submit button */}
      <EntityDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        title={
          editingProduct
            ? t("products.form.editTitle")
            : t("products.form.addTitle")
        }
      >
        <ProductForm
          initialData={editingProduct as ProductFormValues | undefined}
          onSubmit={handleSubmitForm}
          isSubmitting={isSubmitting}
          submitLabel={
            editingProduct
              ? t("products.form.update")
              : t("products.form.create")
          }
          onCancel={closeDrawer}
        />
      </EntityDrawer>
    </div>
  );
};


