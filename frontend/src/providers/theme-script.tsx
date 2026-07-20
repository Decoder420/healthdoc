import Script from "next/script";

/** Runs before paint to avoid light/dark flash on load. */
export function ThemeScript() {
  const script = `
(function () {
  try {
    var key = "healthdoc-theme";
    var stored = localStorage.getItem(key);
    var theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    var root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.setAttribute("data-bs-theme", theme);
    root.style.colorScheme = theme;
  } catch (e) {}
})();
`;

  return (
    <Script id="healthdoc-theme-init" strategy="beforeInteractive">
      {script}
    </Script>
  );
}
