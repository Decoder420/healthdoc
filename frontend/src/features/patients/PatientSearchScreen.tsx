"use client";

import { useState, type FormEvent } from "react";
import { ApiError } from "@/lib/api";
import { searchPatients } from "./api";
import type { PatientSearchField, PatientSearchResponse } from "./types";

const PAGE_SIZE = 20;

const FIELD_LABELS: Record<PatientSearchField, string> = {
  uhid: "UHID",
  mobile: "Mobile",
  full_name: "Full name",
  abha_number: "ABHA",
};

const MATCH_LABELS: Record<string, string> = {
  uhid: "UHID",
  mobile: "Mobile",
  abha: "ABHA",
  name_dob: "Name",
  aadhaar: "Aadhaar",
};

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.code === 401) {
      return "Sign in required. Patient search uses the Keycloak session (F1-W1-03).";
    }
    if (err.code === 403) {
      return "You do not have access to patient search.";
    }
    if (err.isModuleDisabled) {
      return "Patient search is not offered at this facility.";
    }
    return err.message;
  }
  return "Search failed. Try again.";
}

export function PatientSearchScreen() {
  const [field, setField] = useState<PatientSearchField>("uhid");
  const [value, setValue] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PatientSearchResponse | null>(null);

  async function runSearch(nextPage: number) {
    const trimmed = value.trim();
    if (!trimmed) {
      setError(`Enter a ${FIELD_LABELS[field].toLowerCase()} to search.`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await searchPatients({
        field,
        value: trimmed,
        page: nextPage,
        pageSize: PAGE_SIZE,
      });
      setResult(data);
      setPage(nextPage);
    } catch (err) {
      setResult(null);
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void runSearch(1);
  }

  const pageCount = result ? Math.max(1, Math.ceil(result.total / result.page_size)) : 1;

  return (
    <main className="patient-search">
      <p className="text-xs font-medium text-muted-foreground">Receptionist</p>
      <h1 className="mt-1 text-2xl">Patient search</h1>
      <p className="mt-2 mb-6 max-w-2xl text-sm text-muted-foreground">
        Search the facility register by UHID, mobile, name, or ABHA. Results stay
        inside your facility; mobile numbers are masked.
      </p>

      <form className="surface-card p-4 sm:p-5" onSubmit={onSubmit}>
        <div className="patient-search__bar">
          <div>
            <label className="field-label" htmlFor="patient-search-field">
              Search by
            </label>
            <select
              id="patient-search-field"
              className="field-control"
              value={field}
              onChange={(e) => setField(e.target.value as PatientSearchField)}
            >
              {(Object.keys(FIELD_LABELS) as PatientSearchField[]).map((key) => (
                <option key={key} value={key}>
                  {FIELD_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="field-label" htmlFor="patient-search-value">
              {FIELD_LABELS[field]}
            </label>
            <input
              id="patient-search-value"
              className="field-control"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoComplete="off"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </form>

      {error && (
        <div
          className="mt-4 rounded-lg border border-danger/20 bg-danger-muted px-4 py-3 text-sm text-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {result && (
        <section className="surface-card mt-6 overflow-hidden">
          <div className="border-b border-border px-4 py-3 sm:px-5">
            <h2 className="text-base">Results</h2>
            <p className="text-xs text-muted-foreground">
              {result.total} match{result.total === 1 ? "" : "es"}
            </p>
          </div>
          <div className="patient-search__table-wrap">
            <table className="patient-search__table">
              <thead>
                <tr>
                  <th scope="col">UHID</th>
                  <th scope="col">Patient</th>
                  <th scope="col">Mobile</th>
                  <th scope="col">Matched on</th>
                </tr>
              </thead>
              <tbody>
                {result.items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-muted-foreground">
                      No patients match this search.
                    </td>
                  </tr>
                ) : (
                  result.items.map((patient) => (
                    <tr key={patient.id}>
                      <td className="font-semibold text-primary">
                        {patient.uhid ?? "—"}
                      </td>
                      <td>
                        <div className="font-medium">{patient.full_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {patient.age_years != null
                            ? `${patient.age_years} yrs`
                            : "Age unknown"}
                          {" · "}
                          {patient.sex}
                        </div>
                      </td>
                      <td>{patient.mobile_masked ?? "—"}</td>
                      <td>{MATCH_LABELS[patient.matched_on] ?? patient.matched_on}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {result.total > PAGE_SIZE && (
            <div className="flex justify-center gap-2 py-3">
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={loading || page <= 1}
                onClick={() => void runSearch(page - 1)}
              >
                Previous
              </button>
              <span className="self-center text-xs text-muted-foreground">
                Page {page} of {pageCount}
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                disabled={loading || page >= pageCount}
                onClick={() => void runSearch(page + 1)}
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
