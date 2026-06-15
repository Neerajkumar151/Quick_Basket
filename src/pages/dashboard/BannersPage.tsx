import { useState, useMemo } from "react";
import { Plus, ImageIcon, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

import { PageHeader } from "../../components/ui/PageHeader";

import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { EntityDrawer } from "../../components/ui/EntityDrawer";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { ErrorState } from "../../components/ui/ErrorState";

import { BannerForm } from "../../components/banners/BannerForm";
import { BannerFormValues } from "../../validations/banner";
import { bannerService } from "../../services/bannerService";
import { Banner } from "../../types/banner";
import { useBanners } from "../../hooks/useBanners";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";
import { BANNERS_QUERY_KEY } from "../../hooks/useBanners";
import { useTranslation } from "react-i18next";
import { useEntityDrawer } from "../../hooks/useEntityDrawer";

export const BannersPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Drawer
  const { isOpen, editingItem: editingBanner, openDrawer, closeDrawer } = useEntityDrawer<Banner>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data via TanStack Query (cached)
  const { data: banners = [], isLoading, isError, refetch } = useBanners();



  const handleSubmitForm = async (
    data: BannerFormValues,
    imageFile: File | null
  ) => {
    setIsSubmitting(true);
    try {
      if (editingBanner) {
        await bannerService.updateBanner(editingBanner.id, {
          ...data,
          redirectName: data.redirectName || "",
        }, imageFile);
        toast.success(t("banners.messages.successUpdate"));
      } else {
        await bannerService.createBanner({
          ...data,
          redirectName: data.redirectName || "",
        }, imageFile);
        toast.success(t("banners.messages.successCreate"));
      }

      await queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY });
      closeDrawer();
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : t("banners.messages.errorSave");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (banner: Banner) => {
    try {
      await bannerService.toggleStatus(banner.id);
      toast.success(t("banners.messages.successStatus"));
      await queryClient.invalidateQueries({ queryKey: BANNERS_QUERY_KEY });
    } catch {
      toast.error(t("banners.messages.errorStatus"));
    }
  };

  const processedBanners = useMemo(() => {
    const result = [...banners];
    // Sort by display order
    result.sort((a: Banner, b: Banner) => a.displayOrder - b.displayOrder);
    return result;
  }, [banners]);

  const columns: ColumnDef<Banner>[] = [
    {
      header: t("banners.table.image"),
      cell: (banner: Banner) => (
        <div className="w-16 h-10 rounded-lg bg-input overflow-hidden flex items-center justify-center border border-border shadow-sm shrink-0">
          {banner.image ? (
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover transition-opacity duration-300"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <ImageIcon size={20} className="text-muted-foreground" />
          )}
        </div>
      ),
    },

    {
      header: t("banners.table.target"),
      cell: (banner: Banner) => (
        <div className="flex flex-col gap-1 items-start">
          <span className="text-caption font-medium uppercase tracking-wider text-muted-foreground">
            {banner.redirectType}
          </span>
          <span className="text-description">{banner.redirectName}</span>
        </div>
      ),
    },
    {
      header: t("banners.table.order"),
      accessorKey: "displayOrder",
      cell: (banner: Banner) => (
        <span className="text-description font-medium bg-input px-2 py-1 rounded border border-border">
          {banner.displayOrder}
        </span>
      ),
    },
    {
      header: t("banners.table.status"),
      cell: (banner: Banner) => (
        <button
          onClick={() => toggleStatus(banner)}
          className="hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={banner.status} />
        </button>
      ),
    },
    {
      header: t("banners.table.actions"),
      cell: (banner: Banner) => (
        <div className="flex justify-end">
          <button
            onClick={() => openDrawer(banner)}
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
        title={t("banners.header.title")}
        description={t("banners.header.subtitle")}
        actionLabel={t("banners.header.addBanner")}
        actionIcon={<Plus size={18} />}
        onAction={() => openDrawer()}
      />

      <div className="flex flex-col">
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <DataTable
            data={processedBanners}
            columns={columns}
            isLoading={isLoading}
            keyExtractor={(item) => item.id}
            emptyTitle={t("banners.messages.emptyTitle")}
            emptyDescription={t("banners.messages.emptySubtitle")}
            itemsPerPage={10}
          />
        )}
      </div>

      <EntityDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        title={
          editingBanner
            ? t("banners.form.editTitle")
            : t("banners.form.addTitle")
        }
      >
        <BannerForm
          initialData={editingBanner}
          onSubmit={handleSubmitForm}
          isSubmitting={isSubmitting}
          submitLabel={
            editingBanner ? t("banners.form.update") : t("banners.form.create")
          }
          onCancel={closeDrawer}
        />
      </EntityDrawer>
    </div>
  );
};
