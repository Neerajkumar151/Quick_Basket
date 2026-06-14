import React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Order, ORDER_STATUS, OrderStatus } from "../../types/order";
import { formatDateTime } from "../../utils/date";

interface OrderTimelineProps {
  timeline: Order["timeline"];
  currentStatus: OrderStatus;
}

const ALL_STEPS: OrderStatus[] = [
  ORDER_STATUS.PENDING,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  timeline,
  currentStatus,
}) => {
  const isCancelled = currentStatus === ORDER_STATUS.CANCELLED;

  const getEntry = (status: OrderStatus) =>
    timeline.find((t: any) => t.status === status);

  const getStepIndex = (status: OrderStatus) => ALL_STEPS.indexOf(status);

  const cancelEntry = timeline.find((t: any) => t.status === ORDER_STATUS.CANCELLED);

  return (
    <div className="flex flex-col gap-0">
      {isCancelled ? (
        // ── Cancelled flow ─────────────────────────────────────────────
        <>
          <TimelineRow
            icon={<CheckCircle2 size={18} className="text-success" />}
            label={ORDER_STATUS.PENDING}
            timestamp={getEntry(ORDER_STATUS.PENDING)?.timestamp}
            isCompleted
            isLast={false}
          />
          <TimelineRow
            icon={<XCircle size={18} className="text-error" />}
            label={ORDER_STATUS.CANCELLED}
            timestamp={cancelEntry?.timestamp}
            note={cancelEntry?.note}
            isCompleted
            isLast
            isCancelled
          />
        </>
      ) : (
        // ── Normal flow ────────────────────────────────────────────────
        ALL_STEPS.map((step, idx) => {
          const entry = getEntry(step);
          const isCompleted = !!entry;
          const isLast = idx === ALL_STEPS.length - 1;

          return (
            <TimelineRow
              key={step}
              icon={
                isCompleted ? (
                  <CheckCircle2 size={18} className="text-success" />
                ) : (
                  <Clock size={18} className="text-muted-foreground/40" />
                )
              }
              label={step}
              timestamp={entry?.timestamp}
              isCompleted={isCompleted}
              isLast={isLast}
            />
          );
        })
      )}
    </div>
  );
};

// ─── Row sub-component ────────────────────────────────────────────────────────
interface TimelineRowProps {
  icon: React.ReactNode;
  label: string;
  timestamp?: string;
  note?: string;
  isCompleted: boolean;
  isLast: boolean;
  isCancelled?: boolean;
}

const TimelineRow: React.FC<TimelineRowProps> = ({
  icon,
  label,
  timestamp,
  note,
  isCompleted,
  isLast,
  isCancelled,
}) => (
  <div className="flex gap-4">
    {/* Icon + connector line */}
    <div className="flex flex-col items-center">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
          isCompleted
            ? isCancelled
              ? "border-error/30 bg-error/10"
              : "border-success/30 bg-success/10"
            : "border-border bg-muted/50"
        }`}
      >
        {icon}
      </div>
      {!isLast && (
        <div
          className={`w-0.5 flex-1 my-1 min-h-[24px] ${
            isCompleted ? "bg-success/30" : "bg-border"
          }`}
        />
      )}
    </div>

    {/* Content */}
    <div className={`pb-5 flex flex-col justify-center ${isLast ? "pb-0" : ""}`}>
      <span
        className={`text-body font-semibold ${
          isCompleted ? (isCancelled ? "text-error" : "text-foreground") : "text-muted-foreground/50"
        }`}
      >
        {label === ORDER_STATUS.PENDING ? "Order Placed" : label}
      </span>
      {timestamp && (
        <span className="text-caption text-muted-foreground mt-0.5">
          {formatDateTime(timestamp)}
        </span>
      )}
      {note && (
        <span className="text-caption text-error mt-0.5">{note}</span>
      )}
    </div>
  </div>
);
