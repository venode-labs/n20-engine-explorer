import { sources, type AuthorityLevel } from "@/data/sources";

export type ClaimVerdict =
  | { ok: true; label: "verified" | "high" | "medium" }
  | { ok: false; label: "unverified" | "vin-required"; reason: string };

export interface TechnicalClaim {
  text: string;
  sourceIds: string[];
  appliesToN20: boolean;
  appliesToF32_428i?: boolean | "unknown";
  australiaKnown?: boolean | "unknown";
  vinDependent?: boolean;
  conflicts?: boolean;
}

/**
 * Gate for precision-critical copy. Unresolved claims must not be guessed.
 */
export function assertTechnicalClaim(claim: TechnicalClaim): ClaimVerdict {
  if (claim.vinDependent) {
    return { ok: false, label: "vin-required", reason: "VIN verification required" };
  }
  if (claim.conflicts) {
    return { ok: false, label: "unverified", reason: "Authoritative sources conflict" };
  }
  if (!claim.appliesToN20) {
    return { ok: false, label: "unverified", reason: "Source is not confirmed as N20-specific" };
  }
  if (!claim.sourceIds.length) {
    return { ok: false, label: "unverified", reason: "Not verified" };
  }

  const resolved = claim.sourceIds.map((id) => sources[id]).filter(Boolean);
  if (!resolved.length) {
    return { ok: false, label: "unverified", reason: "Not verified" };
  }

  const best = resolved.reduce<AuthorityLevel>((acc, s) => {
    const order: AuthorityLevel[] = ["A", "B", "C", "D"];
    return order.indexOf(s.authorityLevel) < order.indexOf(acc) ? s.authorityLevel : acc;
  }, "D");

  const hasPrimaryOrRecognised = resolved.some((s) => s.authorityLevel === "A" || s.authorityLevel === "B");
  if (!hasPrimaryOrRecognised) {
    return { ok: false, label: "unverified", reason: "Not verified — no primary or recognised source" };
  }

  if (claim.appliesToF32_428i === false) {
    return { ok: false, label: "unverified", reason: "Does not apply to F32 428i" };
  }

  if (best === "A" && claim.appliesToF32_428i !== "unknown") return { ok: true, label: "verified" };
  if (best === "A") return { ok: true, label: "high" };
  if (best === "B") return { ok: true, label: "high" };
  return { ok: true, label: "medium" };
}

export function claimLabel(verdict: ClaimVerdict): string {
  if (!verdict.ok) return verdict.reason;
  if (verdict.label === "verified") return "Verified";
  if (verdict.label === "high") return "High confidence";
  return "Medium confidence";
}
