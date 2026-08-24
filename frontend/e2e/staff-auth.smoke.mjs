import { existsSync } from "node:fs";
import { chmod, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import puppeteer from "puppeteer";

const baseUrl = process.env.E2E_BASE_URL ?? "https://localhost";
const artifactDir = process.env.E2E_ARTIFACT_DIR ?? "/tmp/healthdoc-e2e";
const requestedRole = process.env.E2E_ROLE;
const tokenHeaderFile = process.env.E2E_TOKEN_HEADER_FILE;
const executablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ??
  [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].find(existsSync);

const roles = [
  {
    name: "receptionist",
    username: "dev.receptionist",
    landingPath: "/receptionist/registration",
    api: { method: "POST", path: "/api/v1/patients/search" },
    async startJourney(page) {
      await page.waitForSelector('form input', { timeout: 60_000 });
      await page.type('form input', "Browser smoke patient");
      await page.click('form button[type="submit"]');
    },
  },
  {
    name: "doctor",
    username: "dev.doctor",
    landingPath: "/doctor/dashboard",
    api: { method: "GET", path: "/api/v1/queue/worklist" },
  },
  {
    name: "nurse",
    username: "dev.nurse",
    landingPath: "/nurse/ward-dashboard",
    api: { method: "GET", path: "/api/v1/nursing/tasks" },
    async startJourney(page) {
      await page.waitForSelector(
        '[data-testid="nursing-api-status"][data-status="connected"]',
        { timeout: 60_000 },
      );
    },
  },
  {
    name: "lab-technician",
    username: "dev.labtech",
    landingPath: "/lab",
    api: { method: "GET", path: "/api/v1/pathology/order-items" },
  },
  {
    name: "radiology-technician",
    username: "dev.radiology",
    landingPath: "/radiology",
    api: { method: "GET", path: "/api/v1/radiology/order-items" },
  },
  {
    name: "pharmacist",
    username: "dev.pharmacist",
    landingPath: "/pharmacy/prescription-queue",
    api: { method: "GET", path: "/api/v1/pharmacy/queue" },
  },
  {
    name: "billing-receptionist",
    username: "dev.receptionist",
    landingPath: "/receptionist/registration",
    api: { method: "GET", path: "/api/v1/billing/invoices" },
    async startJourney(page) {
      await page.goto(`${baseUrl}/billing`, {
        waitUntil: "domcontentloaded",
        timeout: 30_000,
      });
      await page.waitForFunction(() => window.location.pathname === "/billing", {
        timeout: 60_000,
      });
    },
  },
  {
    name: "admin",
    username: "dev.admin",
    landingPath: "/admin",
    api: { method: "GET", path: "/api/v1/users" },
    async startJourney(page) {
      await page.waitForSelector('a[href="/admin/users"]', { timeout: 60_000 });
      await page.click('a[href="/admin/users"]');
      await page.waitForFunction(() => window.location.pathname === "/admin/users", {
        timeout: 60_000,
      });
    },
  },
];

const selectedRoles = requestedRole
  ? roles.filter((role) => role.name === requestedRole)
  : roles;

if (selectedRoles.length === 0) {
  throw new Error(`Unknown E2E_ROLE ${JSON.stringify(requestedRole)}`);
}
if (tokenHeaderFile && selectedRoles.length !== 1) {
  throw new Error("E2E_TOKEN_HEADER_FILE requires E2E_ROLE to select exactly one role");
}

async function exerciseRole(browser, role) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  let apiObservation = null;
  let resolvePendingApi = null;

  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      console.error(`[${role.name}:browser:${message.type()}] ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => {
    console.error(`[${role.name}:browser:pageerror] ${error.message}`);
  });
  page.on("requestfailed", (request) => {
    console.error(
      `[${role.name}:browser:requestfailed] ${request.method()} ${request.url()} ${request.failure()?.errorText ?? "unknown"}`,
    );
  });
  page.on("response", (response) => {
    const request = response.request();
    const url = new URL(response.url());
    if (request.method() === role.api.method && url.pathname === role.api.path) {
      apiObservation = {
        authorization: request.headers().authorization ?? null,
        status: response.status(),
      };
      resolvePendingApi?.(apiObservation);
    }
  });

  try {
    await page.goto(`${baseUrl}/login`, {
      waitUntil: "networkidle2",
      timeout: 30_000,
    });

    // SSR renders before AuthProvider's silent-SSO initialization finishes.
    // Wait for hydration so this cannot become an inert pre-hydration click.
    await page.waitForSelector("button:not([disabled])", { timeout: 30_000 });
    const clicked = await page.evaluate(() => {
      const button = [...document.querySelectorAll("button")].find(
        (candidate) =>
          !candidate.disabled && candidate.textContent?.includes("Sign in with Keycloak"),
      );
      button?.click();
      return Boolean(button);
    });
    if (!clicked) throw new Error("Keycloak sign-in button was not rendered");

    await page.waitForSelector("#username", { timeout: 30_000 });
    await page.type("#username", role.username);
    await page.type("#password", "devpass");
    await Promise.all([
      page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 30_000 }),
      page.click("#kc-login"),
    ]);

    await page.waitForFunction(
      (expected) => window.location.pathname === expected,
      { timeout: 60_000 },
      role.landingPath,
    );
    await role.startJourney?.(page);

    const result =
      apiObservation ??
      (await new Promise((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error(`Timed out waiting for ${role.api.method} ${role.api.path}`)),
          60_000,
        );
        resolvePendingApi = (observation) => {
          clearTimeout(timer);
          resolve(observation);
        };
      }));
    const silentSsoStatus = await page.evaluate(async () => {
      const response = await fetch("/silent-check-sso.html");
      return response.status;
    });

    if (silentSsoStatus !== 200) {
      throw new Error(`silent-check-sso.html returned ${silentSsoStatus}`);
    }
    if (!result.authorization?.startsWith("Bearer ")) {
      throw new Error(`${role.api.method} ${role.api.path} did not carry a Bearer token`);
    }
    if (result.status !== 200) {
      throw new Error(`${role.api.method} ${role.api.path} returned ${result.status}`);
    }

    if (tokenHeaderFile) {
      await mkdir(path.dirname(tokenHeaderFile), { recursive: true });
      await writeFile(tokenHeaderFile, `Authorization: ${result.authorization}\n`, {
        mode: 0o600,
      });
      await chmod(tokenHeaderFile, 0o600);
    }

    console.log(
      `PASS ${role.name} login -> ${role.landingPath} -> bearer ${role.api.method} ${role.api.path} (200); silent SSO (200)`,
    );
  } catch (error) {
    await mkdir(artifactDir, { recursive: true });
    await page.screenshot({
      path: path.join(artifactDir, `${role.name}-auth-failure.png`),
      fullPage: true,
    });
    throw error;
  } finally {
    await context.close();
  }
}

let browser;

try {
  browser = await puppeteer.launch({
    headless: true,
    acceptInsecureCerts: true,
    executablePath: executablePath || undefined,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const failures = [];
  for (const role of selectedRoles) {
    try {
      await exerciseRole(browser, role);
    } catch (error) {
      failures.push(`${role.name}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Staff authentication gate failed:\n${failures.join("\n")}`);
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
}
