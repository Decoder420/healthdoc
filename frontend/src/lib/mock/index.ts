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

export * from "./doctor_data";
