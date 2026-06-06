import React, { useState } from "react";
import {
  User, Phone, Mail, MapPin, Package,
  CreditCard, ReceiptText, CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";

import { EntityDrawer } from "../ui/EntityDrawer";
import { OrderTimeline } from "./OrderTimeline";
import { StatusBadge } from "../ui/StatusBadge";
import { Button } from "../ui/Button";
import { Order, ORDER_STATUS, ORDER_FLOW, OrderStatus } from "../../types/order";
import { orderService } from "../../services/orderService";
import { formatCurrency } from "../../utils/number";
import { formatDateTime } from "../../utils/date";
import en from "../../locales/en.json";

interface OrderDetailsDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated: (updated: Order) => void;
}

// ─── Label for action buttons per transition ──────────────────────────────────
const ACTION_LABELS: Partial<Record<OrderStatus, string>> = {
  [ORDER_STATUS.ACCEPTED]: "Accept Order",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "Mark Out for Delivery",
  [ORDER_STATUS.DELIVERED]: "Mark Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancel Order",
};

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onStatusUpdated,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const allowedTransitions = ORDER_FLOW[order.status];

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const updated = await orderService.updateOrderStatus(order.id, newStatus);
      toast.success(`Order ${order.id} updated to "${newStatus}"`);
      onStatusUpdated(updated);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <EntityDrawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Order ${order.id}`}
    >
      <div className="flex flex-col gap-6 pb-4">

        {/* ── Status + Date ─────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-caption text-muted-foreground">
              {formatDateTime(order.orderDate)}
            </span>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* ── Section 1: Customer Information ──────────────────────── */}
        <Section title={en.orders.drawer.customer} icon={<User size={16} />}>
          <InfoRow label={en.orders.drawer.name} value={order.customerName} />
          <InfoRow
            label={en.orders.drawer.phone}
            value={order.customerPhone}
            icon={<Phone size={12} className="text-muted-foreground" />}
          />
          <InfoRow
            label={en.orders.drawer.email}
            value={order.customerEmail}
            icon={<Mail size={12} className="text-muted-foreground" />}
          />
        </Section>

        {/* ── Section 2: Delivery Address ───────────────────────────── */}
        <Section title={en.orders.drawer.address} icon={<MapPin size={16} />}>
          <p className="text-description text-foreground leading-relaxed">
            {order.address.flatNo}, {order.address.area},<br />
            {order.address.city} – {order.address.pincode},<br />
            {order.address.state}
          </p>
        </Section>

        {/* ── Section 3: Ordered Products ───────────────────────────── */}
        <Section title={en.orders.drawer.items} icon={<Package size={16} />}>
          <div className="flex flex-col gap-2">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-description text-foreground">
                  {item.productName}{" "}
                  <span className="text-muted-foreground">× {item.quantity}</span>
                </span>
                <span className="text-description font-medium">
                  {formatCurrency(item.unitPrice * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Section 4: Payment Information ───────────────────────── */}
        <Section title={en.orders.drawer.payment} icon={<CreditCard size={16} />}>
          <InfoRow label={en.orders.drawer.paymentMethod} value={order.payment.method} />
          <div className="flex items-center justify-between">
            <span className="text-caption text-muted-foreground">{en.orders.drawer.paymentStatus}</span>
            <StatusBadge
              status={order.payment.status}
              className="text-[10px]"
            />
          </div>
          {order.payment.transactionId && (
            <InfoRow label={en.orders.drawer.transactionId} value={order.payment.transactionId} />
          )}
        </Section>

        {/* ── Section 5: Amount Breakdown ───────────────────────────── */}
        <Section title={en.orders.drawer.breakdown} icon={<ReceiptText size={16} />}>
          <div className="flex flex-col gap-1.5">
            <AmountRow label={en.orders.drawer.subtotal} value={order.subtotal} />
            <AmountRow label={en.orders.drawer.deliveryFee} value={order.deliveryFee} />
            <AmountRow label={en.orders.drawer.tax} value={order.tax} />
            <div className="border-t border-border pt-2 mt-1">
              <AmountRow label={en.orders.drawer.total} value={order.total} bold />
            </div>
          </div>
        </Section>

        {/* ── Section 6: Order Timeline ─────────────────────────────── */}
        <Section title={en.orders.drawer.timeline} icon={<CheckCircle2 size={16} />}>
          <OrderTimeline timeline={order.timeline} currentStatus={order.status} />
        </Section>

        {/* ── Status Actions ────────────────────────────────────────── */}
        {allowedTransitions.length > 0 && (
          <div className="flex flex-col gap-2 pt-2 border-t border-border">
            <span className="text-caption font-semibold text-muted-foreground uppercase tracking-wide">
              {en.orders.drawer.actions}
            </span>
            <div className="flex flex-wrap gap-2">
              {allowedTransitions.map((nextStatus: OrderStatus) => (
                <Button
                  key={nextStatus}
                  variant={nextStatus === ORDER_STATUS.CANCELLED ? "outline" : "primary"}
                  disabled={isUpdating}
                  onClick={() => handleStatusChange(nextStatus)}
                  className={
                    nextStatus === ORDER_STATUS.CANCELLED
                      ? "border-error/50 text-error hover:bg-error/10"
                      : ""
                  }
                >
                  {isUpdating ? "Updating..." : ACTION_LABELS[nextStatus] ?? nextStatus}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Terminal states */}
        {order.status === ORDER_STATUS.DELIVERED && (
          <div className="flex items-center gap-2 text-success text-description font-medium py-2 border-t border-border">
            <CheckCircle2 size={16} />
            {en.orders.drawer.completed}
          </div>
        )}
        {order.status === ORDER_STATUS.CANCELLED && (
          <div className="flex items-center gap-2 text-error text-description font-medium py-2 border-t border-border">
            {en.orders.drawer.cancelled}
          </div>
        )}
      </div>
    </EntityDrawer>
  );
};

// ─── Helper sub-components ────────────────────────────────────────────────────
const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title, icon, children,
}) => (
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-2 pb-2 border-b border-border">
      <span className="text-primary">{icon}</span>
      <h3 className="text-body font-semibold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

const InfoRow: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({
  label, value, icon,
}) => (
  <div className="flex items-center justify-between gap-2">
    <span className="text-caption text-muted-foreground">{label}</span>
    <span className="flex items-center gap-1 text-description text-foreground font-medium text-right">
      {icon}
      {value}
    </span>
  </div>
);

const AmountRow: React.FC<{ label: string; value: number; bold?: boolean }> = ({
  label, value, bold,
}) => (
  <div className="flex items-center justify-between">
    <span className={`text-description ${bold ? "font-bold text-foreground" : "text-muted-foreground"}`}>
      {label}
    </span>
    <span className={`text-description ${bold ? "font-bold text-foreground" : "text-foreground"}`}>
      {formatCurrency(value)}
    </span>
  </div>
);
