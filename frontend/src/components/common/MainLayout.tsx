"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar setOpen={setOpen} />

      <Sidebar open={open} setOpen={setOpen} />

      <main className="pt-16 p-6">
        {children}
      </main>
    </div>
  );
}