
export const TableSkeleton = ({ rows = 5, columns = 5 }) => (
  <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
    <div className="flex gap-4 p-4 border-b border-border bg-input/50">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="h-4 bg-border/50 rounded flex-1 animate-pulse" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 p-4 border-b border-border last:border-0">
        {Array.from({ length: columns }).map((_, j) => (
          <div key={j} className="h-4 bg-border/30 rounded flex-1 animate-pulse" />
        ))}
      </div>
    ))}
  </div>
);

export const CardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4">
    <div className="h-6 bg-border/50 rounded w-1/3 animate-pulse" />
    <div className="h-10 bg-border/30 rounded w-full animate-pulse" />
    <div className="h-4 bg-border/30 rounded w-1/2 animate-pulse" />
  </div>
);
