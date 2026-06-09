import React, { useState } from "react";
import { StoreProfile, StoreOperations, StoreProfileUpdateInput } from "../../types/storeProfile";
import { SectionCard } from "../ui/SectionCard";
import { Button } from "../ui/Button";
import { Edit2, MapPin, Phone, Mail, FileText, User } from "lucide-react";
import { StoreProfileForm } from "./StoreProfileForm";
import { StoreInfoHeader } from "./StoreInfoHeader";
import { useTranslation } from "react-i18next";

interface ProfileInformationTabProps {
  profile: StoreProfile;
  operations: StoreOperations;
  onSave: (data: StoreProfileUpdateInput, logoFile: File | null, bannerFile: File | null) => Promise<void>;
  isSubmitting: boolean;
}

export const ProfileInformationTab: React.FC<ProfileInformationTabProps> = ({
  profile,
  operations,
  onSave,
  isSubmitting,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (data: StoreProfileUpdateInput, logoFile: File | null, bannerFile: File | null) => {
    await onSave(data, logoFile, bannerFile);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <StoreProfileForm
        profile={profile}
        operations={operations}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
        isSubmitting={isSubmitting}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* Unified Header Section */}
      <StoreInfoHeader 
        profile={profile} 
        operations={operations} 
        actionButton={
          <Button variant="primary" onClick={handleEditClick}>
            <Edit2 size={16} className="mr-2" />
            {t("storeProfile.overview.editProfile")}
          </Button>
        } 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description Section */}
        <SectionCard 
          title={t("storeProfile.description.title")} 
          icon={<FileText size={20} />}
          className="h-full"
        >
          <p className="text-description text-muted-foreground whitespace-pre-wrap">
            {profile.description || t("storeProfile.description.empty")}
          </p>
        </SectionCard>

        <div className="flex flex-col gap-6">
          {/* Contact Section */}
          <SectionCard title={t("storeProfile.contact.title")} icon={<Phone size={20} />}>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">{t("storeProfile.contact.ownerName")}</p>
                  <p className="text-body font-medium text-foreground">{profile.ownerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider">{t("storeProfile.contact.phone")}</p>
                  <p className="font-semibold text-foreground">{profile.phoneNumber || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider">{t("storeProfile.contact.email")}</p>
                  <p className="font-semibold text-foreground">{profile.email || "-"}</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Address Section */}
          <SectionCard title={t("storeProfile.address.title")} icon={<MapPin size={20} />}>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">{t("storeProfile.address.fullAddress")}</p>
                <p className="font-medium text-foreground leading-relaxed">{profile.address || "-"}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
