import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const files = {
  labButton: "src/components/shared/labreportviewer/DownloadPdfButton.tsx",
  labCss: "src/components/shared/labreportviewer/pathology-report.css",
  prescription: "src/features/doctor/components/PrescriptionPrintView.tsx",
  prescriptionCss: "src/features/doctor/prescription-print.css",
  receipt: "src/features/billing/components/ReceiptPrintView.tsx",
  receiptCss: "src/features/billing/receipt-print.css",
  mis: "src/features/reports/components/MisDashboard.tsx",
  misCss: "src/features/reports/mis-print.css",
};

const source = Object.fromEntries(
  await Promise.all(Object.entries(files).map(async ([name, path]) => [name, await readFile(path, "utf8")])),
);

test("all four release documents have an A4 print root", () => {
  for (const css of [source.labCss, source.prescriptionCss, source.receiptCss, source.misCss]) {
    assert.match(css, /@page\s*{/);
    assert.match(css, /size:\s*A4/);
  }
  assert.match(source.labCss, /#lab-report/);
  assert.match(source.prescriptionCss, /\.rx-print/);
  assert.match(source.receiptCss, /#receipt-print-root/);
  assert.match(source.misCss, /#mis-print-root/);
});

test("print actions use the browser PDF path and no invented report endpoint", () => {
  assert.match(source.labButton, /window\.print\(\)/);
  assert.doesNotMatch(source.labButton, /api\/reports/);
  assert.match(source.mis, /format === "pdf"/);
  assert.match(source.mis, /window\.print\(\)/);
  assert.match(source.prescription, /facilityName/);
  assert.match(source.receipt, /currentUser\?\.facility\.name/);
});
