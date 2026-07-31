export type EmergencyInventoryStatus =
  | "Available"
  | "Low Stock"
  | "Near Expiry"
  | "Out of Service";

export type EmergencyInventoryItem = {
  id: string;
  itemCode: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  location: string;
  batchNumber: string | null;
  expiryDate: string | null;
  status: EmergencyInventoryStatus;
};

export const EMERGENCY_INVENTORY_CATALOG: Record<string, string[]> = {
  "Emergency Medicines": [
    "Adrenaline (Epinephrine)",
    "Atropine",
    "Amiodarone",
    "Dopamine",
    "Dobutamine",
    "Noradrenaline",
    "Nitroglycerin",
    "Sodium Bicarbonate",
    "Calcium Gluconate",
    "Magnesium Sulfate",
    "Diazepam",
    "Midazolam",
    "Lorazepam",
    "Phenytoin",
    "Mannitol",
    "Dextrose (25%, 50%)",
    "Normal Saline (0.9%)",
    "Ringer Lactate",
    "DNS",
    "IV Paracetamol",
    "Morphine",
    "Tramadol",
    "Ketamine",
    "Hydrocortisone",
    "Dexamethasone",
    "Insulin",
    "Activated Charcoal",
    "Naloxone",
  ],
  "IV Fluids": [
    "Normal Saline",
    "Ringer Lactate",
    "Dextrose 5%",
    "Dextrose 10%",
    "DNS",
    "Sterile Water for Injection",
  ],
  "Airway & Oxygen Supplies": [
    "Oxygen Cylinders",
    "Oxygen Flowmeters",
    "Oxygen Masks",
    "Nasal Cannulas",
    "Venturi Masks",
    "Non-Rebreather Masks",
    "Nebulizer Masks",
    "Ambu Bags (Adult/Pediatric)",
    "Oropharyngeal Airways",
    "Nasopharyngeal Airways",
    "Endotracheal Tubes",
    "Laryngoscope Handle",
    "Laryngoscope Blades",
    "Stylets",
    "Suction Catheters",
  ],
  "IV & Injection Consumables": [
    "IV Cannulas (18G, 20G, 22G, 24G)",
    "IV Giving Sets",
    "Extension Tubing",
    "Three-Way Stopcocks",
    "Syringes (2, 5, 10, 20, 50 mL)",
    "Needles",
    "Butterfly Needles",
    "Alcohol Swabs",
    "Tourniquets",
  ],
  "Dressing & Wound Care": [
    "Sterile Gauze",
    "Cotton Rolls",
    "Crepe Bandages",
    "Roller Bandages",
    "Adhesive Tape",
    "Transparent Dressings",
    "Sterile Dressing Packs",
    "Antiseptic Solution",
    "Povidone-Iodine",
    "Chlorhexidine",
  ],
  "Surgical & Trauma Supplies": [
    "Suture Materials",
    "Surgical Blades",
    "Forceps",
    "Scissors",
    "Needle Holders",
    "Splints",
    "Cervical Collars",
    "Trauma Dressings",
    "Burn Dressings",
  ],
  "Emergency Equipment": [
    "Defibrillator",
    "Cardiac Monitor",
    "Multiparameter Patient Monitor",
    "Portable Ventilator",
    "Suction Machine",
    "Infusion Pump",
    "Syringe Pump",
    "ECG Machine",
    "Pulse Oximeter",
    "Glucometer",
    "Portable Ultrasound",
    "Crash Cart (Code Blue Trolley)",
  ],
  "Personal Protective Equipment (PPE)": [
    "Surgical Gloves",
    "Sterile Gloves",
    "N95 Masks",
    "Surgical Masks",
    "Face Shields",
    "Goggles",
    "Disposable Gowns",
    "Shoe Covers",
    "Head Caps",
  ],
  "Infection Control": [
    "Hand Sanitizer",
    "Surface Disinfectant",
    "Biomedical Waste Bags",
    "Sharps Containers",
    "Biohazard Waste Bins",
  ],
  "Emergency Furniture & Transport": [
    "Stretchers",
    "Wheelchairs",
    "Examination Couches",
    "Patient Transfer Boards",
    "Spine Boards",
  ],
  "Diagnostic Supplies": [
    "ECG Electrodes",
    "Blood Collection Tubes",
    "Urine Collection Containers",
    "Rapid Test Kits",
    "Pregnancy Test Kits",
  ],
  Miscellaneous: [
    "Batteries",
    "Extension Cords",
    "UPS",
    "Flashlights",
    "Ice Packs",
    "Hot Water Bags",
    "Disposable Bed Sheets",
  ],
};

