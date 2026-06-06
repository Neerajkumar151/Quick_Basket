import { useState, useMemo } from "react";
import { Plus, ImageIcon, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { SearchInput } from "../../components/ui/SearchInput";
import { Select } from "../../components/ui/Select";
import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { EntityDrawer } from "../../components/ui/EntityDrawer";
import { Pagination } from "../../components/ui/Pagination";
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
import en from "../../locales/en.json";

export const ProductsPage = () => {
  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subCategoryFilter, setSubCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data via TanStack Query (cached, no double-fetch)
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const { data: allSubCategories = [] } = useSubCategories();
  
  // Fetch subcategories only for the selected category filter
  const { data: subCategoriesForFilter = [] } = useSubCategoriesByParent(
    categoryFilter !== "all" ? categoryFilter : undefined
  );

  const handleOpenDrawer = (product?: Product) => {
    setEditingProduct(product || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleSubmitForm = async (data: ProductFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await productService.updateProduct(editingProduct.id, data);
        toast.success(en.products.messages.successUpdate);
      } else {
        await productService.createProduct(data);
        toast.success(en.products.messages.successCreate);
      }
      // Invalidate cache so both ProductsPage and any other consumer refresh
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      handleCloseDrawer();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : en.products.messages.errorSave;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (prod: Product) => {
    try {
      const newStatus = prod.status === "Active" ? "Inactive" : "Active";
      await productService.updateProduct(prod.id, { status: newStatus });
      toast.success(en.products.messages.successStatus);
      await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
    } catch {
      toast.error(en.products.messages.errorStatus);
    }
  };

  // Processing Data (Filter -> Sort -> Paginate)
  const processedProducts = useMemo(() => {
    let filtered = products.filter((p: any) => {
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

    filtered.sort((a: any, b: any) => {
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

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: ColumnDef<Product>[] = [
    {
      header: en.products.table.image,
      cell: (prod: any) => {
        const extraImagesCount = prod.images ? prod.images.length - 1 : 0;
        return (
          <div
            className="relative w-10 h-10 rounded-lg bg-input overflow-hidden flex items-center justify-center border border-border shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleOpenDrawer(prod)}
            title="Click to edit product and view all images"
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
      header: en.products.table.name,
      cell: (prod: any) => {
        const catName = categories.find((c: any) => c.id === prod.categoryId)?.name || en.products.messages.unknownCategory;
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
      header: en.products.table.price,
      cell: (prod: any) => (
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
      header: en.products.table.stock,
      cell: (prod: any) => (
        <div className="flex flex-col gap-1 items-start">
          <span className="text-description font-medium">
            {prod.stockQuantity}
          </span>
        </div>
      ),
    },
    {
      header: en.products.table.status,
      cell: (prod: any) => (
        <button
          onClick={() => toggleStatus(prod)}
          className="hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={prod.status} />
        </button>
      ),
    },
    {
      header: en.products.table.actions,
      className: "text-right",
      cell: (prod: any) => (
        <div className="flex justify-end">
          <button
            onClick={() => handleOpenDrawer(prod)}
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
        title={en.products.header.title}
        description={en.products.header.subtitle}
        actionLabel={en.products.header.addProduct}
        actionIcon={<Plus size={18} />}
        onAction={() => handleOpenDrawer()}
      />

      <FilterBar>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={en.products.filters.searchPlaceholder}
          />
          <Select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSubCategoryFilter("all");
              setCurrentPage(1);
            }}
          >
            <option value="">{en.products.filters.categoryAll}</option>
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
                setCurrentPage(1);
              }}
            >
              <option value="all">{en.products.filters.subCategoryAll}</option>
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
              setCurrentPage(1);
            }}
          >
            <option value="all">{en.products.filters.statusAll}</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="newest">{en.products.filters.sortOptions.newest}</option>
            <option value="oldest">{en.products.filters.sortOptions.oldest}</option>
            <option value="nameAsc">{en.products.filters.sortOptions.nameAsc}</option>
            <option value="nameDesc">{en.products.filters.sortOptions.nameDesc}</option>
            <option value="priceAsc">{en.products.filters.sortOptions.priceAsc}</option>
            <option value="priceDesc">{en.products.filters.sortOptions.priceDesc}</option>
          </Select>
        </div>
      </FilterBar>

      <div className="flex flex-col">
        <DataTable
          data={paginatedProducts}
          columns={columns}
          isLoading={isLoading}
          emptyTitle={en.products.messages.emptyTitle}
          emptyDescription={en.products.messages.emptySubtitle}
        />
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* EntityDrawer has no onSubmit — ProductForm manages its own submit button */}
      <EntityDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          editingProduct
            ? en.products.form.editTitle
            : en.products.form.addTitle
        }
      >
        <ProductForm
          initialData={editingProduct as ProductFormValues | undefined}
          onSubmit={handleSubmitForm}
          isSubmitting={isSubmitting}
          submitLabel={
            editingProduct
              ? en.products.form.update
              : en.products.form.create
          }
          onCancel={handleCloseDrawer}
        />
      </EntityDrawer>
    </div>
  );
};


