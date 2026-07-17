#!/usr/bin/env node
/**
 * Prints LAN IP and starts Next.js on port 3000.
 * Usage: node scripts/print-lan-ip.mjs
 */
import { networkInterfaces } from "os";
import { spawn } from "child_process";

function lanIp() {
  const nets = networkInterfaces();
  for (const entries of Object.values(nets)) {
    for (const net of entries ?? []) {
      if (net.family === "IPv4" && !net.internal) return net.address;
    }
  }
  return "localhost";
}

const ip = lanIp();
console.log(`\n  HealthDoc frontend`);
console.log(`  Local:   http://localhost:3000`);
console.log(`  Network: http://${ip}:3000\n`);

const child = spawn("npx", ["next", "dev", "-p", "3000", "-H", "0.0.0.0"], {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => process.exit(code ?? 0));
