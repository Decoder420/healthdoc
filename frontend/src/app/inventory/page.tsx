
 "use client";

import MainLayout from "@/components/common/MainLayout";

import InventoryTrendChart from "@/components/dashboards/inventory/dashboard/InventoryTrendChart";
import LowStockCategoryChart from "@/components/dashboards/inventory/dashboard/LowStockCard";
import RecentPurchasestable from "@/components/dashboards/inventory/dashboard/RecentPurchasestable"
import ExpiryTable from "@/components/dashboards/inventory/dashboard/ExpiryTable";
import { useEffect, useState } from "react";
import { InventoryItem } from "@/types/inventory";




export default function InventoryHomePage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  useEffect(() => {
  const data = localStorage.getItem("inventory");

  if (data) {
    setInventory(JSON.parse(data));
  }
}, []);

useEffect(() => {
   localStorage.setItem( "inventory", JSON.stringify(inventory) );
   }, [inventory]);
  return (
    <MainLayout>
      <div className="space-y-6">

        <h2 className="text-2xl font-bold "  style={{ color: "#001f54" }}>
          Hi, Vanshika
        </h2>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-gray-500">Products</h3>
    <p className="text-3xl font-bold">2150</p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-gray-500">Low Stock</h3>
    <p className="text-3xl font-bold text-red-600">18</p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-gray-500">Suppliers</h3>
    <p className="text-3xl font-bold">96</p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-gray-500">Orders</h3>
    <p className="text-3xl font-bold">124</p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-gray-500">Expiring</h3>
    <p className="text-3xl font-bold">30</p>
  </div>

  <div className="bg-white rounded-xl shadow p-6">
    <h3 className="text-gray-500">Stock Values</h3>
    <p className="text-3xl font-bold">400</p>
  </div>

</div>
{/* Charts Section */}
<div className="grid grid-cols-2 lg:grid-cols-2 gap-6 mt-6">
  <InventoryTrendChart />

  <LowStockCategoryChart />
 
</div>

{/* Recent Inventory Table */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">

  <div className="bg-white rounded-xl shadow p-4 h-[420px]">
    <h3 className="text-lg font-semibold text-center mb-4">
      Recent Purchases
    </h3>
    <RecentPurchasestable />
  </div>

  <div className="bg-white rounded-xl shadow p-4 h-[420px]">
    <h3 className="text-lg font-semibold text-center mb-4">
      Expiring Products
    </h3>
    <ExpiryTable />
  </div>

</div>




  



      </div>
    </MainLayout>
  );
}