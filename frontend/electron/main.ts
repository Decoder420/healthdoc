// Electron shell — F1-W1-02 (shell only; weekly test builds in CI).
// Dev: loads the Next.js dev server. Prod: loads exported build.
import { app, BrowserWindow } from "electron";

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  const devUrl = process.env.HEALTHDOC_URL ?? "https://localhost";
  void win.loadURL(devUrl);
}

app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
