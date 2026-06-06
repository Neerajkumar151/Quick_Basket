import { useState, useMemo } from "react";
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
import { bannerService } from "../../services/bannerService";
import { Banner } from "../../types/banner";
import { useBanners } from "../../hooks/useBanners";
import { queryClient } from "../../providers/QueryProvider";
import { BANNERS_QUERY_KEY } from "../../hooks/useBanners";
import en from "../../locales/en.json";

export const BannersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data via TanStack Query (cached)
  const { data: banners = [], isLoading } = useBanners();

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
    imageFile: File | null
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
          redirectName: data.redirectName || "",
          image: imageUrl,
        });
        toast.success(en.banners.messages.successUpdate);
      } else {
        await bannerService.createBanner({
          ...data,
          redirectName: data.redirectName || "",
          image: imageUrl,
        });
        toast.success(en.banners.messages.successCreate);
      }

      await queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY });
      handleCloseDrawer();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : en.banners.messages.errorSave;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (banner: Banner) => {
    try {
      await bannerService.toggleStatus(banner.id);
      toast.success(en.banners.messages.successStatus);
      await queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY });
    } catch {
      toast.error(en.banners.messages.errorStatus);
    }
  };

  // Filter & Pagination Logic
  const processedBanners = useMemo(() => {
    let result = [...banners];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((b: any) => b.title.toLowerCase().includes(q));
    }

    // Sort by display order
    result.sort((a: any, b: any) => a.displayOrder - b.displayOrder);

    return result;
  }, [banners, searchQuery]);

  const totalPages = Math.ceil(processedBanners.length / itemsPerPage);
  const paginatedBanners = processedBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: ColumnDef<Banner>[] = [
    {
      header: en.banners.table.image,
      cell: (banner: any) => (
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
      cell: (banner: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-foreground">{banner.title}</span>
          {banner.description && (
            <span className="text-caption text-muted-foreground truncate max-w-[200px]">
              {banner.description}
            </span>
          )}
        </div>
      ),
    },
    {
      header: en.banners.table.target,
      cell: (banner: any) => (
        <div className="flex flex-col gap-1 items-start">
          <span className="text-caption font-medium uppercase tracking-wider text-muted-foreground">
            {banner.redirectType}
          </span>
          <span className="text-description">{banner.redirectName}</span>
        </div>
      ),
    },
    {
      header: en.banners.table.order,
      accessorKey: "displayOrder",
      cell: (banner: any) => (
        <span className="text-description font-medium bg-input px-2 py-1 rounded border border-border">
          {banner.displayOrder}
        </span>
      ),
    },
    {
      header: en.banners.table.status,
      cell: (banner: any) => (
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
      cell: (banner: any) => (
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

      {/* EntityDrawer has no onSubmit — BannerForm manages its own submit button */}
      <EntityDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={
          editingBanner
            ? en.banners.form.editTitle
            : en.banners.form.addTitle
        }
      >
        <BannerForm
          initialData={editingBanner}
          onSubmit={handleSubmitForm}
          isSubmitting={isSubmitting}
          submitLabel={
            editingBanner ? en.banners.form.update : en.banners.form.create
          }
          onCancel={handleCloseDrawer}
        />
      </EntityDrawer>
    </div>
  );
};
