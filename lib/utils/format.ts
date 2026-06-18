// Display formatting helpers

export function formatCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

export function formatPercent(value: number): string {
  return `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
}

export function formatCompact(value: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(value);
}

export function formatCompactCurrency(value: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}
