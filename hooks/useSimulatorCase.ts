import { useSimulatorStore } from "@/store/simulator";
import type { CaseKey } from "@/types/simulator";

// Typed selector hook — prevents components from subscribing to the whole store
// Usage: const isWaterfall = useSimulatorCase('waterfall')
export function useSimulatorCase(key: CaseKey): boolean {
  return useSimulatorStore((state) => state.toggles[key]);
}
