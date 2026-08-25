/**
 * Per-dashboard smoke: every screen loads AND every call it makes succeeds.
 *
 * WHY "IT RENDERED" IS NOT THE ASSERTION
 *
 * Every defect this project actually shipped rendered perfectly:
 *
 *   - app/radiology was a title-only shell for weeks and looked finished from
 *     the route list;
 *   - procurement had create and approve endpoints with no list endpoint, so
 *     the approval queue was empty rather than broken;
 *   - the HOD dashboard's eight endpoints had no page at all;
 *   - `orders.fulfilment_mode` was written by nothing, so every order claimed
 *     the hospital would fulfil it in-house.
 *
 * A "does the page render" test passes on all four. So this fails the build if
 * ANY request to /api/v1 returns 4xx or 5xx while a dashboard is loading, and
 * separately if the page paints its own error state. Those are the two ways a
 * screen tells you it is broken, and both are invisible to a screenshot.
 *
 * WHAT IT DELIBERATELY DOES NOT DO
 *
 * Drive workflows. Raising an indent and approving it needs seeded data per
 * role and a run long enough that CI time becomes a real cost. This is the
 * cheap gate that catches "wired to nothing"; the journey tests in
 * backend/tests/integration cover the flows.
 *
 * A 404 from a LIST endpoint is a failure here. A 404 on a detail route for a
 * record that does not exist in the seed would not be — so no dashboard below
 * is given an id to fetch. Every path is a landing screen.
 */
import process from "node:process";

import puppeteer from "puppeteer";

const baseUrl = process.env.E2E_BASE_URL ?? "https://localhost";
const requestedRole = process.env.E2E_ROLE;
const executablePath = process.env.PUPPETEER_EXECUTABLE_PATH ?? undefined;

/**
 * Dashboards per role, as the sidebar offers them.
 *
 * `expectCalls` is the floor, not the ceiling: a screen that makes ZERO API
 * calls is the shell failure this file exists to catch, so a dashboard listed
 * here must prove it talked to the backend at all.
 *
 * `expected404` names EXACT paths whose absence is a legitimate answer the
 * screen renders — not a general tolerance for 4xx. Each entry needs a reason,
 * and it matches one path: a blanket "ignore 404s" would excuse precisely the
 * missing-endpoint failure this file exists to catch.
 */
const ROLE_DASHBOARDS = [
  {
    name: "receptionist",
    username: "dev.receptionist",
    landingPath: "/receptionist/registration",
    dashboards: [
      { path: "/receptionist/registration", expectCalls: false },
      { path: "/receptionist/patient-search", expectCalls: false },
      { path: "/receptionist/queue", expectCalls: true },
      { path: "/billing", expectCalls: true },
      { path: "/consent", expectCalls: false },
    ],
  },
  {
    name: "doctor",
    username: "dev.doctor",
    landingPath: "/doctor/dashboard",
    dashboards: [
      { path: "/doctor/dashboard", expectCalls: true },
      { path: "/doctor/orders", expectCalls: true },
      { path: "/doctor/prescriptions", expectCalls: true },
      { path: "/doctor/results", expectCalls: true },
      { path: "/doctor/pharmacy-approvals", expectCalls: true },
      { path: "/lab", expectCalls: true },
      { path: "/radiology", expectCalls: true },
      { path: "/ipd", expectCalls: true },
    ],
  },
  {
    name: "nurse",
    username: "dev.nurse",
    landingPath: "/nurse/ward-dashboard",
    dashboards: [
      { path: "/nurse/ward-dashboard", expectCalls: true },
      { path: "/nurse/emar", expectCalls: true },
      { path: "/ipd", expectCalls: true },
    ],
  },
  {
    name: "pharmacist",
    username: "dev.pharmacist",
    landingPath: "/pharmacy/prescription-queue",
    dashboards: [
      { path: "/pharmacy/prescription-queue", expectCalls: true },
      { path: "/pharmacy/dispense", expectCalls: true },
      // Loads reorder alerts and the expiry tracker on mount; the five stock
      // tabs are separate components and are not exercised by a page load.
      { path: "/inventory", expectCalls: true },
    ],
  },
  {
    name: "hod",
    username: "dev.hod",
    landingPath: "/hod",
    dashboards: [
      // Five parallel reads. Before this screen existed the role had no
      // landing page at all and every one of these endpoints was unreachable.
      { path: "/hod", expectCalls: true },
      // HOD-only indent approval lives here. Reachable only because
      // ROLES.HOD gained the /inventory prefix — without it the one action
      // only a department head can perform had no route.
      { path: "/inventory", expectCalls: true },
      { path: "/reports", expectCalls: true },
    ],
  },
  {
    name: "admin",
    username: "dev.admin",
    landingPath: "/admin",
    dashboards: [
      { path: "/admin", expectCalls: false },
      { path: "/admin/users", expectCalls: true },
      { path: "/admin/departments", expectCalls: true },
      { path: "/admin/permissions", expectCalls: true },
      { path: "/admin/account-requests", expectCalls: true },
      { path: "/admin/abdm-sync", expectCalls: true },
      { path: "/audit-viewer", expectCalls: true },
      {
        path: "/admin/data-protection",
        expectCalls: true,
        // A facility that has never appointed a DPO genuinely has none, and
        // the screen says so in a warning rather than an error. The other
        // three reads on this page must still succeed.
        expected404: ["/api/v1/dpdp/dpo"],
      },
      { path: "/admin/maintenance", expectCalls: true },
      { path: "/reports", expectCalls: true },
      { path: "/billing", expectCalls: true },
    ],
  },
];

