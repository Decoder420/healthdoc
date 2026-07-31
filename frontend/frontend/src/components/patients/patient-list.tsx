"use client";

import type { Patient } from "@/features/patients/types";
import { formatAbha, maskAadhaar } from "@/features/patients/utils/patient-validation";
import { Button } from "@/components/ui/button";

type PatientListProps = {
  patients: Patient[];
  selectedUhid?: string | null;
  onSelect: (patient: Patient) => void;
};

export function PatientList({ patients, selectedUhid, onSelect }: PatientListProps) {
  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">Patients</h2>
        <p className="text-xs text-muted-foreground">
          {patients.length} record{patients.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">UHID</th>
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Mobile</th>
              <th className="px-5 py-3 font-medium">Aadhaar</th>
              <th className="px-5 py-3 font-medium">ABHA</th>
              <th className="px-5 py-3 font-medium">Registered</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                  No patients match the current filters.
                </td>
              </tr>
            ) : (
              patients.map((patient) => {
                const isSelected = selectedUhid === patient.uhid;
                return (
                  <tr
                    key={patient.uhid}
                    className={
                      isSelected
                        ? "bg-accent/40"
                        : "hover:bg-muted/40"
                    }
                  >
                    <td className="px-5 py-3.5 font-semibold text-primary">
                      {patient.uhid}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-muted text-sm font-semibold text-primary">
                          {patient.photo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={patient.photo}
                              alt={patient.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            patient.name.charAt(0)
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{patient.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {patient.age} yrs · {patient.gender}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-foreground">{patient.phone}</td>
                    <td className="px-5 py-3.5 text-foreground">
                      {patient.aadhaar ? maskAadhaar(patient.aadhaar) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-foreground">
                      {patient.abha ? formatAbha(patient.abha) : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-muted-foreground">
                      {new Date(patient.registeredAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <Button
                        type="button"
                        variant={isSelected ? "primary" : "outline"}
                        size="sm"
                        onClick={() => onSelect(patient)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
