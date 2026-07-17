"use client";

import { useEffect } from "react";

/** Loads Bootstrap JS so data-bs-toggle offcanvas/dropdown handlers work. */
export default function BootstrapClient() {
  useEffect(() => {
    void import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bootstrap) => {
      (window as Window & { bootstrap?: typeof bootstrap }).bootstrap = bootstrap;
    });
  }, []);

  return null;
}
