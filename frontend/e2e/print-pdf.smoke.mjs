import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import process from "node:process";

import puppeteer from "puppeteer";

const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ??
  [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find(existsSync);

const documents = [
  {
    name: "prescription",
    css: "src/features/doctor/prescription-print.css",
    html: '<main class="rx-print"><h1>Prescription verification</h1><table><tbody><tr><td>Medicine</td></tr></tbody></table></main>',
  },
  {
    name: "receipt",
    css: "src/features/billing/receipt-print.css",
    html: '<main id="receipt-print-root"><h1>Receipt verification</h1><p>Paid</p></main>',
  },
  {
    name: "lab-report",
    css: "src/components/shared/labreportviewer/pathology-report.css",
    html: '<main id="lab-report" class="pr-page"><h1>Lab report verification</h1><p>Released result</p></main>',
  },
  {
    name: "mis",
    css: "src/features/reports/mis-print.css",
    html: '<main id="mis-print-root"><h1>MIS verification</h1><p>Facility KPI</p></main>',
    landscape: true,
  },
];

const browser = await puppeteer.launch({
  headless: true,
  executablePath: executablePath || undefined,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  for (const document of documents) {
    const page = await browser.newPage();
    const css = await readFile(document.css, "utf8");
    await page.setContent(
      `<!doctype html><html><head><style>${css}</style></head><body>${document.html}</body></html>`,
      { waitUntil: "domcontentloaded" },
    );
    await page.emulateMediaType("print");
    const pdf = await page.pdf({ format: "A4", landscape: document.landscape ?? false, printBackground: true });
    if (pdf.byteLength < 1_000 || Buffer.from(pdf).subarray(0, 5).toString() !== "%PDF-") {
      throw new Error(`${document.name} did not produce a valid non-empty PDF`);
    }
    console.log(`PASS ${document.name}: Chromium produced ${pdf.byteLength} PDF bytes`);
    await page.close();
  }
} finally {
  await browser.close();
}
