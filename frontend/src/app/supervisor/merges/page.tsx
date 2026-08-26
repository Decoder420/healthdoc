import { IdentityMergeWorkspace } from "@/features/supervisor/IdentityMergeWorkspace";

/**
 * Supervisor records-authority workspace (#221 / F1-W5-01).
 *
 * Distinct from /emergency, which only issues THIDs. This screen is where
 * promote → approve → unmerge runs under maker–checker rules.
 */
export default function Page() {
  return <IdentityMergeWorkspace />;
}
