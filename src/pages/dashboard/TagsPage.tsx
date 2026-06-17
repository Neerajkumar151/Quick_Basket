import { useState, useMemo } from "react";
import { Plus, Tag as TagIcon, Edit2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { PageHeader } from "../../components/ui/PageHeader";
import { FilterBar } from "../../components/ui/FilterBar";
import { SearchInput } from "../../components/ui/SearchInput";
import { DataTable, ColumnDef } from "../../components/ui/DataTable";
import { EntityDrawer } from "../../components/ui/EntityDrawer";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { DateTimeDisplay } from "../../components/ui/DateTimeDisplay";
import { ErrorState } from "../../components/ui/ErrorState";

import { TagForm, TagFormValues } from "../../components/tags/TagForm";
import { tagService } from "../../services/tagService";
import { Tag } from "../../types/tag";
import { useTags } from "../../hooks/useTags";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "../../hooks/useDebounce";
import { TAGS_QUERY_KEY } from "../../hooks/useTags";
import { CATALOG_METADATA_QUERY_KEY } from "../../hooks/useCatalogMetadata";
import { useTranslation } from "react-i18next";
import { useEntityDrawer } from "../../hooks/useEntityDrawer";
import { Select } from "../../components/ui/Select";
import { Pagination } from "../../components/ui/Pagination";

export const TagsPage = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Drawer
  const { isOpen, editingItem: editingTag, openDrawer, closeDrawer } = useEntityDrawer<Tag>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Data via TanStack Query (cached)
  const { data: responseData, isLoading, isError, refetch } = useTags(
    debouncedSearchQuery,
    statusFilter,
    currentPage,
    itemsPerPage
  );

  const tags = responseData?.data || [];
  const meta = responseData?.meta || { totalPages: 1, page: 1, total: 0 };



  const handleSubmitForm = async (data: TagFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingTag) {
        await tagService.updateTag(editingTag.id, {
          ...data,
          status: data.status || "Active",
        });
        toast.success(t("tags.messages.successUpdate"));
      } else {
        await tagService.createTag({
          ...data,
          status: data.status || "Active",
        });
        toast.success(t("tags.messages.successCreate"));
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: [CATALOG_METADATA_QUERY_KEY] })
      ]);
      closeDrawer();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("tags.messages.errorSave");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };



  const columns: ColumnDef<Tag>[] = [
    {
      header: t("tags.table.name"),
      accessorKey: "name",
      cell: (tag: Tag) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-input/50 flex items-center justify-center text-muted-foreground border border-border">
            <TagIcon size={14} />
          </div>
          <span className="font-bold text-foreground">{tag.name}</span>
        </div>
      ),
    },
    {
      header: t("tags.table.products"),
      cell: (tag: Tag) => (
        <Link
          to={`/dashboard/products?tag=${encodeURIComponent(tag.name)}`}
          className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
          title={t("tags.messages.viewProducts")}
        >
          {tag.productsCount}
        </Link>
      ),
    },
    {
      header: t("tags.table.createdOn"),
      cell: (tag: Tag) => (
        <DateTimeDisplay 
          date={tag.createdAt} 
          format="datetime" 
          className="text-muted-foreground" 
        />
      ),
    },
    {
      header: t("tags.table.status") || "Status",
      cell: (tag: Tag) => (
        <StatusBadge status={tag.status || "Active"} />
      ),
    },
    {
      header: t("tags.table.actions"),
      className: "text-right",
      cell: (tag: Tag) => (
        <div className="flex justify-end">
          <button
            onClick={() => openDrawer(tag)}
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
        title={t("tags.header.title")}
        description={t("tags.header.subtitle")}
        actionLabel={t("tags.header.addTag")}
        actionIcon={<Plus size={18} />}
        onAction={() => openDrawer()}
      />

      <FilterBar>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full sm:w-1/2">
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={t("tags.filters.searchPlaceholder")}
          />
          <Select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="all">{t("products.filters.statusAll", "All Status")}</option>
            <option value="Active">{t("banners.form.active", "Active")}</option>
            <option value="Inactive">{t("banners.form.inactive", "Inactive")}</option>
          </Select>
        </div>
      </FilterBar>

      <div className="flex flex-col">
        {isError ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <DataTable
            data={tags}
            columns={columns}
            isLoading={isLoading}
            keyExtractor={(item) => item.id}
            emptyTitle={t("tags.messages.emptyTitle")}
            emptyDescription={t("tags.messages.emptySubtitle")}
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

      <EntityDrawer
        isOpen={isOpen}
        onClose={closeDrawer}
        title={editingTag ? t("tags.form.editTitle") : t("tags.form.addTitle")}
      >
        <TagForm
          initialData={editingTag}
          onSubmit={handleSubmitForm}
          isSubmitting={isSubmitting}
          submitLabel={
            editingTag ? t("tags.form.update") : t("tags.form.create")
          }
          onCancel={closeDrawer}
        />
      </EntityDrawer>
    </div>
  );
};
