"use client";

import { useState, useEffect } from "react";

import MainLayout from "@/components/common/MainLayout";

import Header from "@/components/dashboards/inventory/departments/radiology/Header";
import DashboardCards from "@/components/dashboards/inventory/departments/radiology/DashboardCards";
import FilmStockChart from "@/components/dashboards/inventory/departments/radiology/FilmStockChart";
import MachineStatus from "@/components/dashboards/inventory/departments/radiology/Machinestatus";
import ContrastChart from "@/components/dashboards/inventory/departments/radiology/ContrastChart";
import ConsumableStatus from "@/components/dashboards/inventory/departments/radiology/ConsumableStatus";
import RecentInventoryTable from "@/components/dashboards/inventory/departments/radiology/RecentInventoryTable";
import MachineAvailabilityTable from "@/components/dashboards/inventory/departments/radiology/MachineAvailabilityTable";
import TechnicianAssignmentTable from "@/components/dashboards/inventory/departments/radiology/TechnicianAssignmentTable";
import LowStockAlert from "@/components/dashboards/inventory/departments/radiology/LowStockAlert";
import ExpiringItems from "@/components/dashboards/inventory/departments/radiology/ExpiringItems";
import PurchaseOrders from "@/components/dashboards/inventory/departments/radiology/PurchaseOrders";
import VendorPerformance from "@/components/dashboards/inventory/departments/radiology/VendorPerformance";
import MachineMaintenanceTable from "@/components/dashboards/inventory/departments/radiology/MachineMaintenanceTable";

interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  brand: string;
  supplier: string;
  quantity: number;
  unit: string;
  minimumStock: number;
  reorderLevel: number;
  batchNumber: string;
  expiryDate: string;
}

export default function RadiologyPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [search, setSearch] = useState("");
  // Load inventory from localStorage
  useEffect(() => {
    const savedInventory = localStorage.getItem("radiologyInventory");

    if (savedInventory) {
      setInventory(JSON.parse(savedInventory));
    }
  }, []);

  const filteredInventory = inventory.filter((item) =>
  item.itemName.toLowerCase().includes(search.toLowerCase()) ||
  item.category.toLowerCase().includes(search.toLowerCase()) ||
  item.brand.toLowerCase().includes(search.toLowerCase()) ||
  item.supplier.toLowerCase().includes(search.toLowerCase()) ||
  item.batchNumber.toLowerCase().includes(search.toLowerCase())
);

  // Save inventory whenever it changes
  useEffect(() => {
    localStorage.setItem(
      "radiologyInventory",
      JSON.stringify(inventory)
    );
  }, [inventory]);

  // Add new inventory item
  const handleAddItem = (item: InventoryItem) => {
  console.log("New Item:", item);

  const newItem = {
    ...item,
    id: Date.now(),
  };

  setInventory((prev) => [newItem, ...prev]);
};

  console.log("Inventory:", inventory);
console.log("Filtered Inventory:", filteredInventory);

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-4 space-y-4">

       <Header
  onAddItem={handleAddItem}
  search={search}
  setSearch={setSearch}
  inventory={inventory}
/>

        <DashboardCards />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <FilmStockChart />
          <MachineStatus />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <ContrastChart />
          <ConsumableStatus />
        </div>

        <RecentInventoryTable inventory={filteredInventory} />

        <MachineAvailabilityTable />

        <MachineMaintenanceTable />

        <TechnicianAssignmentTable />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <LowStockAlert />
          <ExpiringItems />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <PurchaseOrders />
          <VendorPerformance />
        </div>

      </div>
    </MainLayout>
  );
}