const CATEGORY_CODES: Record<string, string> = {
  "Emergency Medicines": "MED",
  "IV Fluids": "IVF",
  "Airway & Oxygen Supplies": "AIR",
  "IV & Injection Consumables": "IVC",
  "Dressing & Wound Care": "DRS",
  "Surgical & Trauma Supplies": "TRM",
  "Emergency Equipment": "EQP",
  "Personal Protective Equipment (PPE)": "PPE",
  "Infection Control": "INF",
  "Emergency Furniture & Transport": "FUR",
  "Diagnostic Supplies": "DIA",
  Miscellaneous: "MSC",
};

const CATEGORY_LOCATIONS: Record<string, string> = {
  "Emergency Medicines": "Emergency Drug Store / Crash Cart",
  "IV Fluids": "Emergency Fluid Store",
  "Airway & Oxygen Supplies": "Resuscitation Bay Store",
  "IV & Injection Consumables": "Emergency Consumable Store",
  "Dressing & Wound Care": "Dressing Room Store",
  "Surgical & Trauma Supplies": "Trauma Bay Store",
  "Emergency Equipment": "Emergency Equipment Bay",
  "Personal Protective Equipment (PPE)": "Emergency PPE Store",
  "Infection Control": "Emergency Utility Store",
  "Emergency Furniture & Transport": "Emergency Department",
  "Diagnostic Supplies": "Emergency Diagnostic Store",
  Miscellaneous: "Emergency General Store",
};

const NON_EXPIRING_CATEGORIES = new Set([
  "Emergency Equipment",
  "Emergency Furniture & Transport",
  "Miscellaneous",
]);

function unitForCategory(category: string): string {
  if (category === "Emergency Medicines") return "ampoules/vials";
  if (category === "IV Fluids") return "bottles";
  if (category === "Emergency Equipment") return "units";
  if (category === "Emergency Furniture & Transport") return "units";
  return "pieces";
}

export const INITIAL_EMERGENCY_INVENTORY: EmergencyInventoryItem[] =
  Object.entries(EMERGENCY_INVENTORY_CATALOG).flatMap(
    ([category, itemNames], categoryIndex) =>
      itemNames.map((name, itemIndex) => {
        const index = categoryIndex * 40 + itemIndex + 1;
        const durable = NON_EXPIRING_CATEGORIES.has(category);
        const outOfService =
          (category === "Emergency Equipment" ||
            category === "Emergency Furniture & Transport") &&
          index % 17 === 0;
        const nearExpiry = !durable && index % 13 === 0;
        const reorderLevel = durable ? 1 : category === "IV Fluids" ? 20 : 25;
        const normalQuantity = durable ? 2 + (index % 3) : 35 + (index % 70);
        const quantity = index % 11 === 0 ? Math.max(1, reorderLevel - 5) : normalQuantity;
        const status: EmergencyInventoryStatus = outOfService
          ? "Out of Service"
          : quantity <= reorderLevel
            ? "Low Stock"
            : nearExpiry
              ? "Near Expiry"
              : "Available";

        return {
          id: `emergency-item-${index}`,
          itemCode: `EMG-${CATEGORY_CODES[category]}-${String(
            itemIndex + 1,
          ).padStart(3, "0")}`,
          name,
          category,
          quantity,
          unit: unitForCategory(category),
          reorderLevel,
          location: CATEGORY_LOCATIONS[category],
          batchNumber: durable
            ? null
            : `${CATEGORY_CODES[category]}-26-${String(index).padStart(4, "0")}`,
          expiryDate: durable
            ? null
            : nearExpiry
              ? "2026-08-15"
              : "2028-12-31",
          status,
        };
      }),
  );
