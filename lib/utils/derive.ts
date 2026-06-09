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

// 7-point sparkline based on product id and price
export function deriveSparkline(productId: number, basePrice: number): number[] {
  return Array.from({ length: 7 }, (_, i) =>
    Math.round(basePrice * (0.85 + 0.05 * ((productId * (i + 1)) % 7))),
  );
}
