import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StoreProfile,
  StoreOperations,
  StoreProfileUpdateInput,
} from "../../types/storeProfile";
import {
  storeProfileSchema,
  StoreProfileFormValues,
} from "../../validations/storeProfileSchema";
import { SectionCard } from "../ui/SectionCard";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { TextArea } from "../ui/TextArea";
import { ImageUploader } from "../ui/ImageUploader";
import { Phone, Mail, MapPin, FileText, Save, X, User } from "lucide-react";
import { VerificationBadge } from "./VerificationBadge";
import en from "../../locales/en.json";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<StoreProfileFormValues>({
    resolver: zodResolver(storeProfileSchema),
    defaultValues: {
      storeName: profile.storeName,
      ownerName: profile.ownerName,
      description: profile.description,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      address: profile.address,
    },
  });

  useEffect(() => {
    reset({
      storeName: profile.storeName,
      ownerName: profile.ownerName,
      description: profile.description,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      address: profile.address,
    });
    setLogoFile(null);
    setBannerFile(null);
  }, [profile, reset]);

  const handleFormSubmit = async (data: StoreProfileFormValues) => {
    await onSave(data, logoFile, bannerFile);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-6 animate-in fade-in duration-300"
    >
      {/* Unified Header Section */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Store Banner */}
        <div className="w-full h-32 md:h-48 relative border-b border-border bg-muted/30">
          <ImageUploader
            label=""
            previewUrl={profile.bannerUrl}
            onFileSelect={setBannerFile}
            previewClassName="w-full h-full rounded-none border-0"
            emptyClassName="w-full h-full rounded-none border-0 bg-transparent hover:bg-muted/50 transition-colors"
            className="absolute inset-0 z-0 h-full !gap-0"
          />
        </div>

        {/* Profile Info */}
        <div className="p-6 pt-0 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 relative">
          <div className="flex items-end gap-4 w-full">
            {/* Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-card border-4 border-card shadow-sm flex items-center justify-center shrink-0 relative z-10 -mt-10 md:-mt-12 group/logo">
              <ImageUploader
                label=""
                className="w-full h-full !gap-0"
                previewUrl={profile.logoUrl}
                onFileSelect={setLogoFile}
                previewClassName="w-full h-full rounded-lg border-0"
                emptyClassName="w-full h-full rounded-lg border-2 border-dashed bg-muted/50 hover:bg-muted transition-colors"
                compact={true}
              />
            </div>

            {/* Store Name Input & Badges */}
            <div className="flex flex-col gap-1 pb-1 w-full max-w-sm">
              <Input
                {...register("storeName")}
                error={errors.storeName?.message}
                placeholder={en.storeProfile.form.storeName}
                className="text-h1 font-bold h-10 border-dashed bg-transparent hover:bg-input/50 focus:bg-background transition-colors -ml-3"
              />
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {/* Verification Badge */}
                <VerificationBadge status={profile.verificationStatus} />

                {/* Store Status */}
                <span
                  className={`px-2 py-0.5 rounded-full text-caption uppercase tracking-wider ${operations.storeStatus ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                >
                  {operations.storeStatus
                    ? en.storeProfile.operations.status.open
                    : en.storeProfile.operations.status.closed}
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
              {en.storeProfile.form.cancel}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? (
                "..."
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {en.storeProfile.form.save}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description Section */}
        <SectionCard
          title={en.storeProfile.description.title}
          icon={<FileText size={20} />}
          className="h-full"
        >
          <TextArea
            {...register("description")}
            error={errors.description?.message}
            rows={6}
          />
        </SectionCard>

        <div className="flex flex-col gap-6">
          {/* Contact Section */}
          <SectionCard
            title={en.storeProfile.contact.title}
            icon={<Phone size={20} />}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <User size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">
                    {en.storeProfile.contact.ownerName}
                  </p>
                  <Input
                    {...register("ownerName")}
                    error={errors.ownerName?.message}
                    disabled
                    className="bg-muted cursor-not-allowed opacity-70"
                  />
                  <p className="text-caption text-muted-foreground mt-1">
                    {en.storeProfile.contact.ownerNameReadOnly}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <Phone size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">
                    {en.storeProfile.contact.phone}
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
                    {en.storeProfile.contact.email}
                  </p>
                  <Input
                    {...register("email")}
                    error={errors.email?.message}
                    disabled
                    className="bg-muted cursor-not-allowed opacity-70"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">
                    {en.storeProfile.contact.emailReadOnly}
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Address Section */}
          <SectionCard
            title={en.storeProfile.address.title}
            icon={<MapPin size={20} />}
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                <MapPin size={14} />
              </div>
              <div className="flex-1">
                <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">
                  {en.storeProfile.address.fullAddress}
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
