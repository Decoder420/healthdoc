import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import puppeteer from "puppeteer";

const baseUrl = process.env.E2E_BASE_URL ?? "https://localhost";
const artifactDir = process.env.E2E_ARTIFACT_DIR ?? "/tmp/healthdoc-e2e";
const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ??
  [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find(existsSync);

let browser;

try {
  browser = await puppeteer.launch({
    headless: true,
    acceptInsecureCerts: true,
    executablePath: executablePath || undefined,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  let nursingRequestAuthorization = null;
  let nursingResponseStatus = null;

  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      console.error(`[browser:${message.type()}] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => console.error(`[browser:pageerror] ${error.message}`));
  page.on("requestfailed", (request) => {
    console.error(
      `[browser:requestfailed] ${request.method()} ${request.url()} ${request.failure()?.errorText ?? "unknown"}`,
    );
  });

  page.on("request", (request) => {
    const url = new URL(request.url());
    if (url.pathname === "/api/v1/nursing/tasks") {
      nursingRequestAuthorization = request.headers().authorization ?? null;
    }
  });
  page.on("response", (response) => {
    const url = new URL(response.url());
    if (url.pathname === "/api/v1/nursing/tasks") {
      nursingResponseStatus = response.status();
    }
  });

  await page.goto(`${baseUrl}/login`, {
    waitUntil: "networkidle2",
    timeout: 30_000,
  });

  const signInButton = await page.waitForSelector("button", { timeout: 15_000 });
  const clicked = await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((candidate) =>
      candidate.textContent?.includes("Sign in with Keycloak"),
    );
    button?.click();
    return Boolean(button);
  });
  if (!clicked || !signInButton) {
    throw new Error("Keycloak sign-in button was not rendered");
  }

  await page.waitForSelector("#username", { timeout: 30_000 });
  await page.type("#username", "dev.nurse");
  await page.type("#password", "devpass");
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30_000 }),
    page.click("#kc-login"),
  ]);

  await page.waitForFunction(
    () => window.location.pathname === "/nurse/ward-dashboard",
    { timeout: 30_000 },
  );
  await page.waitForSelector(
    '[data-testid="nursing-api-status"][data-status="connected"]',
    { timeout: 30_000 },
  );

  const silentSsoStatus = await page.evaluate(async () => {
    const response = await fetch("/silent-check-sso.html");
    return response.status;
  });

  if (silentSsoStatus !== 200) {
    throw new Error(`silent-check-sso.html returned ${silentSsoStatus}`);
  }
  if (!nursingRequestAuthorization?.startsWith("Bearer ")) {
    throw new Error("GET /api/v1/nursing/tasks did not carry a Bearer token");
  }
  if (nursingResponseStatus !== 200) {
    throw new Error(
      `GET /api/v1/nursing/tasks returned ${nursingResponseStatus ?? "no response"}`,
    );
  }

  console.log(
    "PASS nurse login -> /nurse/ward-dashboard -> bearer GET /api/v1/nursing/tasks (200); silent SSO (200)",
  );
} catch (error) {
  await mkdir(artifactDir, { recursive: true });
  if (browser) {
    const pages = await browser.pages();
    const page = pages.at(-1);
    if (page) {
      await page.screenshot({
        path: path.join(artifactDir, "nurse-auth-failure.png"),
        fullPage: true,
      });
    }
  }
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
