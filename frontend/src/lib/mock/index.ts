/**
 * Central mock seed data until backend APIs are connected.
 * Feature APIs import from here — keep seed data out of features/.
 */

export type MockPatient = {
  id: string;
  name: string;
  uhid: string;
};

export type MockUser = {
  id: string;
  name: string;
  role: string;
};

export const mockPatients: MockPatient[] = [];

export const mockUsers: MockUser[] = [];

export * from "./facility";
export * from "./billing_data";
export * from "./charge_master_data";
export * from "./consent_data";
export * from "./audit_data";
export * from "./admin_data";
export * from "./reports_data";
export * from "./lab_data";
export * from "./lab_notification";
