import React from "react";
import {
  User, Phone, Mail, MapPin, Package,
  CreditCard, ReceiptText, CheckCircle2, X
} from "lucide-react";


import { Modal } from "../ui/Modal";
import { OrderTimeline } from "./OrderTimeline";
import { StatusBadge } from "../ui/StatusBadge";
import { Button } from "../ui/Button";
import { Order, ORDER_STATUS, ORDER_FLOW, OrderStatus } from "../../types/order";
import { useUpdateOrderStatus } from "../../hooks/useOrderMutations";
import { formatCurrency } from "../../utils/number";
import { formatDateTime } from "../../utils/date";
import { useTranslation } from "react-i18next";

interface OrderDetailsModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (updated: Order) => void;
}

// Remove ACTION_LABELS from module level, moved inside component

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  const { t } = useTranslation();
  const { mutateAsync: updateOrderStatus, isPending: isUpdating } = useUpdateOrderStatus();

  if (!order) return null;

  const ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
    [ORDER_STATUS.PROCESSING]: t("orders.actions.accept", "Accept Order"),
    [ORDER_STATUS.OUT_FOR_DELIVERY]: t("orders.actions.outForDelivery", "Mark Out for Delivery"),
    [ORDER_STATUS.DELIVERED]: t("orders.actions.delivered", "Mark Delivered"),
    [ORDER_STATUS.CANCELLED]: t("orders.actions.cancel", "Cancel Order"),
  };

  const allowedTransitions = ORDER_FLOW[order.status] || [];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      await updateOrderStatus({ id: order.id, status: newStatus });
      // The hook will invalidate orders, but we might want to update the local selectedOrder immediately
      onStatusUpdated({ ...order, status: newStatus });
      onClose(); // Optional: close modal or just let it update
    } catch (err: any) {
      // Error handled by hook's toast
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t("orders.modal.title", `Order #${order.id.split('-')[0]?.toUpperCase()}`, { id: `#${order.id.split('-')[0]?.toUpperCase()}` })}
      maxWidth="4xl"
    >
      <div className="flex flex-col gap-6">
        {/* ── Status + Date Header ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border">
          <div className="flex flex-col gap-1">
            <span className="text-body font-semibold text-foreground">
              {t("orders.drawer.orderPlacedOn", "Order Placed On")}
            </span>
            <span className="text-description text-muted-foreground">
              {formatDateTime(order.orderDate)}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-description font-medium text-foreground">{t("orders.drawer.currentStatus", "Current Status:")}</span>
            <StatusBadge status={order.status} className="text-sm px-3 py-1" />
          </div>
        </div>

        {/* ── 2-Column Layout ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* ── Section 1: Customer Information ──────────────────────── */}
            <Section title={t("orders.drawer.customer")} icon={<User size={18} />}>
              <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-sm">
                <InfoRow label={t("orders.drawer.name")} value={order.customerName} />
                <InfoRow
                  label={t("orders.drawer.phone")}
                  value={order.customerPhone}
                  icon={<Phone size={14} className="text-muted-foreground" />}
                />
                <InfoRow
                  label={t("orders.drawer.email")}
                  value={order.customerEmail}
                  icon={<Mail size={14} className="text-muted-foreground" />}
                />
              </div>
            </Section>

            {/* ── Section 2: Delivery Address ───────────────────────────── */}
            <Section title={t("orders.drawer.address")} icon={<MapPin size={18} />}>
              <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                <p className="text-description text-foreground leading-relaxed">
                  {order.address.flatNo}, {order.address.area},<br />
                  {order.address.city} – {order.address.pincode},<br />
                  {order.address.state}
                </p>
              </div>
            </Section>

            {/* ── Section 4: Payment Information ───────────────────────── */}
            <Section title={t("orders.drawer.payment")} icon={<CreditCard size={18} />}>
              <div className="bg-card border border-border p-4 rounded-xl space-y-3 shadow-sm">
                <InfoRow label={t("orders.drawer.paymentMethod")} value={order.payment.method} />
                <div className="flex items-center justify-between">
                  <span className="text-description text-muted-foreground">{t("orders.drawer.paymentStatus")}</span>
                  <StatusBadge
                    status={order.payment.status}
                    className="text-caption"
                  />
                </div>
                {order.payment.transactionId && (
                  <InfoRow label={t("orders.drawer.transactionId")} value={order.payment.transactionId} />
                )}
              </div>
            </Section>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-8">
            {/* ── Section 3: Ordered Products ───────────────────────────── */}
            <Section title={t("orders.drawer.items")} icon={<Package size={18} />}>
              <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between pb-3 border-b border-border last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-description font-medium text-foreground">
                        {item.productName}
                      </span>
                      <span className="text-caption text-muted-foreground">
                        {formatCurrency(item.unitPrice)} × {item.quantity}
                      </span>
                    </div>
                    <span className="text-description font-bold text-foreground">
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── Section 5: Amount Breakdown ───────────────────────────── */}
            <Section title={t("orders.drawer.breakdown")} icon={<ReceiptText size={18} />}>
              <div className="bg-card border border-border p-4 rounded-xl space-y-2 shadow-sm">
                <AmountRow label={t("orders.drawer.subtotal")} value={order.subtotal} />
                <AmountRow label={t("orders.drawer.deliveryFee")} value={order.deliveryFee} />
                <AmountRow label={t("orders.drawer.tax")} value={order.tax} />
                <div className="border-t border-border pt-3 mt-2">
                  <AmountRow label={t("orders.drawer.total")} value={order.total} bold />
                </div>
              </div>
            </Section>

            {/* ── Section 6: Order Timeline ─────────────────────────────── */}
            <Section title={t("orders.drawer.timeline")} icon={<CheckCircle2 size={18} />}>
              <div className="bg-card border border-border p-4 rounded-xl shadow-sm">
                <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
              </div>
            </Section>
          </div>
        </div>

        {/* ── Status Actions (Footer) ─────────────────────────────────── */}
        <div className="mt-4 pt-6 border-t border-border flex flex-col gap-4">
          {allowedTransitions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full">
              {allowedTransitions.map((nextStatus: OrderStatus) => (
                <Button
                  key={nextStatus}
                  variant={nextStatus === ORDER_STATUS.CANCELLED ? "outline" : "primary"}
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(nextStatus)}
                  className={
                    nextStatus === ORDER_STATUS.CANCELLED
                      ? "border-error/50 text-error hover:bg-error/10 w-full sm:w-auto"
                      : "w-full sm:w-auto"
                  }
                >
                  {isUpdating ? t("orders.actions.updating", "Updating...") : ACTION_LABELS[nextStatus] ?? nextStatus}
                </Button>
              ))}
            </div>
          )}

          {/* Terminal states */}
          {order.status === ORDER_STATUS.DELIVERED && (
            <div className="flex items-center justify-center gap-2 text-success text-description font-medium p-3 bg-success/10 rounded-xl border border-success/20">
              <CheckCircle2 size={20} />
              {t("orders.drawer.completed")}
            </div>
          )}
          {order.status === ORDER_STATUS.CANCELLED && (
            <div className="flex items-center justify-center gap-2 text-error text-description font-medium p-3 bg-error/10 rounded-xl border border-error/20">
              <X size={20} />
              {t("orders.drawer.cancelled")}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

// ─── Helper sub-components ────────────────────────────────────────────────────
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title, icon, children,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2">
      <span className="text-primary">{icon}</span>
      <h3 className="text-body font-bold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoRow: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({
  label, value, icon,
}) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-description text-muted-foreground min-w-max">{label}</span>
    <span className="flex items-center gap-1.5 text-description text-foreground font-medium text-right truncate">
      {icon}
      <span className="truncate">{value}</span>
    </span>
  </div>
);

const AmountRow: React.FC<{ label: string; value: number; bold?: boolean }> = ({
  label, value, bold,
}) => (
  <div className="flex items-center justify-between">
    <span className={`text-description ${bold ? "text-body font-bold text-foreground" : "text-muted-foreground"}`}>
      {label}
    </span>
    <span className={`text-description ${bold ? "text-body font-bold text-primary" : "text-foreground font-medium"}`}>
      {formatCurrency(value)}
    </span>
  </div>
);
