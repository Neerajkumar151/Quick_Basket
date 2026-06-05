import { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Tag as TagIcon, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

import { PageHeader } from '../../components/ui/PageHeader';
import { FilterBar } from '../../components/ui/FilterBar';
import { SearchInput } from '../../components/ui/SearchInput';
import { Select } from '../../components/ui/Select';
import { DataTable, ColumnDef } from '../../components/ui/DataTable';
import { Toggle } from '../../components/ui/Toggle';
import { EntityDrawer } from '../../components/ui/EntityDrawer';
import { Pagination } from '../../components/ui/Pagination';

import { TagForm, TagFormValues } from '../../components/tags/TagForm';
import { tagService, Tag } from '../../services/tagService';
import en from '../../locales/en.json';

export const TagsPage = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const fetchTags = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const data = await tagService.getTags();
      setTags(data);
    } catch (error) {
      toast.error("Failed to fetch tags");
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleOpenDrawer = (tag?: Tag) => {
    setEditingTag(tag || null);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setEditingTag(null);
  };

  const handleSubmitForm = async (data: TagFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingTag) {
        await tagService.updateTag(editingTag.id, data);
        toast.success(en.tags.messages.successUpdate);
      } else {
        await tagService.createTag(data);
        toast.success(en.tags.messages.successCreate);
      }
      
      await fetchTags(false);
      handleCloseDrawer();
    } catch (error: any) {
      toast.error(error.message || "Failed to save tag");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerFormSubmit = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
    }
  };

  // Filter & Pagination Logic
  const filteredTags = useMemo(() => {
    return tags.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [tags, searchQuery]);

  const totalPages = Math.ceil(filteredTags.length / itemsPerPage);
  const paginatedTags = filteredTags.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: ColumnDef<Tag>[] = [
    {
      header: en.tags.table.name,
      accessorKey: 'name',
      cell: (t) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-input/50 flex items-center justify-center text-muted-foreground border border-border">
            <TagIcon size={14} />
          </div>
          <span className="font-bold text-foreground">{t.name}</span>
        </div>
      )
    },
    {
      header: en.tags.table.products,
      cell: (t) => (
        <Link 
          to={`/dashboard/products?tag=${encodeURIComponent(t.name)}`}
          className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
          title={en.tags.messages.viewProducts}
        >
          {t.productsCount}
        </Link>
      )
    },
    {
      header: en.tags.table.createdOn,
      accessorKey: 'createdAt',
      className: "text-muted-foreground"
    },
    {
      header: en.tags.table.actions,
      className: "text-right",
      cell: (t) => (
        <div className="flex justify-end">
          <button 
            onClick={() => handleOpenDrawer(t)}
            className="flex items-center gap-2 px-3 py-1.5 text-description font-medium text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <PageHeader 
        title={en.tags.header.title}
        description={en.tags.header.subtitle}
        actionLabel={en.tags.header.addTag}
        actionIcon={<Plus size={18} />}
        onAction={() => handleOpenDrawer()}
      />

      <FilterBar>
        <div className="w-full sm:w-72">
          <SearchInput 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            placeholder={en.tags.filters.searchPlaceholder}
          />
        </div>
      </FilterBar>

      <div className="flex flex-col">
        <DataTable 
          data={paginatedTags}
          columns={columns}
          isLoading={isLoading}
          emptyTitle={en.tags.messages.emptyTitle}
          emptyDescription={en.tags.messages.emptySubtitle}
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
        title={editingTag ? en.tags.form.editTitle : en.tags.form.addTitle}
        onSubmit={triggerFormSubmit}
        onCancel={handleCloseDrawer}
        isSubmitting={isSubmitting}
        submitLabel={editingTag ? en.tags.form.update : en.tags.form.create}
      >
        <TagForm 
          formRef={formRef}
          initialData={editingTag}
          onSubmit={handleSubmitForm}
        />
      </EntityDrawer>
    </div>
  );
};
