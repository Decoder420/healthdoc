import { existsSync } from "node:fs";
import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import ffmpegPath from "ffmpeg-static";
import puppeteer from "puppeteer";

import { demoRoles } from "./demo-recordings.config.mjs";

const baseUrl = process.env.E2E_BASE_URL ?? "https://localhost";
const artifactDir = process.env.E2E_ARTIFACT_DIR ?? "/tmp/healthdoc-demo-recordings";
const requestedRole = process.env.DEMO_ROLE;
const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ??
  [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find(existsSync);
const roles = requestedRole
  ? demoRoles.filter((candidate) => candidate.name === requestedRole)
  : demoRoles;

if (roles.length === 0) throw new Error(`Unknown DEMO_ROLE ${JSON.stringify(requestedRole)}`);
if (!ffmpegPath) throw new Error("ffmpeg-static did not supply an encoder path");

const pause = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function login(page, role) {
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle2", timeout: 30_000 });
  await page.waitForSelector("button:not([disabled])", { timeout: 30_000 });
  const clicked = await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((candidate) =>
      candidate.textContent?.includes("Sign in with Keycloak"),
    );
    button?.click();
    return Boolean(button);
  });
  if (!clicked) throw new Error("Keycloak sign-in button was not rendered");
  await page.waitForSelector("#username", { timeout: 30_000 });
  await page.type("#username", role.username, { delay: 45 });
  await page.type("#password", "devpass", { delay: 45 });
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30_000 }),
    page.click("#kc-login"),
  ]);
  await page.waitForFunction(
    (expected) => window.location.pathname === expected,
    { timeout: 60_000 },
    role.landingPath,
  );
}

async function exercise(page, role) {
  if (role.name === "receptionist") {
    await page.goto(`${baseUrl}/receptionist/patient-search`, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    await page.waitForSelector("form input", { timeout: 30_000 });
    await page.type("form input", "Demo Patient 251", { delay: 70 });
    await page.click('form button[type="submit"]');
    await page.waitForFunction(
      () => document.body.textContent?.includes("DEMO251"),
      { timeout: 30_000 },
    );
  } else if (role.name === "doctor") {
    await page.waitForFunction(
      () =>
        document.body.textContent?.includes("DEMO-001") &&
        document.body.textContent?.includes("Start consultation"),
      { timeout: 30_000 },
    );
  } else {
    await page.waitForSelector(
      '[data-testid="nursing-api-status"][data-status="connected"]',
      { timeout: 30_000 },
    );
    await page.waitForFunction(
      () => document.body.textContent?.includes("Demo Patient 251"),
      { timeout: 30_000 },
    );
    const selected = await page.$$eval('[role="button"]', (cards) => {
      const bed = cards.find((card) => card.textContent?.includes("D-01"));
      bed?.click();
      return Boolean(bed);
    });
    if (!selected) throw new Error("Demo bed D-01 was not rendered");
    await page.waitForFunction(
      () => document.body.textContent?.includes("Vitals Timeline"),
      { timeout: 30_000 },
    );
  }
  await pause(1_500);
}

async function recordRole(browser, role) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  const output = path.join(artifactDir, `${role.name}.webm`);
  let apiProof = null;
  let recorder;

  page.on("response", (response) => {
    const request = response.request();
    const url = new URL(response.url());
    if (request.method() === role.api.method && url.pathname === role.api.path) {
      apiProof = {
        bearer: request.headers().authorization?.startsWith("Bearer ") ?? false,
        status: response.status(),
      };
    }
  });

  try {
    recorder = await page.screencast({ path: output, ffmpegPath, fps: 20 });
    await login(page, role);
    await exercise(page, role);
    if (!apiProof?.bearer || apiProof.status !== 200) {
      throw new Error(`${role.api.method} ${role.api.path} lacked a successful bearer response`);
    }
  } catch (error) {
    await page.screenshot({ path: path.join(artifactDir, `${role.name}-failure.png`) });
    throw error;
  } finally {
    await recorder?.stop();
    await context.close();
  }

  const bytes = (await stat(output)).size;
  if (bytes < 10_000) throw new Error(`${output} is unexpectedly small (${bytes} bytes)`);
  console.log(`PASS ${role.name}: ${output} (${bytes} bytes), bearer API ${apiProof.status}`);
  return { role: role.name, file: output, bytes, api: `${role.api.method} ${role.api.path}` };
}

await mkdir(artifactDir, { recursive: true });
let browser;
try {
  browser = await puppeteer.launch({
    headless: true,
    acceptInsecureCerts: true,
    executablePath: executablePath || undefined,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const recordings = [];
  for (const role of roles) recordings.push(await recordRole(browser, role));
  await writeFile(
    path.join(artifactDir, "manifest.json"),
    `${JSON.stringify({ baseUrl, recordings }, null, 2)}\n`,
    { mode: 0o600 },
  );
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
