import os from "node:os";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const PORT = Number(process.env.PORT) || 3000;
// Default HTTP for reliable LAN access; use --https or HEALTHDOC_HTTPS=1 for camera.
const USE_HTTPS =
  process.env.HEALTHDOC_HTTPS === "1" || process.argv.includes("--https");
const isDirectRun = process.argv[1]
  ? path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

function isIpv4(entry) {
  const family = String(entry.family);
  return (family === "IPv4" || family === "4") && !entry.internal;
}

function isVirtualAdapter(name) {
  return /vethernet|hyper-?v|wsl|docker|vmware|virtualbox|bluetooth|loopback|veth|br-|tunnel|vpn/i.test(
    name,
  );
}

function isWifiAdapter(name) {
  return /wi-?fi|wlan|wireless/i.test(name);
}

function isPrivateLan(ip) {
  return (
    ip.startsWith("192.168.") ||
    ip.startsWith("10.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

/** Prefer real Wi-Fi, then physical Ethernet — never WSL/Hyper-V. */
export function getLanIp() {
  const nets = os.networkInterfaces();
  const wifi = [];
  const wired = [];
  const other = [];

  for (const [name, entries] of Object.entries(nets)) {
    if (isVirtualAdapter(name)) continue;

    for (const entry of entries ?? []) {
      if (!isIpv4(entry) || !isPrivateLan(entry.address)) continue;
      const item = { name, address: entry.address };

      if (isWifiAdapter(name)) wifi.push(item);
      else if (/ethernet|lan|en\d|eth/i.test(name)) wired.push(item);
      else other.push(item);
    }
  }

  return wifi[0]?.address ?? wired[0]?.address ?? other[0]?.address ?? null;
}

export function getAllLanIps() {
  const ips = [];
  for (const [name, entries] of Object.entries(os.networkInterfaces())) {
    if (isVirtualAdapter(name)) continue;
    for (const entry of entries ?? []) {
      if (!isIpv4(entry) || !isPrivateLan(entry.address)) continue;
      ips.push({ name, address: entry.address });
    }
  }
  return ips;
}

export function printLanBanner(ip = getLanIp()) {
  const scheme = USE_HTTPS ? "https" : "http";
  const localhostUrl = `${scheme}://localhost:${PORT}`;
  const lanUrl = ip ? `${scheme}://${ip}:${PORT}` : null;
  const extras = getAllLanIps().filter((item) => item.address !== ip);

  console.log("");
  console.log("=================================================");
  console.log("  healthdoc frontend");
  console.log("=================================================");
  console.log(`  This PC:          ${localhostUrl}`);
  if (lanUrl) {
    console.log(`  LAN (other devices): ${lanUrl}`);
  } else {
    console.log("  LAN:                (no Wi-Fi/Ethernet IP found)");
  }
  for (const item of extras.slice(0, 3)) {
    console.log(`  Also:               ${scheme}://${item.address}:${PORT} (${item.name})`);
  }
  console.log("");
  if (USE_HTTPS) {
    console.log("  HTTPS on — accept the certificate warning on other devices.");
  } else {
    console.log("  HTTP mode (reliable CSS/login on LAN).");
    console.log("  For camera on phones: HEALTHDOC_HTTPS=1 npm run dev");
  }
  console.log("=================================================");
  console.log("");

  return ip;
}

function resolveNextCli() {
  const local = path.join(
    process.cwd(),
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );
  if (fs.existsSync(local)) return local;
  throw new Error(
    `Next.js CLI not found at ${local}. Run npm install in the frontend folder.`,
  );
}

function startDevServer() {
  const hostname = "0.0.0.0";
  const nextCli = resolveNextCli();

  const devArgs = [
    nextCli,
    "dev",
    "--hostname",
    hostname,
    "--port",
    String(PORT),
  ];

  if (USE_HTTPS) {
    devArgs.push("--experimental-https");
  }

  const child = spawn(process.execPath, devArgs, {
    stdio: "inherit",
    env: {
      ...process.env,
      HOSTNAME: hostname,
      PORT: String(PORT),
    },
    // Avoid DEP0190 / arg concatenation issues on Windows
    shell: false,
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }
    process.exit(code ?? 0);
  });

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      child.kill(signal);
    });
  }
}

if (isDirectRun) {
  printLanBanner();
  startDevServer();
}
