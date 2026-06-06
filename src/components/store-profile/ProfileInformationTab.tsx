import React, { useState } from "react";
import { StoreProfile, StoreOperations, StoreProfileUpdateInput } from "../../types/storeProfile";
import { SectionCard } from "../ui/SectionCard";
import { Button } from "../ui/Button";
import { Edit2, MapPin, Phone, Mail, Image as ImageIcon, FileText, User } from "lucide-react";
import { StoreProfileForm } from "./StoreProfileForm";
import { VerificationBadge } from "./VerificationBadge";
import en from "../../locales/en.json";

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
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {/* Store Banner */}
        <div className="w-full h-32 md:h-48 bg-muted relative">
          {profile.bannerUrl ? (
            <img src={profile.bannerUrl} alt="Store Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground opacity-50">
              <ImageIcon size={32} className="mb-2" />
              <span className="text-description">{en.storeProfile.banner.empty}</span>
            </div>
          )}
          {profile.bannerUrl && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />}
        </div>

        {/* Profile Info */}
        <div className="p-6 pt-0 flex flex-col md:flex-row items-start md:items-end justify-between gap-4 relative">
          <div className="flex items-end gap-4 w-full">
            {/* Logo */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-card border-4 border-card shadow-sm flex items-center justify-center overflow-hidden shrink-0 relative z-10 -mt-10 md:-mt-12">
              {profile.logoUrl ? (
                <img src={profile.logoUrl} alt="Store Logo" className="w-full h-full object-cover bg-muted" />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <ImageIcon size={32} className="text-muted-foreground opacity-50" />
                </div>
              )}
            </div>
            
            {/* Store Name & Badges */}
            <div className="flex flex-col gap-1 pb-1">
              <h2 className="text-h1 text-foreground">{profile.storeName}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {/* Verification Badge */}
                <VerificationBadge status={profile.verificationStatus} />
                
                {/* Store Status */}
                <span className={`px-2 py-0.5 rounded-full text-caption uppercase tracking-wider ${operations.storeStatus ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {operations.storeStatus ? en.storeProfile.operations.status.open : en.storeProfile.operations.status.closed}
                </span>
              </div>
            </div>
          </div>
          
          {/* Edit Button */}
          <Button variant="primary" onClick={handleEditClick} className="shrink-0 flex items-center gap-2 md:mb-1">
            <Edit2 size={16} />
            {en.storeProfile.overview.editProfile}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Description Section */}
        <SectionCard 
          title={en.storeProfile.description.title} 
          icon={<FileText size={20} />}
          className="h-full"
        >
          <p className="text-description text-muted-foreground whitespace-pre-wrap">
            {profile.description || en.storeProfile.description.empty}
          </p>
        </SectionCard>

        <div className="flex flex-col gap-6">
          {/* Contact Section */}
          <SectionCard title={en.storeProfile.contact.title} icon={<Phone size={20} />}>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-1">
                  <User size={14} />
                </div>
                <div>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">{en.storeProfile.contact.ownerName}</p>
                  <p className="text-body font-medium text-foreground">{profile.ownerName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider">{en.storeProfile.contact.phone}</p>
                  <p className="font-semibold text-foreground">{profile.phoneNumber || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-caption text-muted-foreground uppercase tracking-wider">{en.storeProfile.contact.email}</p>
                  <p className="font-semibold text-foreground">{profile.email || "-"}</p>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Address Section */}
          <SectionCard title={en.storeProfile.address.title} icon={<MapPin size={20} />}>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-caption text-muted-foreground uppercase tracking-wider mb-1">{en.storeProfile.address.fullAddress}</p>
                <p className="font-medium text-foreground leading-relaxed">{profile.address || "-"}</p>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};
