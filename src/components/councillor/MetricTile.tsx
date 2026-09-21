type Props = {
  label: string;
  value: string | number;
  accent?: "white" | "lime" | "amber" | "green" | "red" | "blue";
  sublabel?: string;
};

const ACCENT_MAP: Record<string, string> = {
  white: "#f5f5f4",
  lime: "#C6FF3D",
  amber: "#FF9F0A",
  green: "#30D158",
  red: "#FF453A",
  blue: "#0A84FF",
};

export default function MetricTile({ label, value, accent = "white", sublabel }: Props) {
  const color = ACCENT_MAP[accent];
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-2"
      style={{ background: "#0e0e0f", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      <p className="text-xs font-medium tracking-widest uppercase" style={{ color: "rgba(245,245,244,0.45)" }}>
        {label}
      </p>
      <p className="text-3xl font-semibold leading-none" style={{ color }}>
        {value}
      </p>
      {sublabel && (
        <p className="text-xs" style={{ color: "rgba(245,245,244,0.35)" }}>
          {sublabel}
        </p>
      )}
    </div>
  );
}
