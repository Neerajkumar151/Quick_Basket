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

import { TagForm, TagFormValues } from "../../components/tags/TagForm";
import { tagService } from "../../services/tagService";
import { Tag } from "../../types/tag";
import { useTags } from "../../hooks/useTags";
import { queryClient } from "../../providers/QueryProvider";
import { TAGS_QUERY_KEY } from "../../hooks/useTags";
import { useTranslation } from "react-i18next";
import { useEntityDrawer } from "../../hooks/useEntityDrawer";

export const TagsPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");

  // Drawer
  const { isOpen, editingItem: editingTag, openDrawer, closeDrawer } = useEntityDrawer<Tag>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Data via TanStack Query (cached)
  const { data: tags = [], isLoading } = useTags();



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

      await queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
      closeDrawer();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : t("tags.messages.errorSave");
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleStatus = async (tag: Tag) => {
    try {
      await tagService.toggleStatus(tag.id);
      toast.success(
        t("tags.messages.successStatus") || "Status updated successfully"
      );
      await queryClient.invalidateQueries({ queryKey: TAGS_QUERY_KEY });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("tags.messages.errorStatus")
      );
    }
  };

  // Filter Logic
  const filteredTags = useMemo(() => {
    return tags.filter((t: Tag) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tags, searchQuery]);

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
      accessorKey: "createdAt",
      className: "text-muted-foreground",
    },
    {
      header: t("tags.table.status") || "Status",
      cell: (tag: Tag) => (
        <button
          onClick={() => toggleStatus(tag)}
          className="hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={tag.status || "Active"} />
        </button>
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
        <div className="w-full sm:w-72">
          <SearchInput
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder={t("tags.filters.searchPlaceholder")}
          />
        </div>
      </FilterBar>

      <div className="flex flex-col">
        <DataTable
          data={filteredTags}
          columns={columns}
          isLoading={isLoading}
          emptyTitle={t("tags.messages.emptyTitle")}
          emptyDescription={t("tags.messages.emptySubtitle")}
          itemsPerPage={10}
        />
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
