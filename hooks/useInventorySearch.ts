"use client";

import { useEffect, useRef } from "react";
import { useInventorySearchStore } from "@/store/inventory-search";
import { useSimControlStore } from "@/store/simulator-control";
import { useSimulatorCase } from "@/hooks/useSimulatorCase";

const DEBOUNCE_MS = 300;

interface SearchResponse {
  ids: number[];
}

// Drives the Inventory search request lifecycle (Case 4 — Network race
// condition).
// Toggle OFF (good path): debounces 300ms and cancels the in-flight request
// via AbortController on every new keystroke — only the latest, non-aborted
// response ever reaches state.
// Toggle ON (bad path): fires a request per keystroke with no debounce and
// no cancellation, so responses can resolve out of order and a stale one
// can clobber a newer one — exactly the bug being demonstrated.
export function useInventorySearch() {
  const query = useInventorySearchStore((state) => state.query);
  const setMatchedIds = useInventorySearchStore((state) => state.setMatchedIds);
  const setIsSearching = useInventorySearchStore(
    (state) => state.setIsSearching,
  );
  const setIsStale = useInventorySearchStore((state) => state.setIsStale);
  const isRaceConditionOn = useSimulatorCase("raceCondition");
  const triggerAlert = useSimControlStore((state) => state.triggerAlert);
  const closeAlert = useSimControlStore((state) => state.closeAlert);

  const latestSeqRef = useRef(0);
  const appliedSeqRef = useRef(0);

  useEffect(() => {
    if (!query.trim()) {
      setMatchedIds(null);
      setIsSearching(false);
      setIsStale(false);
      closeAlert("raceCondition");
      return;
    }

    const seq = ++latestSeqRef.current;

    async function run(signal?: AbortSignal) {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/api/inventory-search?q=${encodeURIComponent(query)}`,
          {
            signal,
          },
        );
        const data: SearchResponse = await res.json();

        if (seq < appliedSeqRef.current) {
          // Reachable only on the bad path — the good path's AbortController
          // guarantees a stale request's response never lands here.
          setIsStale(true);
          triggerAlert("raceCondition");
        } else if (seq === latestSeqRef.current) {
          // This is the response for the most recently typed query — the
          // display is correct again, clear any earlier race-condition alert.
          setIsStale(false);
          closeAlert("raceCondition");
        }
        appliedSeqRef.current = Math.max(appliedSeqRef.current, seq);
        setMatchedIds(new Set(data.ids));
      } catch (error) {
        if ((error as Error).name !== "AbortError") throw error;
      } finally {
        setIsSearching(false);
      }
    }

    if (isRaceConditionOn) {
      run();
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => run(controller.signal), DEBOUNCE_MS);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    query,
    isRaceConditionOn,
    setMatchedIds,
    setIsSearching,
    setIsStale,
    triggerAlert,
    closeAlert,
  ]);
}
