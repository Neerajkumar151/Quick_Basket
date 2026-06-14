import { useState, useMemo } from "react";
import { PageHeader } from "../../components/ui/PageHeader";
import { Accordion, AccordionItem } from "../../components/ui/Accordion";
import { Drawer } from "../../components/ui/Drawer";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { Select } from "../../components/ui/Select";
import { SearchInput } from "../../components/ui/SearchInput";
import { Phone, Mail, Clock, MessageSquarePlus, Box, Settings, ShoppingBag, CreditCard, LifeBuoy, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

const issueSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  type: z.string().min(1, "Issue type is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type IssueFormValues = z.infer<typeof issueSchema>;

export const HelpPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<IssueFormValues>({
    resolver: zodResolver(issueSchema),
  });

  const handleReportIssue = async (_data: IssueFormValues) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Simulating API call...
    toast.success(t("help.reportIssue.success" as any) || "Issue reported successfully");
    reset();
    setIsReportDrawerOpen(false);
  };

  const rawFaqs = Object.values(t("help.faq.questions", { returnObjects: true }) as Record<string, { q: string, a: string }>);
  
  const faqs: AccordionItem[] = useMemo(() => {
    return rawFaqs
      .filter((q: any) => {
        const query = searchQuery.toLowerCase();
        return q.q.toLowerCase().includes(query) || q.a.toLowerCase().includes(query);
      })
      .map((q, idx) => ({
        id: `faq-${idx}`,
        title: q.q,
        content: q.a,
      }));
  }, [searchQuery, rawFaqs]);

  const categories = [
    { id: "gettingStarted", title: t("help.faq.gettingStarted"), icon: LifeBuoy },
    { id: "products", title: t("help.faq.products"), icon: Box },
    { id: "orders", title: t("help.faq.orders"), icon: ShoppingBag },
    { id: "operations", title: t("help.faq.operations"), icon: Settings },
    { id: "payments", title: t("help.faq.payments"), icon: CreditCard },
  ];

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-300 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader title={t("help.header.title")} description={t("help.header.subtitle")} />
        <Button onClick={() => setIsReportDrawerOpen(true)}>
          <MessageSquarePlus size={18} className="mr-2" />
          {t("help.reportIssue.button")}
        </Button>
      </div>

      {/* Informational Support Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Mail size={24} />
          </div>
          <div>
            <h3 className="text-body font-bold text-foreground">{t("help.contact.email.title")}</h3>
            <p className="text-description text-muted-foreground mt-1">{t("help.contact.email.value")}</p>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Phone size={24} />
          </div>
          <div>
            <h3 className="text-body font-bold text-foreground">{t("help.contact.phone.title")}</h3>
            <p className="text-description text-muted-foreground mt-1">{t("help.contact.phone.value")}</p>
          </div>
        </div>
        <div className="bg-card border border-border p-5 rounded-xl shadow-sm flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <h3 className="text-body font-bold text-foreground">{t("help.contact.hours.title")}</h3>
            <p className="text-description text-muted-foreground mt-1">{t("help.contact.hours.value")}</p>
          </div>
        </div>
      </div>

      {/* Help Center Categories */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat: any) => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center gap-2 hover:border-primary/50 hover:bg-input/30 transition-colors cursor-pointer group">
              <Icon size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-caption font-semibold text-foreground">{cat.title}</span>
            </div>
          );
        })}
      </div>

      {/* FAQ Section with Search */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-h3 font-bold text-foreground">{t("help.faq.title")}</h2>
          <div className="w-full sm:w-72">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("help.search.placeholder")}
            />
          </div>
        </div>
        
        {faqs.length > 0 ? (
          <Accordion items={faqs} />
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-muted-foreground opacity-50" />
            </div>
            <p className="text-body font-semibold text-foreground">{t("help.faq.emptyState.title")}</p>
            <p className="text-description text-muted-foreground mt-1">{t("help.faq.emptyState.subtitle")}</p>
          </div>
        )}
      </div>

      {/* Report Issue Drawer */}
      <Drawer
        isOpen={isReportDrawerOpen}
        onClose={() => setIsReportDrawerOpen(false)}
        title={t("help.reportIssue.title")}
      >
        <form onSubmit={handleSubmit(handleReportIssue)} className="flex flex-col gap-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-2">
            <p className="text-description text-foreground font-medium">
              {t("help.reportIssue.descriptionText")}
            </p>
          </div>
          
          <Input
            label={t("help.reportIssue.subject")}
            {...register("subject")}
            error={errors.subject?.message}
            placeholder={t("help.reportIssue.placeholders.subject")}
          />
          <Select
            label={t("help.reportIssue.type")}
            {...register("type")}
            error={errors.type?.message}
          >
            <option value="">{t("help.reportIssue.types.select")}</option>
            <option value="technical">{t("help.reportIssue.types.technical")}</option>
            <option value="order">{t("help.reportIssue.types.order")}</option>
            <option value="payment">{t("help.reportIssue.types.payment")}</option>
            <option value="other">{t("help.reportIssue.types.other")}</option>
          </Select>
          <TextArea
            label={t("help.reportIssue.description")}
            {...register("description")}
            error={errors.description?.message}
            rows={6}
            placeholder={t("help.reportIssue.placeholders.description")}
          />
          <div className="pt-4 border-t border-border flex justify-end gap-3 mt-4">
            <Button type="button" variant="outline" onClick={() => setIsReportDrawerOpen(false)}>
              {t("help.reportIssue.cancel")}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? t("help.reportIssue.submitting") : t("help.reportIssue.submit")}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
};
