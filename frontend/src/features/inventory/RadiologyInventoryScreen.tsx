"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/dashboards/inventory/departments/radiology/Header";
import DashboardCards from "@/components/dashboards/inventory/departments/radiology/DashboardCards";
import FilmStockChart from "@/components/dashboards/inventory/departments/radiology/FilmStockChart";
import MachineStatus from "@/components/dashboards/inventory/departments/radiology/Machinestatus";
import ContrastChart from "@/components/dashboards/inventory/departments/radiology/ContrastChart";
import ConsumableStatus from "@/components/dashboards/inventory/departments/radiology/ConsumableStatus";
import RecentInventoryTable from "@/components/dashboards/inventory/departments/radiology/RecentInventoryTable";
import MachineAvailabilityTable from "@/components/dashboards/inventory/departments/radiology/MachineAvailabilityTable";
import MachineMaintenanceTable from "@/components/dashboards/inventory/departments/radiology/MachineMaintenanceTable";
import TechnicianAssignmentTable from "@/components/dashboards/inventory/departments/radiology/TechnicianAssignmentTable";
import LowStockAlert from "@/components/dashboards/inventory/departments/radiology/LowStockAlert";
import ExpiringItems from "@/components/dashboards/inventory/departments/radiology/ExpiringItems";
import PurchaseOrders from "@/components/dashboards/inventory/departments/radiology/PurchaseOrders";
import VendorPerformance from "@/components/dashboards/inventory/departments/radiology/VendorPerformance";
import type { InventoryItem } from "@/types/inventory";

const STORAGE_KEY = "radiologyInventory";

export function RadiologyInventoryScreen() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const savedInventory = localStorage.getItem(STORAGE_KEY);
        if (savedInventory) {
          setInventory(JSON.parse(savedInventory) as InventoryItem[]);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsLoaded(true);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    }
  }, [inventory, isLoaded]);

  const filteredInventory = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return inventory;

    return inventory.filter((item) =>
      [
        item.itemName,
        item.category,
        item.brand,
        item.supplier,
        item.batchNumber,
      ].some((value) => value.toLowerCase().includes(query)),
    );
  }, [inventory, search]);

  function handleAddItem(item: InventoryItem) {
    setInventory((current) => [{ ...item, id: Date.now() }, ...current]);
  }

  return (
    <div className="space-y-6">
      <Header
        onAddItem={handleAddItem}
        search={search}
        setSearch={setSearch}
        inventory={inventory}
      />
      <DashboardCards />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <FilmStockChart />
        <MachineStatus />
      </section>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <ContrastChart />
        <ConsumableStatus />
      </section>

      <RecentInventoryTable inventory={filteredInventory} />
      <MachineAvailabilityTable />
      <MachineMaintenanceTable />
      <TechnicianAssignmentTable />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <LowStockAlert />
        <ExpiringItems />
      </section>
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PurchaseOrders />
        <VendorPerformance />
      </section>
    </div>
  );
}
