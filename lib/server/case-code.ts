import { readFileSync } from "node:fs";
import path from "node:path";

import type { CaseKey } from "@/types/simulator";

const SNIPPETS_DIR = path.join(process.cwd(), "lib", "case-code");

// Reads a case's real source excerpt straight from lib/case-code/ — kept
// as plain .txt files (not string literals in lib/simulator-toggles.ts, a
// module shared with client components) so they stay easy to read and edit
// on their own. Returns null when a case has no snippet yet.
function readSnippet(key: CaseKey, variant: "bad" | "good"): string | null {
  const filePath = path.join(SNIPPETS_DIR, `${key}.${variant}.txt`);
  try {
    return readFileSync(filePath, "utf-8").trimEnd();
  } catch {
    return null;
  }
}

export function getBadCodeSnippet(key: CaseKey): string | null {
  return readSnippet(key, "bad");
}

export function getGoodCodeSnippet(key: CaseKey): string | null {
  return readSnippet(key, "good");
}
