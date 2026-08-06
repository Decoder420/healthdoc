export type RadiologyReportDraft = {
  findings: string;
  impression: string;
  recommendation: string;
  verified?: boolean;
};

const storageKey = (accessionNumber: string) =>
  `radiology-report-draft:${accessionNumber}`;

export function saveReportDraft(
  accessionNumber: string,
  draft: RadiologyReportDraft
) {
  if (typeof window === "undefined") return;

  sessionStorage.setItem(
    storageKey(accessionNumber),
    JSON.stringify(draft)
  );
}

export function loadReportDraft(
  accessionNumber: string
): RadiologyReportDraft | null {
  if (typeof window === "undefined") return null;

  const raw = sessionStorage.getItem(
    storageKey(accessionNumber)
  );

  if (!raw) return null;

  try {
    return JSON.parse(raw) as RadiologyReportDraft;
  } catch {
    return null;
  }
}
