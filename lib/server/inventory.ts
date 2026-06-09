import type { AmplifiedProduct } from "@/types/inventory";

// Fetches 100 products from DummyJSON and replicates them ×20 → 2000+ rows
// SKU and logisticStatus are derived deterministically from the amplified id
export async function getAmplifiedProducts(): Promise<AmplifiedProduct[]> {
  return [];
}

// Server Action — emulates a bulk logistic status update with 400ms delay
// After "save": revalidatePath('/inventory') or router.refresh()
export async function updateLogisticStatus(
  _productIds: number[],
  _status: string,
): Promise<{ ok: boolean }> {
  return { ok: true };
}
