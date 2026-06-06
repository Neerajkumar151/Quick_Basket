import { useState, useEffect, useMemo, useRef } from "react";
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
import { productService, Product } from "../../services/productService";
import { categoryService, Category } from "../../services/categoryService";
import en from "../../locales/en.json";

export const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Sorting
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const fetchData = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const [prods, cats] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (error) {
      toast.error(en.products.messages.errorFetch);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      await fetchData(false);
      handleCloseDrawer();
    } catch (error: any) {
      toast.error(error.message || en.products.messages.errorSave);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFormSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const toggleStatus = async (prod: Product) => {
    try {
      const newStatus = prod.status === "Active" ? "Inactive" : "Active";
      await productService.updateProduct(prod.id, { status: newStatus });
      toast.success(en.products.messages.successStatus);
      await fetchData(false);
    } catch (error) {
      toast.error(en.products.messages.errorStatus);
    }
  };

  // Processing Data (Filter -> Sort -> Paginate)
  const processedProducts = useMemo(() => {
    let filtered = products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "nameAsc": return a.name.localeCompare(b.name);
        case "nameDesc": return b.name.localeCompare(a.name);
        case "priceAsc": return a.sellingPrice - b.sellingPrice;
        case "priceDesc": return b.sellingPrice - a.sellingPrice;
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [products, searchQuery, categoryFilter, statusFilter, sortBy]);

  const totalPages = Math.ceil(processedProducts.length / itemsPerPage);
  const paginatedProducts = processedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: ColumnDef<Product>[] = [
    {
      header: en.products.table.image,
      cell: (prod) => {
        const extraImagesCount = prod.images ? prod.images.length - 1 : 0;
        return (
          <div 
            className="relative w-10 h-10 rounded-lg bg-input overflow-hidden flex items-center justify-center border border-border shadow-sm cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleOpenDrawer(prod)}
            title="Click to edit product and view all images"
          >
            {prod.images && prod.images.length > 0 ? (
              <>
                <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                {extraImagesCount > 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-caption font-semibold">+{extraImagesCount}</span>
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
      cell: (prod) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{prod.name}</span>
          <span className="text-caption text-muted-foreground truncate max-w-40">
            {categories.find(c => c.id === prod.categoryId)?.name || "Unknown"}
          </span>
        </div>
      ),
    },
    {
      header: en.products.table.price,
      cell: (prod) => (
        <div className="flex flex-col">
          <span className="font-bold">{formatCurrency(prod.sellingPrice)}</span>
          {prod.mrp && prod.mrp > prod.sellingPrice && (
            <span className="text-caption text-muted-foreground line-through">{formatCurrency(prod.mrp)}</span>
          )}
        </div>
      ),
    },
    {
      header: en.products.table.stock,
      cell: (prod) => {
        return (
          <div className="flex flex-col gap-1 items-start">
            <span className="text-description font-medium">{prod.stockQuantity}</span>
          </div>
        );
      },
    },
    {
      header: en.products.table.status,
      cell: (prod) => (
        <button onClick={() => toggleStatus(prod)} className="hover:opacity-80 transition-opacity">
          <StatusBadge status={prod.status} />
        </button>
      ),
    },
    {
      header: en.products.table.actions,
      className: "text-right",
      cell: (prod) => (
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
          <Select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">{en.products.filters.categoryAll}</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">{en.products.filters.statusAll}</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
          <Select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
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

      <EntityDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={editingProduct ? en.products.form.editTitle : en.products.form.addTitle}
        onSubmit={triggerFormSubmit}
        onCancel={handleCloseDrawer}
        isSubmitting={isSubmitting}
        submitLabel={editingProduct ? en.products.form.update : en.products.form.create}
      >
        <ProductForm
          formRef={formRef as any}
          initialData={editingProduct as ProductFormValues | undefined}
          onSubmit={handleSubmitForm}
        />
      </EntityDrawer>

    </div>
  );
};
