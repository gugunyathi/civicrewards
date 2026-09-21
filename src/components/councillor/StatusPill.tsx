type Status = "pending" | "escalated" | "resolved" | "generic";

const CONFIG: Record<Status, { label: string; color: string; bg: string }> = {
  pending: { label: "New", color: "#FF9F0A", bg: "rgba(255,159,10,0.12)" },
  escalated: { label: "Escalated", color: "#0A84FF", bg: "rgba(10,132,255,0.12)" },
  resolved: { label: "Resolved", color: "#30D158", bg: "rgba(48,209,88,0.12)" },
  generic: { label: "Generic", color: "#8e8e93", bg: "rgba(142,142,147,0.12)" },
};

export default function StatusPill({ status, size = "md" }: { status: Status; size?: "sm" | "md" }) {
  const { label, color, bg } = CONFIG[status];
  const px = size === "sm" ? "px-2.5 py-0.5" : "px-3 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium tracking-wide text-xs ${px}`}
      style={{ color, backgroundColor: bg }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block shrink-0" style={{ backgroundColor: color }} />
      {label}
    </span>
  );
}
