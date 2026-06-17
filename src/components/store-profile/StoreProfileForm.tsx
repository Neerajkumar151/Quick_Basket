import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StoreProfile,
  StoreOperations,
  StoreProfileUpdateInput,
} from "../../types/storeProfile";
import {
  createStoreProfileSchema,
  StoreProfileFormValues,
} from "../../validations/storeProfileSchema";
import { useTranslation } from "react-i18next";
import { SectionCard } from "../ui/SectionCard";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { TextArea } from "../ui/TextArea";
import { ImageUploader } from "../ui/ImageUploader";
import { Phone, Mail, MapPin, FileText, Save, X, User, Clock } from "lucide-react";
import { VerificationBadge } from "./VerificationBadge";
import { formatDateTime } from "../../utils/date";
interface StoreProfileFormProps {
  profile: StoreProfile;
  operations: StoreOperations;
  onSave: (
    data: StoreProfileUpdateInput,
    logoFile: File | null,
    bannerFile: File | null,
  ) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const StoreProfileForm: React.FC<StoreProfileFormProps> = ({
  profile,
  operations,
  onSave,
  onCancel,
  isSubmitting,
}) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<StoreProfileFormValues>({
    resolver: zodResolver(createStoreProfileSchema(t)),
    defaultValues: {
      storeName: profile.storeName,
      ownerName: profile.ownerName,
      description: profile.description || "",
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      address: profile.address,
      businessType: profile.businessType || "",
      gstNumber: profile.gstNumber || "",
      panNumber: profile.panNumber || "",
    },
  });

  useEffect(() => {
    reset({
      storeName: profile.storeName,
      ownerName: profile.ownerName,
      description: profile.description || "",
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      address: profile.address,
      businessType: profile.businessType || "",
      gstNumber: profile.gstNumber || "",
      panNumber: profile.panNumber || "",
    });
    setLogoFile(null);
    setBannerFile(null);
  }, [profile, reset]);

  const handleFormSubmit = async (data: StoreProfileFormValues) => {
    await onSave(data, logoFile, bannerFile);
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayHours = operations.businessHours.find((bh) => bh.day === today);
  const hoursText = todayHours?.enabled
    ? `${todayHours.openingTime} - ${todayHours.closingTime}`
    : t("storeProfile.operations.status.closed", "Closed Today");

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-6 animate-in fade-in duration-300"
    >
      {/* Unified Header Section */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Store Banner */}
        <div className="w-full h-32 md:h-48 relative bg-muted/30">
          <ImageUploader
            label=""
            previewUrl={profile.bannerUrl}
            onFileSelect={setBannerFile}
            previewClassName="w-full h-full rounded-none border-0"
            emptyClassName="w-full h-full rounded-none border-0 bg-transparent hover:bg-muted/50 transition-colors"
            className="absolute inset-0 z-0 h-full !gap-0"
            aspectRatio={3}
            maxWidth={1200}
            maxHeight={400}
            quality={0.8}
          />
        </div>

        {/* Profile Info */}
        <div className="p-6 pt-0 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 relative">
          <div className="flex items-end gap-4 w-full">
            {/* Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-card border-4 border-card shadow-sm flex items-center justify-center shrink-0 relative z-10 -mt-10 md:-mt-12 group/logo overflow-hidden">
              <ImageUploader
                label=""
                className="w-full h-full !gap-0"
                previewUrl={profile.logoUrl}
                onFileSelect={setLogoFile}
                previewClassName="w-full h-full rounded-full border-0"
                emptyClassName="w-full h-full rounded-full border-2 border-dashed bg-muted/50 hover:bg-muted transition-colors"
                compact={true}
                aspectRatio={1}
              />
            </div>

            {/* Store Name Input & Details */}
            <div className="flex flex-col gap-1 pb-1 w-full">
              <div className="flex items-center gap-2 mb-1">
                <Input
                  {...register("storeName")}
                  error={errors.storeName?.message}
                  wrapperClassName="w-auto"
                  placeholder={t("storeProfile.form.storeName")}
                  className="text-h1 font-bold h-10 w-full min-w-[200px] max-w-xs border-dashed bg-transparent hover:bg-input/50 focus:bg-background transition-colors px-2 -ml-2"
                />
                <VerificationBadge status={profile.verificationStatus} />
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-description text-muted-foreground ml-1">
                <div className={`flex items-center gap-1.5 font-medium ${operations.storeStatus ? "text-status-delivered" : "text-status-cancelled"}`}>
                <span className={`w-2 h-2 rounded-full ${operations.storeStatus ? "bg-status-delivered animate-pulse" : "bg-status-cancelled"}`} />
                {operations.storeStatus ? t("storeProfile.operations.status.open") : t("storeProfile.operations.status.closed")}
              </div>
              {todayHours?.enabled && (
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {hoursText}
                </div>
              )}
                <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
                <div className={`flex items-center gap-1.5 font-medium ${operations.deliveryEnabled ? "text-status-delivered" : "text-status-cancelled"}`}>
                  {operations.deliveryEnabled ? "Delivery Enabled" : "Delivery Disabled"}
                </div>
                <div className="hidden md:block w-1 h-1 rounded-full bg-border" />
                <span className="hidden md:block">
                  {t("storeProfile.overview.lastUpdated")}: {formatDateTime(profile.lastUpdated)}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 flex items-center gap-2 md:mb-1">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X size={16} className="mr-2" />
              {t("storeProfile.form.cancel")}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                t("common.saving", "Saving...")
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {t("storeProfile.form.save")}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Details Section */}
        <SectionCard
          title={t("storeProfile.details.title", "Store Details")}
          icon={<FileText size={20} />}
          className="h-full"
        >
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-caption text-muted-foreground uppercase tracking-wider mb-2">{t("storeProfile.details.storeType", "Store Type")}</p>
              <Select
                {...register("businessType")}
                error={errors.businessType?.message}
                value={watch("businessType")}
              >
                <option value="" disabled>{t("storeProfile.details.selectBusinessType", "Select Business Type")}</option>
                <option value="individual">{t("storeProfile.details.individual", "Individual")}</option>
                <option value="proprietorship">Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="pvtLtd">Private Limited</option>
              </Select>
            </div>
            
