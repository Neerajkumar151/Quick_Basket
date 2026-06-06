import React from "react";
import { StoreOperations } from "../../types/storeProfile";
import { SectionCard } from "../ui/SectionCard";
import { Toggle } from "../ui/Toggle";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Settings, Clock, Truck, Save } from "lucide-react";
import en from "../../locales/en.json";
import toast from "react-hot-toast";

interface StoreOperationsTabProps {
  operations: StoreOperations;
  onUpdateOperations: (data: Partial<StoreOperations>) => Promise<void>;
  isSubmitting: boolean;
}

export const StoreOperationsTab: React.FC<StoreOperationsTabProps> = ({
  operations,
  onUpdateOperations,
  isSubmitting,
}) => {
  const [formData, setFormData] = React.useState<StoreOperations>(operations);

  // Sync state if props change
  React.useEffect(() => {
    setFormData(operations);
  }, [operations]);

  const handleSave = async () => {
    // Validation
    const hasEnabledDay = formData.businessHours.some((bh) => bh.enabled);
    if (!hasEnabledDay) {
      toast.error(en.storeProfile.messages.validationWorkingDays);
      return;
    }
    
    if (formData.estimatedDeliveryTime <= 0) {
      toast.error(en.storeProfile.messages.validationDeliveryTime);
      return;
    }
    
    if (formData.minimumOrderAmount < 0) {
      toast.error(en.storeProfile.messages.validationMinOrder);
      return;
    }

    try {
      await onUpdateOperations(formData);
      toast.success(en.storeProfile.messages.successUpdateOperations);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : en.storeProfile.messages.errorSave);
    }
  };

  const updateBusinessHour = (index: number, updates: Partial<StoreOperations["businessHours"][0]>) => {
    const newHours = [...formData.businessHours];
    newHours[index] = { ...newHours[index], ...updates };
    setFormData({ ...formData, businessHours: newHours });
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Store Status */}
      <SectionCard 
        title={en.storeProfile.operations.status.title} 
        description={en.storeProfile.operations.status.description}
        icon={<Settings size={20} />}
        action={
          <Toggle 
            checked={formData.storeStatus} 
            onCheckedChange={(checked) => setFormData({ ...formData, storeStatus: checked })} 
          />
        }
      >
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-foreground">{en.storeProfile.operations.status.currentStatus}</h4>
            <p className="text-description text-muted-foreground mt-1">
              {en.storeProfile.operations.status.statusDescription}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-caption font-bold uppercase tracking-wide ${formData.storeStatus ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
            {formData.storeStatus ? en.storeProfile.operations.status.open : en.storeProfile.operations.status.closed}
          </span>
        </div>
      </SectionCard>

      {/* Business Hours */}
      <SectionCard 
        title={en.storeProfile.operations.businessHours.title} 
        description={en.storeProfile.operations.businessHours.description}
        icon={<Clock size={20} />}
      >
        <div className="overflow-x-auto border border-border rounded-lg shadow-sm">
          <table className="w-full text-left text-description whitespace-nowrap">
            <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider text-caption border-b border-border">
              <tr>
                <th className="px-6 py-4">{en.storeProfile.operations.businessHours.table.day}</th>
                <th className="px-6 py-4 text-center">{en.storeProfile.operations.businessHours.table.enabled}</th>
                <th className="px-6 py-4">{en.storeProfile.operations.businessHours.table.open}</th>
                <th className="px-6 py-4">{en.storeProfile.operations.businessHours.table.close}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {formData.businessHours.map((bh, index) => (
                <tr key={bh.day} className={`transition-colors hover:bg-muted/30 ${!bh.enabled ? 'opacity-60 bg-muted/10' : ''}`}>
                  <td className="px-6 py-4 font-medium text-foreground">{bh.day}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <Toggle 
                        checked={bh.enabled} 
                        onCheckedChange={(checked) => updateBusinessHour(index, { enabled: checked })} 
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="time" 
                      value={bh.openingTime}
                      onChange={(e) => updateBusinessHour(index, { openingTime: e.target.value })}
                      disabled={!bh.enabled}
                      className="px-3 py-2 bg-background border border-input rounded-md text-description focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input 
                      type="time" 
                      value={bh.closingTime}
                      onChange={(e) => updateBusinessHour(index, { closingTime: e.target.value })}
                      disabled={!bh.enabled}
                      className="px-3 py-2 bg-background border border-input rounded-md text-description focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Delivery Settings */}
      <SectionCard 
        title={en.storeProfile.operations.delivery.title} 
        description={en.storeProfile.operations.delivery.description}
        icon={<Truck size={20} />}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <h4 className="font-semibold text-foreground">{en.storeProfile.operations.delivery.enableDelivery}</h4>
              <p className="text-description text-muted-foreground mt-1">{en.storeProfile.operations.delivery.description}</p>
            </div>
            <Toggle 
              checked={formData.deliveryEnabled} 
              onCheckedChange={(checked) => setFormData({ ...formData, deliveryEnabled: checked })} 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input 
              type="number"
              label={en.storeProfile.operations.delivery.minimumOrder}
              value={formData.minimumOrderAmount}
              onChange={(e) => setFormData({ ...formData, minimumOrderAmount: Number(e.target.value) })}
              min={0}
              disabled={!formData.deliveryEnabled}
            />
            <Input 
              type="number"
              label={en.storeProfile.operations.delivery.estimatedTime}
              value={formData.estimatedDeliveryTime}
              onChange={(e) => setFormData({ ...formData, estimatedDeliveryTime: Number(e.target.value) })}
              min={1}
              disabled={!formData.deliveryEnabled}
            />
          </div>
        </div>
      </SectionCard>

      {/* Save Action */}
      <div className="flex justify-end pt-4 pb-12">
        <Button 
          variant="primary" 
          onClick={handleSave} 
          disabled={isSubmitting}
          className="w-full sm:w-auto min-w-[150px] flex items-center justify-center gap-2"
        >
          {isSubmitting ? "..." : (
            <>
              <Save size={18} />
              {en.storeProfile.form.save}
            </>
          )}
        </Button>
      </div>

    </div>
  );
};
