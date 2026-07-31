"use client";

import { Menu, Bell, Settings, User, Search } from "lucide-react";

interface NavbarProps {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setOpen }: NavbarProps) {
  return (
    <header
      className="
        fixed
        top-0
        left-0
        right-0
        z-50
        h-16
        bg-white
        border-b
        border-border
        flex
        items-center
        justify-between
        px-6
        shadow-sm
      "
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu size={22} />
        </button>

        <h1 className="text-xl font-semibold text-primary">
          HMIS
        </h1>
      </div>

      {/* Center */}
      <div className="hidden lg:block w-[450px]">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />

          <input
            type="text"
            placeholder="Search Products..."
            className="w-full rounded-lg border border-border bg-background pl-10 pr-4 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer" />

        <Settings className="cursor-pointer" />

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
            <User size={18} />
          </div>

          <div>
            <p className="font-medium">Vanshika</p>
            <p className="text-xs text-muted-foreground">
              Inventory Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}