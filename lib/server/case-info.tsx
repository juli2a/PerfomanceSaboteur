import { SIMULATOR_CASES } from "@/lib/simulator-toggles";
import { getBadCodeSnippet, getGoodCodeSnippet } from "@/lib/server/case-code";
import type { CaseKey } from "@/types/simulator";
import CaseTipContent from "@/components/simulator/CaseTipContent";
import CaseCodeBlock from "@/components/simulator/CaseCodeBlock";

// Pre-renders every case's tip — including server-highlighted code blocks —
// once, server-side. Must be called from a Server Component (e.g.
// app/(shell)/layout.tsx) and the result passed down as a prop through
// Header into ControlPanelTogglers / MobileControlSheet, both of which are
// "use client" and so can never import CaseCodeBlock (a Server Component)
// directly themselves.
export function getCaseTipContent(): Partial<Record<CaseKey, React.ReactNode>> {
  const items = SIMULATOR_CASES.flatMap((zone) => zone.items);

  return Object.fromEntries(
    items.map((item) => {
      const badCodeSnippet = getBadCodeSnippet(item.key);
      const goodCodeSnippet = getGoodCodeSnippet(item.key);

      return [
        item.key,
        <CaseTipContent
          key={item.key}
          tip={item.tip}
          badCodeBlock={badCodeSnippet ? <CaseCodeBlock code={badCodeSnippet} /> : undefined}
          goodCodeBlock={goodCodeSnippet ? <CaseCodeBlock code={goodCodeSnippet} /> : undefined}
        />,
      ];
    }),
  );
}
