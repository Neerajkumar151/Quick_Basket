import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Building2, Landmark, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/Button";
import { PaymentSetupFormValues } from "../../types/paymentSetup";

const paymentSetupSchema = z.object({
  businessName: z.string().min(3, "Business Name must be at least 3 characters"),
  merchantId: z.string().optional(), // Handled by RazorpayConnect now, but kept in type
  accountName: z.string().min(3, "Account Holder Name must be at least 3 characters"),
  accountNumber: z.string().min(8, "Account Number must be at least 8 digits").regex(/^\d+$/, "Account Number must contain only digits"),
  ifscCode: z.string().min(5, "IFSC Code must be at least 5 characters").regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),
  panNumber: z.string().min(5, "PAN must be at least 5 characters").regex(/^[A-Za-z0-9]+$/, "Must be alphanumeric"),
  gstNumber: z.string().optional().refine(val => !val || val.length === 15, {
    message: "GSTIN must be exactly 15 characters if provided"
  }),
});

interface PaymentAccountFormProps {
  initialData?: Partial<PaymentSetupFormValues>;
  onSubmit: (data: PaymentSetupFormValues) => Promise<void>;
  isSubmitting: boolean;
}

export const PaymentAccountForm: React.FC<PaymentAccountFormProps> = ({
  initialData,
  onSubmit,
  isSubmitting
}) => {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentSetupFormValues>({
    resolver: zodResolver(paymentSetupSchema),
    defaultValues: {
      businessName: initialData?.businessName || "",
      merchantId: initialData?.merchantId || "",
      accountName: initialData?.accountName || "",
      accountNumber: initialData?.accountNumber || "",
      ifscCode: initialData?.ifscCode || "",
      panNumber: initialData?.panNumber || "",
      gstNumber: initialData?.gstNumber || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      {/* Business Details Section */}
      <div className="space-y-4">
        <h3 className="text-h4 font-bold text-foreground flex items-center gap-2">
          <Building2 size={20} className="text-primary" />
          {t("paymentSetup.form.businessDetails")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-description font-semibold text-foreground">
              {t("paymentSetup.form.businessName")} *
            </label>
            <input
              {...register("businessName")}
              placeholder={t("paymentSetup.form.businessNamePlaceholder")}
              className={`w-full bg-input border ${errors.businessName ? 'border-error focus:ring-error/20' : 'border-border focus:ring-primary/20'} rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.businessName && <span className="text-caption text-error">{errors.businessName.message}</span>}
          </div>
        </div>
      </div>

      {/* Settlement Bank Details */}
      <div className="space-y-4">
        <h3 className="text-h4 font-bold text-foreground flex items-center gap-2">
          <Landmark size={20} className="text-primary" />
          {t("paymentSetup.form.bankDetails")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 col-span-1 md:col-span-2">
            <label className="text-description font-semibold text-foreground">
              {t("paymentSetup.form.accountName")} *
            </label>
            <input
              {...register("accountName")}
              placeholder={t("paymentSetup.form.accountNamePlaceholder")}
              className={`w-full bg-input border ${errors.accountName ? 'border-error focus:ring-error/20' : 'border-border focus:ring-primary/20'} rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.accountName && <span className="text-caption text-error">{errors.accountName.message}</span>}
          </div>
          
          <div className="space-y-2">
            <label className="text-description font-semibold text-foreground">
              {t("paymentSetup.form.accountNumber")} *
            </label>
            <input
              {...register("accountNumber")}
              placeholder={t("paymentSetup.form.accountNumberPlaceholder")}
              className={`w-full bg-input border ${errors.accountNumber ? 'border-error focus:ring-error/20' : 'border-border focus:ring-primary/20'} rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-4 transition-all`}
            />
            {errors.accountNumber && <span className="text-caption text-error">{errors.accountNumber.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-description font-semibold text-foreground">
              {t("paymentSetup.form.ifscCode")} *
            </label>
            <input
              {...register("ifscCode")}
              placeholder={t("paymentSetup.form.ifscCodePlaceholder")}
              className={`w-full bg-input border ${errors.ifscCode ? 'border-error focus:ring-error/20' : 'border-border focus:ring-primary/20'} rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-4 transition-all uppercase`}
            />
            {errors.ifscCode && <span className="text-caption text-error">{errors.ifscCode.message}</span>}
          </div>
        </div>
      </div>

      {/* Tax & Identification */}
      <div className="space-y-4">
        <h3 className="text-h4 font-bold text-foreground flex items-center gap-2">
          <FileText size={20} className="text-primary" />
          {t("paymentSetup.form.taxDetails")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-description font-semibold text-foreground">
              {t("paymentSetup.form.panNumber")} *
            </label>
            <input
              {...register("panNumber")}
              placeholder={t("paymentSetup.form.panNumberPlaceholder")}
              className={`w-full bg-input border ${errors.panNumber ? 'border-error focus:ring-error/20' : 'border-border focus:ring-primary/20'} rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-4 transition-all uppercase`}
            />
            {errors.panNumber && <span className="text-caption text-error">{errors.panNumber.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-description font-semibold text-foreground">
              {t("paymentSetup.form.gstNumber")}
            </label>
            <input
              {...register("gstNumber")}
              placeholder={t("paymentSetup.form.gstNumberPlaceholder")}
              className={`w-full bg-input border ${errors.gstNumber ? 'border-error focus:ring-error/20' : 'border-border focus:ring-primary/20'} rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:ring-4 transition-all uppercase`}
            />
            {errors.gstNumber && <span className="text-caption text-error">{errors.gstNumber.message}</span>}
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-border">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[200px]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 size={18} />
              {t("paymentSetup.form.saveConfig")}
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};
