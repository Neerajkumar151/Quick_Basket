import { useState, useEffect, useMemo, useRef } from "react";
import { Plus, ImageIcon, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { SearchInput } from "../../components/ui/SearchInput";
import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { EntityDrawer } from "../../components/ui/EntityDrawer";
import { Pagination } from "../../components/ui/Pagination";
import { StatusBadge } from "../../components/ui/StatusBadge";

import { BannerForm } from "../../components/banners/BannerForm";
import { BannerFormValues } from "../../validations/banner";
import { bannerService, Banner } from "../../services/bannerService";
import en from "../../locales/en.json";

export const BannersPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);


  const fetchData = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const [b] = await Promise.all([
        bannerService.getBanners()
      ]);
      setBanners(b);
    } catch (error) {
      toast.error(en.banners.messages.errorFetch);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDrawer = (banner?: Banner) => {
    setEditingBanner(banner || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingBanner(null);
  };

  const handleSubmitForm = async (
    data: BannerFormValues,
    imageFile: File | null,
  ) => {
    setIsSubmitting(true);
    try {
      let imageUrl = editingBanner?.image;
      if (imageFile) {
        imageUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      if (editingBanner) {
        await bannerService.updateBanner(editingBanner.id, {
          ...data,
          redirectName: data.redirectName || '',
          image: imageUrl,
        });
        toast.success(en.banners.messages.successUpdate);
      } else {
        await bannerService.createBanner({ 
          ...data, 
          redirectName: data.redirectName || '',
          image: imageUrl 
        });
        toast.success(en.banners.messages.successCreate);
      }

      await fetchData(false);
      handleCloseDrawer();
    } catch (error: any) {
      toast.error(error.message || en.banners.messages.errorSave);
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFormSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true }),
      );
    }
  };


  const toggleStatus = async (banner: Banner) => {
    try {
      await bannerService.toggleStatus(banner.id);
      toast.success(en.banners.messages.successStatus);
      await fetchData(false);
    } catch (error) {
      toast.error(en.banners.messages.errorStatus);
    }
  };

  // Filter & Pagination Logic
  const processedBanners = useMemo(() => {
    let result = [...banners];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) => b.title.toLowerCase().includes(q)
      );
    }
    
    // Sort by display order
    result.sort((a, b) => a.displayOrder - b.displayOrder);

    return result;
  }, [banners, searchQuery]);

  const totalPages = Math.ceil(processedBanners.length / itemsPerPage);
  const paginatedBanners = processedBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const columns: ColumnDef<Banner>[] = [
    {
      header: en.banners.table.image,
      cell: (banner) => (
        <div className="w-16 h-10 rounded-lg bg-input overflow-hidden flex items-center justify-center border border-border shadow-sm shrink-0">
          {banner.image ? (
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon size={20} className="text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      header: en.banners.table.title,
      cell: (banner) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{banner.title}</span>
          {banner.description && (
            <span className="text-caption text-muted-foreground truncate max-w-[200px]">{banner.description}</span>
          )}
        </div>
      ),
    },
    {
      header: en.banners.table.target,
      cell: (banner) => (
        <div className="flex flex-col gap-1 items-start">
          <span className="text-caption font-medium uppercase tracking-wider text-muted-foreground">{banner.redirectType}</span>
          <span className="text-description">{banner.redirectName}</span>
        </div>
      ),
    },
    {
      header: en.banners.table.order,
      accessorKey: "displayOrder",
      cell: (banner) => (
        <span className="text-description font-medium bg-input px-2 py-1 rounded border border-border">{banner.displayOrder}</span>
      )
    },
    {
      header: en.banners.table.status,
      cell: (banner) => (
        <button
          onClick={() => toggleStatus(banner)}
          className="hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={banner.status} />
        </button>
      ),
    },
    {
      header: en.banners.table.actions,
      cell: (banner) => (
        <div className="flex justify-end">
          <button
            onClick={() => handleOpenDrawer(banner)}
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
        title={en.banners.header.title}
        description={en.banners.header.subtitle}
        actionLabel={en.banners.header.addBanner}
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
            placeholder={en.banners.filters.searchPlaceholder}
          />
        </div>
      </FilterBar>

      <div className="flex flex-col">
        <DataTable
          data={paginatedBanners}
          columns={columns}
          isLoading={isLoading}
          emptyTitle={en.banners.messages.emptyTitle}
          emptyDescription={en.banners.messages.emptySubtitle}
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
          editingBanner
            ? en.banners.form.editTitle
            : en.banners.form.addTitle
        }
        onSubmit={triggerFormSubmit}
        onCancel={handleCloseDrawer}
        isSubmitting={isSubmitting}
        submitLabel={
          editingBanner
            ? en.banners.form.update
            : en.banners.form.create
        }
      >
        <BannerForm
          formRef={formRef}
          initialData={editingBanner}
          onSubmit={handleSubmitForm}
        />
      </EntityDrawer>


    </div>
  );
};
