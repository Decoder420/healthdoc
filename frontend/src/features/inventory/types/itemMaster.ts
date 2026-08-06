
export interface ItemMaster {
  id: string;

  itemCode: string;
  itemName: string;

  category: string;
  subcategory?: string;

  brand?: string;

  unit: string;

  minimumStock: number;
  reorderLevel: number;

  supplierId?: string;
  supplierName?: string;

  storageLocation?: string;

  description?: string;

  isActive: boolean;

  createdAt: string;
}

