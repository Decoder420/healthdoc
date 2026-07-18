export type LaboratoryEquipmentStatus =
  | "Operational"
  | "Calibration Due"
  | "Maintenance Due"
  | "Out of Service";

export type LaboratoryEquipment = {
  id: string;
  assetId: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  status: LaboratoryEquipmentStatus;
  calibrationDue: string | null;
  maintenanceDue: string;
};

export const LABORATORY_EQUIPMENT_CATALOG: Record<string, string[]> = {
  "Sample Collection": [
    "Phlebotomy Chair",
    "Blood Collection Monitor",
    "Tourniquets",
    "Sample Collection Tray",
    "Barcode Label Printer",
    "Specimen Transport Box",
    "Vaccine/Specimen Carrier",
  ],
  "General Laboratory Equipment": [
    "Laboratory Workbench",
    "Laboratory Refrigerator (2–8°C)",
    "Deep Freezer (-20°C/-80°C)",
    "Incubator",
    "Hot Air Oven",
    "Water Bath",
    "Heating Mantle",
    "Magnetic Stirrer",
    "Vortex Mixer",
    "Centrifuge",
    "Microcentrifuge",
    "Orbital Shaker",
    "Laboratory Balance",
    "Analytical Balance",
    "pH Meter",
    "Conductivity Meter",
    "Autoclave",
    "Laminar Air Flow Cabinet",
    "Biosafety Cabinet (Class II)",
    "Fume Hood",
  ],
  Hematology: [
    "Hematology Analyzer",
    "ESR Analyzer",
    "Blood Cell Counter",
    "Hemoglobin Meter",
    "Coagulation Analyzer",
    "Blood Mixer",
  ],
  "Clinical Biochemistry": [
    "Fully Automatic Biochemistry Analyzer",
    "Semi-Automatic Biochemistry Analyzer",
    "Electrolyte Analyzer",
    "Blood Gas Analyzer",
    "HbA1c Analyzer",
  ],
  Microbiology: [
    "BOD Incubator",
    "Anaerobic Jar",
    "Colony Counter",
    "Microscope",
    "Fluorescence Microscope",
    "Sterility Testing Unit",
  ],
  "Pathology & Histopathology": [
    "Tissue Processor",
    "Paraffin Embedding Station",
    "Microtome",
    "Cryostat",
    "Slide Stainer",
    "Slide Dryer",
    "Tissue Floatation Bath",
  ],
  "Immunology & Serology": [
    "ELISA Reader",
    "ELISA Washer",
    "Immunoassay Analyzer",
    "Chemiluminescence Immunoassay (CLIA) Analyzer",
  ],
  "Molecular Diagnostics": [
    "PCR Machine (Thermal Cycler)",
    "Real-Time PCR (qPCR) System",
    "Gel Electrophoresis Unit",
    "Gel Documentation System",
    "DNA/RNA Extraction System",
  ],
  Urinalysis: ["Urine Analyzer", "Urine Strip Reader"],
  "Consumable Storage": [
    "Reagent Refrigerator",
    "Chemical Storage Cabinet",
    "Flammable Chemical Cabinet",
  ],
  "Sterilization & Waste Management": [
    "Biomedical Waste Bins",
    "Needle Destroyer",
    "Autoclave",
    "UV Sterilizer",
  ],
  "IT & Documentation": [
    "Desktop Computer",
    "Barcode Scanner",
    "Barcode Label Printer",
    "Label Applicator",
    "Receipt Printer",
    "UPS",
    "Network Switch",
  ],
};

const CATEGORY_CODES: Record<string, string> = {
  "Sample Collection": "SC",
  "General Laboratory Equipment": "GL",
  Hematology: "HEM",
  "Clinical Biochemistry": "BIO",
  Microbiology: "MIC",
  "Pathology & Histopathology": "HIS",
  "Immunology & Serology": "IMM",
  "Molecular Diagnostics": "MOL",
  Urinalysis: "URI",
  "Consumable Storage": "STO",
  "Sterilization & Waste Management": "SWM",
  "IT & Documentation": "IT",
};

const CATEGORY_LOCATIONS: Record<string, string> = {
  "Sample Collection": "Sample Collection Room",
  "General Laboratory Equipment": "Central Laboratory",
  Hematology: "Hematology Lab",
  "Clinical Biochemistry": "Biochemistry Lab",
  Microbiology: "Microbiology Lab",
  "Pathology & Histopathology": "Histopathology Lab",
  "Immunology & Serology": "Immunology Lab",
  "Molecular Diagnostics": "Molecular Diagnostics Lab",
  Urinalysis: "Clinical Pathology Lab",
  "Consumable Storage": "Laboratory Store",
  "Sterilization & Waste Management": "Sterilization Utility",
  "IT & Documentation": "LIS Work Area",
};

function equipmentStatus(index: number): LaboratoryEquipmentStatus {
  if (index % 19 === 0) return "Out of Service";
  if (index % 13 === 0) return "Calibration Due";
  if (index % 11 === 0) return "Maintenance Due";
  return "Operational";
}

function equipmentQuantity(name: string): number {
  if (
    /Tourniquets|Tray|Transport Box|Carrier|Waste Bins|Scanner|UPS|Computer/i.test(
      name,
    )
  ) {
    return 4;
  }
  return 1;
}

export const INITIAL_LABORATORY_EQUIPMENT: LaboratoryEquipment[] =
  Object.entries(LABORATORY_EQUIPMENT_CATALOG).flatMap(
    ([category, equipmentNames], categoryIndex) =>
      equipmentNames.map((name, itemIndex) => {
        const index = categoryIndex * 20 + itemIndex + 1;
        const status = equipmentStatus(index);
        return {
          id: `lab-equipment-${index}`,
          assetId: `LAB-${CATEGORY_CODES[category]}-${String(
            itemIndex + 1,
          ).padStart(3, "0")}`,
          name,
          category,
          quantity: equipmentQuantity(name),
          location: CATEGORY_LOCATIONS[category],
          status,
          calibrationDue:
            /Analyzer|Meter|Balance|Monitor|PCR|Reader|Centrifuge|Microscope/i.test(
              name,
            )
              ? status === "Calibration Due"
                ? "2026-07-15"
                : "2026-10-15"
              : null,
          maintenanceDue:
            status === "Maintenance Due" ? "2026-07-16" : "2026-11-30",
        };
      }),
  );
