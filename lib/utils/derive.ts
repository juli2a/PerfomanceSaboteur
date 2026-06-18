// Deterministic derivation functions — same input always produces same output
// Used server-side so cards/charts are stable across renders

const REGIONS = ["Kyiv", "Lviv", "Kharkiv", "Odesa", "Dnipro"] as const;

export function deriveRegion(productId: number): string {
  return REGIONS[productId % REGIONS.length];
}

// LTV = user.id * 1250 + user.age * 300  (per docs/data.md)
export function deriveLtv(userId: number, userAge: number): number {
  return Math.round(userId * 1250 + userAge * 300);
}

// Returns true (up/green) or false (down/red) based on the last changing segment.
// Falls back to previous segments if the last is flat; all-flat → false.
export function deriveTrend(data: number[]): boolean {
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i] > data[i - 1]) return true
    if (data[i] < data[i - 1]) return false
  }
  return false
}

// 7-point sparkline based on product id and price
export function deriveSparkline(productId: number, basePrice: number): number[] {
  return Array.from({ length: 7 }, (_, i) =>
    Math.round(basePrice * (0.85 + 0.03 * ((productId * 17 + i * 13) % 11))),
  );
}

// Avatar gradient hue (0-359) for a customer's initials badge
export function deriveHue(userId: number): number {
  return (userId * 47) % 360;
}

// Builds a deterministic 12-point upward sparkline ending at currentValue, plus the %
// growth vs. the implied starting point. Growth is always positive — this demo never
// shows a declining KPI.
export function deriveKpiTrend(
  currentValue: number,
  seed: number,
): { deltaPercent: number; spark: number[] } {
  const growthPercent = 2 + (seed % 12);
  const startValue = currentValue / (1 + growthPercent / 100);
  const spark = Array.from({ length: 12 }, (_, index) => {
    const progress = index / 11;
    const wobble = 1 + Math.sin(seed + index * 7) * 0.04;
    return Math.round((startValue + (currentValue - startValue) * progress) * wobble);
  });
  return { deltaPercent: growthPercent, spark };
}
