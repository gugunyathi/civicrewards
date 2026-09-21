const EMOJI_MAP: Record<string, string> = {
  water: "💧",
  roads: "🛣️",
  electricity: "⚡",
  city_power: "⚡",
  eskom: "🔌",
  refuse: "🗑️",
  safety: "🛡️",
  billing: "💳",
  parks: "🌿",
  other: "📋",
  emergency: "🚨",
};

const COLOR_MAP: Record<string, string> = {
  water: "#0A84FF",
  roads: "#FF9F0A",
  electricity: "#FFD60A",
  city_power: "#FFD60A",
  eskom: "#FFD60A",
  refuse: "#30D158",
  safety: "#BF5AF2",
  billing: "#FF9F0A",
  parks: "#30D158",
  other: "#8899aa",
  emergency: "#FF453A",
};

export function getCategoryColor(category: string): string {
  return COLOR_MAP[category] ?? "#8899aa";
}

export default function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
  const emoji = EMOJI_MAP[category] ?? EMOJI_MAP["other"];
  return (
    <span role="img" aria-label={category} style={{ fontSize: size, lineHeight: 1, display: "inline-block" }}>
      {emoji}
    </span>
  );
}
