import os from "node:os";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT) || 3000;
const USE_HTTPS = process.env.HEALTHDOC_HTTPS !== "0";
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

export function printLanBanner(ip = getLanIp()) {
  const scheme = USE_HTTPS ? "https" : "http";
  const localhostUrl = `${scheme}://localhost:${PORT}`;
  const lanUrl = ip ? `${scheme}://${ip}:${PORT}` : null;

  console.log("");
  console.log("=================================================");
  console.log("  healthdoc");
  console.log("=================================================");
  console.log(`  This PC:          ${localhostUrl}`);
  if (lanUrl) {
    console.log(`  LAN (other devices): ${lanUrl}`);
  }
  if (USE_HTTPS) {
    console.log("");
    console.log("  HTTPS enabled — camera works on localhost and LAN.");
    console.log("  On other devices, accept the certificate warning once.");
  } else if (lanUrl) {
    console.log("");
    console.log("  Camera on LAN needs HTTPS (default is on).");
    console.log(`  Or use ${localhostUrl} on this PC only.`);
  }
  console.log("=================================================");
  console.log("");

  return ip;
}

function startDevServer() {
  // 0.0.0.0 = listen on all interfaces (localhost + LAN IP)
  const hostname = "0.0.0.0";
  const nextCli = path.join(
    process.cwd(),
    "node_modules",
    "next",
    "dist",
    "bin",
    "next",
  );

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
