import { useState } from "react";
import { Plus, ImageIcon, Edit2 } from "lucide-react";


import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { EntityDrawer } from "../../components/ui/EntityDrawer";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ErrorState } from "../../components/ui/ErrorState";
import { formatCurrency } from "../../utils/number";

import { ProductForm } from "../../components/products/ProductForm";
import { ProductFormValues } from "../../validations/product";

import { Product } from "../../types/product";
import { useProducts } from "../../hooks/useProducts";
import { useCreateProduct, useUpdateProduct, useToggleProductStatus } from "../../hooks/useProductMutations";
import { useDebounce } from "../../hooks/useDebounce";
import { useCatalogMetadata, useSubCategoryMetadata } from "../../hooks/useCatalogMetadata";
import { useSubCategories } from "../../hooks/useSubCategories";
import { useTranslation } from "react-i18next";
import { useEntityDrawer } from "../../hooks/useEntityDrawer";

import { Pagination } from "../../components/ui/Pagination";

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

  // Pagination & Debounce
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const { mutateAsync: toggleProductStatus } = useToggleProductStatus();


  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Data via TanStack Query (cached, server-side filtered/paginated)
  const { data: responseData, isLoading, isError, refetch } = useProducts(
    debouncedSearchQuery,
    categoryFilter !== "all" ? categoryFilter : undefined,
    subCategoryFilter !== "all" ? subCategoryFilter : undefined,
    statusFilter !== "all" ? statusFilter : undefined,
    sortBy !== "newest" ? sortBy : undefined,
    currentPage,
    itemsPerPage
  );

  const products = responseData?.data || [];
  const meta = responseData?.meta || { totalPages: 1, page: 1, total: 0 };
  const { data: catalogMetadata } = useCatalogMetadata();
  const categories = catalogMetadata?.categories || [];
  const { data: allSubCategoriesResponse } = useSubCategories("", "", 1, 500);
  const allSubCategories = allSubCategoriesResponse?.data || [];
  
  // Fetch subcategories only for the selected category filter
  const { data: subCategoriesForFilter = [] } = useSubCategoryMetadata(
    categoryFilter !== "all" ? categoryFilter : undefined
  );

  const displayedSubCategories = categoryFilter === "all" ? allSubCategories : subCategoriesForFilter;


  const handleSubmitForm = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data });
      } else {
        await createProduct(data);
      }
      closeDrawer();
    } catch (error: unknown) {
      // Error handled by hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (prod: Product) => {
    try {
      await toggleProductStatus(prod.id);
    } catch {
      // Error handled by hook
    }
  };

  // Wait, no need to filter on frontend anymore since the backend handles it.

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
          <div className="flex flex-col max-w-[250px]">
            <span className="font-bold text-foreground truncate" title={prod.name}>
              {prod.name}
            </span>
            <span className="text-caption text-muted-foreground truncate" title={subCatName ? `${catName} > ${subCatName}` : catName}>
              {subCatName ? `${catName} > ${subCatName}` : catName}
            </span>
            {prod.description && (
              <span className="text-description text-muted-foreground/80 truncate mt-1" title={prod.description}>
                {prod.description}
              </span>
            )}
          </div>
        );
      },
    },
    {
      header: t("products.form.brand", "Brand"),
      cell: (prod: Product) => (
        <span className="text-foreground">
          {prod.brand || <span className="text-muted-foreground italic">-</span>}
        </span>
      ),
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
              setCurrentPage(1);
            }}
          >
            <option value="all">{t("products.filters.categoryAll")}</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          
          <Select
            value={subCategoryFilter}
            onChange={(e) => {
              setSubCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">{t("products.filters.subCategoryAll")}</option>
            {displayedSubCategories.map((sc: any) => (
              <option key={sc.id} value={sc.id}>
                {sc.name}
              </option>
            ))}
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
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
              setCurrentPage(1);
            }}
          >
            <option value="newest">{t("products.filters.sortOptions.newest")}</option>
            <option value="popularity">Popularity</option>
            <option value="priceAsc">{t("products.filters.sortOptions.priceAsc")}</option>
            <option value="priceDesc">{t("products.filters.sortOptions.priceDesc")}</option>
          </Select>
        </div>
      </FilterBar>

      <div className="flex flex-col">
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <DataTable
            data={products}
            columns={columns}
            isLoading={isLoading}
            keyExtractor={(item) => item.id}
            emptyTitle={t("products.messages.emptyTitle")}
            emptyDescription={t("products.messages.emptySubtitle")}
            pagination={false}
          />
        )}

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


