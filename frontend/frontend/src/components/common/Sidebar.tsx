"use client";

import { useState } from "react";
import Link from "next/link";
import {
  X,
  Search,
  LayoutDashboard,
  Package,
  FolderTree,
  Truck,
  ShoppingCart,
  Building2,
  BarChart3,
  Settings,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({
  open,
  setOpen,
}: SidebarProps) {
  const [departmentOpen, setDepartmentOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="sidebar-overlay"
        />
      )}

      <aside
  className={`
    fixed
    top-[70px]
    left-0
    z-40
    h-[calc(100vh-70px)]
    w-[260px]
    bg-white
    border-r
    border-border
    shadow-lg
    overflow-y-auto
    transition-transform
    duration-300
    ease-in-out
    p-4

    ${open ? "translate-x-0" : "-translate-x-full"}
  `}
>
        {/* Logo */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
  <div>
    <h2 className="text-xl font-bold text-[#001F54] tracking-wide">
      HMIS
    </h2>

    <p className="text-xs text-gray-500 mt-1">
      Inventory Management
    </p>
  </div>

  <button
    onClick={() => setOpen(false)}
    className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition"
  >
    <X size={20} />
  </button>
</div>

        {/* Search */}
        <div className="relative mt-5 mb-6">
  <Search
    size={18}
    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
  />

  <input
    type="text"
    placeholder="Search menu..."
    className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm outline-none focus:border-[#001F54] focus:bg-white transition"
  />
</div>

        <p className="mb-3 text-[11px] uppercase tracking-[2px] text-gray-400 font-semibold">
  Menu
</p>

       <nav className="space-y-2">
         <a
  href="#"
  className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-[#EEF4FF] transition"
>
  <div className="flex items-center gap-3">
    <div className="w-6 flex justify-center">
      <LayoutDashboard
        size={20}
        className="text-gray-500 group-hover:text-[#001F54]"
      />
    </div>

    <span className="font-medium text-gray-700 group-hover:text-[#001F54]">
      Dashboard
    </span>
  </div>

  <ChevronRight
    size={16}
    className="text-gray-300 group-hover:text-[#001F54]"
  />
</a>

          <a
  href="#"
  className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-[#EEF4FF] transition"
>
  <div className="flex items-center gap-3">
    <div className="w-6 flex justify-center">
      <Package
        size={20}
        className="text-gray-500 group-hover:text-[#001F54]"
      />
    </div>

    <span className="font-medium text-gray-700 group-hover:text-[#001F54]">
      Products
    </span>
  </div>

  <ChevronRight
    size={16}
    className="text-gray-300 group-hover:text-[#001F54]"
  />
</a>

         <a
  href="#"
  className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-[#EEF4FF] transition"
>
  <div className="flex items-center gap-3">
    <div className="w-6 flex justify-center">
      <FolderTree
        size={20}
        className="text-gray-500 group-hover:text-[#001F54]"
      />
    </div>

    <span className="font-medium text-gray-700 group-hover:text-[#001F54]">
      Categories
    </span>
  </div>

  <ChevronRight
    size={16}
    className="text-gray-300 group-hover:text-[#001F54]"
  />
</a>

          <a
  href="#"
  className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-[#EEF4FF] transition"
>
  <div className="flex items-center gap-3">
    <div className="w-6 flex justify-center">
      <Truck
        size={20}
        className="text-gray-500 group-hover:text-[#001F54]"
      />
    </div>

    <span className="font-medium text-gray-700 group-hover:text-[#001F54]">
      Suppliers
    </span>
  </div>

  <ChevronRight
    size={16}
    className="text-gray-300 group-hover:text-[#001F54]"
  />
</a>
         <a
  href="#"
  className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-[#EEF4FF] transition"
>
  <div className="flex items-center gap-3">
    <div className="w-6 flex justify-center">
      <ShoppingCart
        size={20}
        className="text-gray-500 group-hover:text-[#001F54]"
      />
    </div>

    <span className="font-medium text-gray-700 group-hover:text-[#001F54]">
      Purchase Orders
    </span>
  </div>

  <ChevronRight
    size={16}
    className="text-gray-300 group-hover:text-[#001F54]"
  />
</a>
          <div>
            <button
  onClick={() => setDepartmentOpen(!departmentOpen)}
  className="group flex w-full items-center justify-between rounded-xl px-4 py-3 hover:bg-[#EEF4FF] transition"
>
  <div className="flex items-center gap-3">
    <div className="w-6 flex justify-center">
      <Building2
        size={20}
        className="text-gray-500 group-hover:text-[#001F54]"
      />
    </div>

    <span className="font-medium text-gray-700 group-hover:text-[#001F54]">
      Department
    </span>
  </div>

  <ChevronRight
    size={16}
    className={`text-gray-400 transition-transform ${
      departmentOpen ? "rotate-90 text-[#001F54]" : ""
    }`}
  />
</button>

            {departmentOpen && (
              <div className="ml-7 mt-2 space-y-1 border-l border-gray-200 pl-4">
                <Link
                  href="/inventory/departments/radiology"
                  onClick={() => setOpen(false)}
                  className="block rounded-md py-2 text-sm text-gray-600 transition hover:text-[#001F54] hover:font-medium"
                >
                  Radiology
                </Link>

                <Link
                  href="/inventory/departments/pharmacy"
                  onClick={() => setOpen(false)}
                  className="block rounded-md py-2 text-sm text-gray-600 transition hover:text-[#001F54] hover:font-medium"
                >
                  Pharmacy
                </Link>

                <Link
                  href="/inventory/departments/laboratory"
                  onClick={() => setOpen(false)}
                  className="block rounded-md py-2 text-sm text-gray-600 transition hover:text-[#001F54] hover:font-medium"
                >
                  Laboratory
                </Link>

                <Link
                  href="/inventory/departments/ward-store"
                  onClick={() => setOpen(false)}
                  className="block rounded-md py-2 text-sm text-gray-600 transition hover:text-[#001F54] hover:font-medium"
                >
                  Ward Store
                </Link>

                <Link
                  href="/inventory/departments/emergency"
                  onClick={() => setOpen(false)}
                  className="block rounded-md py-2 text-sm text-gray-600 transition hover:text-[#001F54] hover:font-medium"
                >
                  Emergency
                </Link>
              </div>
            )}
          </div>

         <a
  href="#"
  className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-[#EEF4FF] transition"
>
  <div className="flex items-center gap-3">
    <div className="w-6 flex justify-center">
      <BarChart3
        size={20}
        className="text-gray-500 group-hover:text-[#001F54]"
      />
    </div>

    <span className="font-medium text-gray-700 group-hover:text-[#001F54]">
      Reports
    </span>
  </div>

  <ChevronRight
    size={16}
    className="text-gray-300 group-hover:text-[#001F54]"
  />
</a>

         <a
  href="#"
  className="group flex items-center justify-between rounded-xl px-4 py-3 hover:bg-[#EEF4FF] transition"
>
  <div className="flex items-center gap-3">
    <div className="w-6 flex justify-center">
      <Settings
        size={20}
        className="text-gray-500 group-hover:text-[#001F54]"
      />
    </div>

    <span className="font-medium text-gray-700 group-hover:text-[#001F54]">
      Settings
    </span>
  </div>

  <ChevronRight
    size={16}
    className="text-gray-300 group-hover:text-[#001F54]"
  />
</a>

        </nav>
      </aside>
    </>
  );
}