const selectedRoles = requestedRole
  ? ROLE_DASHBOARDS.filter((role) => role.name === requestedRole)
  : ROLE_DASHBOARDS;

if (selectedRoles.length === 0) {
  console.error(`E2E_ROLE="${requestedRole}" matches no role in this file`);
  process.exit(1);
}

async function signIn(page, role) {
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle2", timeout: 30_000 });

  // SSR paints before AuthProvider finishes silent SSO. Waiting for an enabled
  // button keeps this from becoming an inert pre-hydration click — the same
  // trap staff-auth.smoke.mjs documents.
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
}

async function exerciseRole(browser, role) {
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  const failures = [];

  let current = null;
  let currentExpected404 = null;
  const calls = new Map();

  page.on("response", (response) => {
    if (!current) return;
    const url = new URL(response.url());
    if (!url.pathname.startsWith("/api/v1")) return;

    const entry = calls.get(current) ?? { total: 0, bad: [] };
    entry.total += 1;
    const tolerated =
      response.status() === 404 && (currentExpected404 ?? []).includes(url.pathname);
    if (response.status() >= 400 && !tolerated) {
      entry.bad.push(`${response.status()} ${response.request().method()} ${url.pathname}`);
    }
    calls.set(current, entry);
  });

  page.on("pageerror", (error) => {
    if (current) failures.push(`${current}: uncaught ${error.message}`);
  });

  try {
    await signIn(page, role);

    for (const dashboard of role.dashboards) {
      current = dashboard.path;
      currentExpected404 = dashboard.expected404 ?? [];
      calls.set(current, { total: 0, bad: [] });

      await page.goto(`${baseUrl}${dashboard.path}`, {
        waitUntil: "networkidle2",
        timeout: 60_000,
      });

      // networkidle2 can settle before a fetch fired in an effect resolves.
      // A short settle is the difference between observing the calls and
      // reporting a screen made none.
      await new Promise((resolve) => setTimeout(resolve, 2_000));

      // Did the guard bounce us? A dashboard listed for a role must be
      // reachable by that role — this is what would have caught the HOD who
      // could not open /inventory.
      const landed = await page.evaluate(() => window.location.pathname);
      if (landed !== dashboard.path) {
        failures.push(`${dashboard.path}: role ${role.name} was redirected to ${landed}`);
        continue;
      }

      // The screen's own error state. Every dashboard renders failures into
      // role="alert", so this asks the page whether IT thinks it is broken
      // rather than inferring from pixels.
      const alerts = await page.$$eval('[role="alert"]', (nodes) =>
        nodes.map((node) => node.textContent?.trim()).filter(Boolean),
      );
      if (alerts.length > 0) {
        failures.push(`${dashboard.path}: rendered an error — ${alerts.join(" | ")}`);
      }

      const observed = calls.get(dashboard.path) ?? { total: 0, bad: [] };
      if (observed.bad.length > 0) {
        failures.push(`${dashboard.path}: ${observed.bad.join(", ")}`);
      }
      if (dashboard.expectCalls && observed.total === 0) {
        failures.push(
          `${dashboard.path}: made NO /api/v1 calls — a screen wired to nothing ` +
            "renders exactly like a working one",
        );
      }

      console.log(
        `[${role.name}] ${dashboard.path} — ${observed.total} call(s), ` +
          `${observed.bad.length} failed`,
      );
    }
  } finally {
    current = null;
    currentExpected404 = null;
    await context.close();
  }

  return failures;
}

const browser = await puppeteer.launch({
  headless: "new",
  executablePath,
  // The stack serves TLS with a self-signed certificate in dev and CI.
  args: ["--no-sandbox", "--ignore-certificate-errors"],
});

const allFailures = [];
try {
  for (const role of selectedRoles) {
    console.log(`\n=== ${role.name} ===`);
    const failures = await exerciseRole(browser, role);
    allFailures.push(...failures.map((f) => `[${role.name}] ${f}`));
  }
} finally {
  await browser.close();
}

if (allFailures.length > 0) {
  console.error(`\n${allFailures.length} dashboard failure(s):`);
  for (const failure of allFailures) console.error(`  ✗ ${failure}`);
  process.exit(1);
}

console.log("\nAll dashboards loaded and every API call succeeded.");
