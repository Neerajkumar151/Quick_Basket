import { User, Settings } from "lucide-react";
import toast from "react-hot-toast";

import { PageHeader } from "../../components/ui/PageHeader";
import { Tabs, Tab } from "../../components/ui/Tabs";
import { CardSkeleton } from "../../components/ui/LoadingSkeletons";
import { ErrorState } from "../../components/ui/ErrorState";

import { ProfileInformationTab } from "../../components/store-profile/ProfileInformationTab";
import { StoreOperationsTab } from "../../components/store-profile/StoreOperationsTab";

import { 
  useStoreProfile, 
  useStoreOperations, 
  useUpdateStoreProfile, 
  useUpdateStoreOperations 
} from "../../hooks/useStoreProfile";
import { StoreProfileUpdateInput } from "../../types/storeProfile";
import { useTranslation } from "react-i18next";

export const StoreProfilePage = () => {
  const { t } = useTranslation();
  const { data: profile, isLoading: isLoadingProfile, isError: isErrorProfile, refetch: refetchProfile } = useStoreProfile();
  const { data: operations, isLoading: isLoadingOperations, isError: isErrorOperations, refetch: refetchOperations } = useStoreOperations();
  
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateStoreProfile();
  const { mutateAsync: updateOperations, isPending: isUpdatingOperations } = useUpdateStoreOperations();

  const handleUpdateProfile = async (
    data: StoreProfileUpdateInput, 
    logoFile: File | null, 
    bannerFile: File | null
  ) => {
    try {
      await updateProfile({
        data,
        logoFile,
        bannerFile,
      });

      toast.success(t("storeProfile.messages.successUpdateProfile"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("storeProfile.messages.errorSave"));
    }
  };

  const isLoading = isLoadingProfile || isLoadingOperations;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (isErrorProfile || isErrorOperations) {
    return (
      <div className="p-6">
        <ErrorState onRetry={() => { refetchProfile(); refetchOperations(); }} />
      </div>
    );
  }

  if (!profile || !operations) {
    return <div>{t("storeProfile.messages.errorLoading")}</div>;
  }

  const tabs: Tab[] = [
    {
      id: "profile-info",
      label: t("storeProfile.tabs.profileInfo"),
      icon: <User size={16} />,
      content: (
        <ProfileInformationTab 
          profile={profile} 
          operations={operations}
          onSave={handleUpdateProfile} 
          isSubmitting={isUpdatingProfile}
        />
      ),
    },
    {
      id: "store-operations",
      label: t("storeProfile.tabs.storeOperations"),
      icon: <Settings size={16} />,
      content: (
        <StoreOperationsTab 
          operations={operations} 
          onUpdateOperations={async (data) => { await updateOperations(data); }}
          isSubmitting={isUpdatingOperations}
        />
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-12">
      <PageHeader
        title={t("storeProfile.header.title")}
        description={t("storeProfile.header.subtitle")}
      />

      <div className="w-full">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};
