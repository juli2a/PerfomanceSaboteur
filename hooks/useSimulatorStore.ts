// Typed selector hook — prevents components from subscribing to the whole store
// Usage: const isWaterfall = useSimulatorCase('waterfall')
export function useSimulatorCase(_key: string): boolean {
  return false;
}
