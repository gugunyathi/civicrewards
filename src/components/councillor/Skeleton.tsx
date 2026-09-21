import clsx from "clsx";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div className={clsx("animate-pulse rounded-lg", className)} style={{ background: "rgba(255,255,255,0.06)" }} />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: "#0e0e0f", border: "1px solid rgba(255,255,255,0.08)" }}>
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