            {profile.businessRegistrationDate && (
              <div>
                <p className="text-caption text-muted-foreground uppercase tracking-wider mb-2">{t("storeProfile.details.registrationDate", "Registration Date")}</p>
                <Input
                  value={profile.businessRegistrationDate}
                  disabled
                  className="bg-muted cursor-not-allowed opacity-70"
                />
              </div>
            )}

            <div>
              <p className="text-caption text-muted-foreground uppercase tracking-wider mb-2">{t("storeProfile.details.verificationStatus", "Verification Status")}</p>
              <div className="h-10 flex items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border 
                  ${profile.verificationStatus === 'verified' ? 'bg-status-delivered/10 text-status-delivered border-status-delivered/20' : 
                    profile.verificationStatus === 'pending' ? 'bg-status-outForDelivery/10 text-status-outForDelivery border-status-outForDelivery/20' : 
                    'bg-status-cancelled/10 text-status-cancelled border-status-cancelled/20'}`}
                >
                  {profile.verificationStatus}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-caption text-muted-foreground uppercase tracking-wider mb-2">{t("storeProfile.details.gstNumber", "GST Number")}</p>
                <Input
                  {...register("gstNumber")}
                  error={errors.gstNumber?.message}
                  placeholder={t("common.optional", "Optional")}
                  className="uppercase"
                />
              </div>
              <div>
                <p className="text-caption text-muted-foreground uppercase tracking-wider mb-2">{t("storeProfile.details.panNumber", "PAN Number")}</p>
                <Input
                  {...register("panNumber")}
                  error={errors.panNumber?.message}
                  placeholder="PAN"
                  className="uppercase"
                />
              </div>
            </div>

            <div>
              <p className="text-caption text-muted-foreground uppercase tracking-wider mb-2">{t("storeProfile.details.description", "Description")}</p>
              <TextArea
                {...register("description")}
                error={errors.description?.message}
                rows={3}
                placeholder={t("storeProfile.details.descriptionPlaceholder", "Describe your store")}
              />
            </div>
          </div>
        </SectionCard>

        <div className="flex flex-col gap-6">
          {/* Contact Section */}
          <SectionCard
            title={t("storeProfile.contact.title")}
            icon={<Phone size={20} />}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <User size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">
                    {t("storeProfile.contact.ownerName")}
                  </p>
                  <Input
                    {...register("ownerName")}
                    error={errors.ownerName?.message}
                    disabled
                    className="bg-muted cursor-not-allowed opacity-70"
                  />
                  <p className="text-caption text-muted-foreground mt-1">
                    {t("storeProfile.contact.ownerNameReadOnly")}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <Phone size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">
                    {t("storeProfile.contact.phone")}
                  </p>
                  <Input
                    {...register("phoneNumber")}
                    error={errors.phoneNumber?.message}
                  />
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <Mail size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">
                    {t("storeProfile.contact.email")}
                  </p>
                  <Input
                    {...register("email")}
                    error={errors.email?.message}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Address Section */}
          <SectionCard
            title={t("storeProfile.address.title")}
            icon={<MapPin size={20} />}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                <MapPin size={14} />
              </div>
              <div className="flex-1">
                <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">
                  {t("storeProfile.address.fullAddress")}
                </p>
                <TextArea
                  {...register("address")}
                  error={errors.address?.message}
                  rows={2}
                />
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </form>
  );
};
