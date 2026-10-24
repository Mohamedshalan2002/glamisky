// Product colors are display names ("Champagne", "Gold/Grey"); CSS can't use those directly.
const HEX: Record<string, string> = {
  black: '#1A1A1A', obsidian: '#1A1022', noir: '#1A1A1A', midnight: '#1B2140', charcoal: '#3A3A40',
  slate: '#5B6370', smoke: '#7C7C84', grey: '#9A9AA2', gunmetal: '#4A4F57',
  white: '#FFFFFF', ivory: '#F6F1E7', cream: '#F2E8D5', pearl: '#EFE9E4', natural: '#E5D8C0', clear: '#E8EEF2',
  champagne: '#E7D3A8', sand: '#D9C3A0', camel: '#C19A6B', tan: '#C8A27A', taupe: '#A39485', butter: '#F6E7A6',
  cognac: '#9A4A22', brown: '#6B4423', tortoise: '#7A4B2A', havana: '#6A3E22', amber: '#C98A2B', terracotta: '#C4623F',
  blush: '#F0C9CF', pink: '#F2A7C3', rose: '#D98AA2', dusty: '#C99AA6', translucent: '#F4E4EA',
  red: '#C0262D', burgundy: '#6D1A33', magenta: '#C8196E',
  sage: '#A7B79A', green: '#2F6B4F', emerald: '#0F6B4F',
  navy: '#1D2B53', blue: '#6C8EBF', pale: '#CFE0F2', lavender: '#C9B8E8', silver: '#C5C8CE', gold: '#C9A24B',
  multi: '#E7B6C8', paisley: '#2F6B4F', geo: '#E7D3A8', floral: '#1A1A1A', stripe: '#6D1A33', gradient: '#C0262D',
};

const KNOWN = new Set(Object.keys(HEX));

function tokenColor(token: string): string | null {
  for (const word of token.toLowerCase().split(/\s+/).reverse()) {
    if (KNOWN.has(word)) return HEX[word];
  }
  return null;
}

/** CSS background for a color name. "A/B" names become a diagonal two-tone split. */
export function swatchBackground(name: string): string {
  const parts = name.split('/').map((p) => tokenColor(p.trim()) ?? '#D8CCD6');
  if (parts.length === 1) return parts[0];
  return `linear-gradient(135deg, ${parts[0]} 50%, ${parts[1]} 50%)`;
}

export function needsRing(name: string): boolean {
  return /white|ivory|cream|pearl|clear|natural|butter/i.test(name);
}
