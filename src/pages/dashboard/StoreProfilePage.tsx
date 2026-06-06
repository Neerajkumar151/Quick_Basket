import { User, Settings } from "lucide-react";
import toast from "react-hot-toast";

import { PageHeader } from "../../components/ui/PageHeader";
import { Tabs, Tab } from "../../components/ui/Tabs";
import { CardSkeleton } from "../../components/ui/LoadingSkeletons";

import { ProfileInformationTab } from "../../components/store-profile/ProfileInformationTab";
import { StoreOperationsTab } from "../../components/store-profile/StoreOperationsTab";

import { 
  useStoreProfile, 
  useStoreOperations, 
  useUpdateStoreProfile, 
  useUpdateStoreOperations 
} from "../../hooks/useStoreProfile";
import { StoreProfileUpdateInput } from "../../types/storeProfile";
import en from "../../locales/en.json";

export const StoreProfilePage = () => {
  const { data: profile, isLoading: isLoadingProfile } = useStoreProfile();
  const { data: operations, isLoading: isLoadingOperations } = useStoreOperations();
  
  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } = useUpdateStoreProfile();
  const { mutateAsync: updateOperations, isPending: isUpdatingOperations } = useUpdateStoreOperations();

  const handleUpdateProfile = async (
    data: StoreProfileUpdateInput, 
    logoFile: File | null, 
    bannerFile: File | null
  ) => {
    try {
      let logoUrl = profile?.logoUrl;
      let bannerUrl = profile?.bannerUrl;
      
      // Simulate file upload logic by reading to data URL
      if (logoFile) {
        logoUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(logoFile);
        });
      }
      
      if (bannerFile) {
        bannerUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(bannerFile);
        });
      }

      await updateProfile({
        ...data,
        logoUrl,
        bannerUrl,
      });

      toast.success(en.storeProfile.messages.successUpdateProfile);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : en.storeProfile.messages.errorSave);
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

  if (!profile || !operations) {
    return <div>{en.storeProfile.messages.errorLoading}</div>;
  }

  const tabs: Tab[] = [
    {
      id: "profile-info",
      label: en.storeProfile.tabs.profileInfo,
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
      label: en.storeProfile.tabs.storeOperations,
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
        title={en.storeProfile.header.title}
        description={en.storeProfile.header.subtitle}
      />

      <div className="w-full">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};
