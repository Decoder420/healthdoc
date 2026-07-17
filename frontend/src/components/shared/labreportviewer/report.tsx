"use client";

import "./pathology-report.css";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react";
import { Printer } from "lucide-react";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";
import DownloadPdfButton from "./DownloadPdfButton";
import { formatDateTime } from "./utils";
import type { ReportData } from "./types/report";

interface ReportProps {
  report: ReportData;
}

const FLAG_CLASS: Record<string, string> = {
  NORMAL: "pr-val-normal",
  HIGH: "pr-val-high",
  LOW: "pr-val-low",
  BORDERLINE: "pr-val-borderline",
  CRITICAL: "pr-val-critical",
  PANIC: "pr-val-critical",
};

const FLAG_LABEL: Record<string, string> = {
  HIGH: "High",
  LOW: "Low",
  BORDERLINE: "Borderline",
  CRITICAL: "Critical",
  PANIC: "Panic",
};

export default function Report({ report }: ReportProps) {
  const searchParams = useSearchParams();
  const isPdfMode = searchParams.get("pdf") === "1";

  if (isPdfMode) {
    return (
      <div className="lab-report-shell" style={{ background: "#fff", padding: 0 }}>
        <PathologyReportDocument report={report} />
      </div>
    );
  }

  return (
    <div className="lab-report-shell pr-shell print:bg-white print:p-0">
      <div data-pdf-hide className="pr-toolbar print:hidden">
        <div>
          <h1>Pathology Report Preview</h1>
          <p>
            {report.patient.name} · {report.reportInfo.reportNumber} ·{" "}
            {formatDateTime(report.reportInfo.reportedAt)}
          </p>
        </div>
        <div className="pr-actions">
          <button
            type="button"
            className="pr-btn-print"
            onClick={() => window.print()}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Printer size={15} />
              Print
            </span>
          </button>
          <DownloadPdfButton
            reportId={report.reportInfo.reportId}
            reportNumber={report.reportInfo.reportNumber}
          />
        </div>
      </div>

      <div className="pr-paper-shadow" style={{ width: "210mm", maxWidth: "100%", margin: "0 auto" }}>
        <PathologyReportDocument report={report} />
      </div>
    </div>
  );
}

function PathologyReportDocument({ report }: { report: ReportData }) {
  const lab = report.laboratory;
  const signatories =
    report.signatories ??
    [
      {
        name: report.verification.verifiedBy,
        qualification: report.verification.qualification,
        designation: report.verification.designation,
        signature: report.verification.digitalSignature,
      },
    ];

  return (
    <article id="lab-report" className="pr-page lab-report">
      <div className="pr-inner">
        {/* Header */}
        <header className="pr-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="pr-logo"
            src={lab.logo}
            alt={lab.name}
            width={64}
            height={64}
          />

          <div>
            <h1 className="pr-lab-name">{lab.name}</h1>
            {lab.tagline && <p className="pr-tagline">{lab.tagline}</p>}
            <p className="pr-address">{lab.address}</p>
            {lab.nablNumber && (
              <p className="pr-nabl">NABL Accredited · {lab.nablNumber}</p>
            )}
          </div>

          <div className="pr-contact">
            <p className="pr-contact-row">
              <span className="icon" style={{ color: "#059669" }}>
                ☎
              </span>
              {lab.phone}
            </p>
            {lab.phoneSecondary && (
              <p className="pr-contact-row">
                <span className="icon" style={{ color: "#059669" }}>
                  ☎
                </span>
                {lab.phoneSecondary}
              </p>
            )}
            <p className="pr-contact-row email">
              <span className="icon" style={{ color: "#ea580c" }}>
                ✉
              </span>
              {lab.email}
            </p>
          </div>
        </header>
      </div>

      <div className="pr-band">
        <div className="pr-band-stripes" />
        <div className="pr-band-right">{lab.website}</div>
      </div>

      <div className="pr-inner">
        {/* Patient / sample / timing */}
        <table className="pr-patient">
          <tbody>
            <tr>
              <td className="pr-patient-left">
                <div className="pr-patient-row">
                  <div>
                    <p className="pr-patient-name">{report.patient.name}</p>
                    <p className="pr-kv">
                      Age : {report.patient.age} Years{" "}
                      <span style={{ color: "#cbd5e1" }}>|</span> Sex:{" "}
                      {report.patient.gender}
                    </p>
                    <p className="pr-kv">
                      PID : <strong>{report.patient.patientId}</strong>
                    </p>
                  </div>
                  <div className="pr-qr">
                    <QRCode
                      value={report.qrCode.value}
                      size={64}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                </div>
              </td>

              <td className="pr-patient-mid">
                <p className="pr-label">Sample Collected At:</p>
                <p className="pr-muted">
                  {report.sample.collectedAtLocation || lab.address}
                </p>
                <p className="pr-kv" style={{ marginTop: 10 }}>
                  <strong>Ref. By:</strong> {report.doctor.name}
                </p>
              </td>

              <td className="pr-patient-right">
                <div className="pr-barcode-wrap">
                  <Barcode
                    value={report.reportInfo.reportNumber}
                    format="CODE128"
                    width={1.15}
                    height={34}
                    displayValue={false}
                    margin={0}
                    background="#ffffff"
                  />
                </div>
                <table className="pr-time-table">
                  <tbody>
                    <tr>
                      <td>Registered on</td>
                      <td>{formatDateTime(report.order.orderedAt)}</td>
                    </tr>
                    <tr>
                      <td>Collected on</td>
                      <td>{formatDateTime(report.sample.collectedAt)}</td>
                    </tr>
                    <tr>
                      <td>Reported on</td>
                      <td>{formatDateTime(report.reportInfo.reportedAt)}</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>

        <h2 className="pr-title">{report.reportInfo.title}</h2>

        {/* Results */}
        <div className="pr-results-wrap">
          <div className="pr-watermark" aria-hidden>
            ABC
          </div>

          <table className="pr-results">
            <thead>
              <tr>
                <th>Investigation</th>
                <th>Result</th>
                <th>Reference Value</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {report.testGroups.map((group) => (
                <Fragment key={group.groupId}>
                  <tr className="pr-group">
                    <td colSpan={4}>{group.groupName}</td>
                  </tr>
                  {group.results.map((item) => {
                    const flagClass =
                      FLAG_CLASS[item.flag] ?? "pr-val-normal";
                    const flagLabel = FLAG_LABEL[item.flag];

                    return (
                      <tr className="pr-row" key={item.code}>
                        <td>
                          <span className="pr-test-name">{item.name}</span>
                          {item.note ? (
                            <span className="pr-test-note">({item.note})</span>
                          ) : null}
                        </td>
                        <td>
                          <span className={`pr-val ${flagClass}`}>
                            {item.result}
                          </span>
                          {flagLabel ? (
                            <span className={`pr-flag ${flagClass}`}>
                              {flagLabel}
                            </span>
                          ) : null}
                        </td>
                        <td>{item.referenceRange}</td>
                        <td>{item.unit}</td>
                      </tr>
                    );
                  })}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pr-notes">
          {report.reportInfo.instruments && (
            <p>
              <strong>Instruments:</strong> {report.reportInfo.instruments}
            </p>
          )}
          {report.remarks.interpretation && (
            <p>
              <strong>Interpretation:</strong> {report.remarks.interpretation}
            </p>
          )}
        </div>

        <div className="pr-end">
          <span>Thanks for Reference!!!</span>
          <span>****End of report****</span>
        </div>

        {/* Signatures */}
        <table className="pr-signs">
          <tbody>
            <tr>
              {signatories.slice(0, 3).map((person) => (
                <td key={person.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="pr-sign-img"
                    src={person.signature}
                    alt=""
                    width={140}
                    height={42}
                  />
                  <p className="pr-sign-name">{person.name}</p>
                  <p className="pr-sign-qual">{person.qualification}</p>
                  <p className="pr-sign-role">{person.designation}</p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        <div className="pr-gen">
          <span>
            <strong>Generated on:</strong>{" "}
            {formatDateTime(report.footer.generatedAt)}
          </span>
        </div>
      </div>

      <div className="pr-band pr-band-footer">
        <div className="pr-band-stripes" />
        <div className="pr-band-right" />
        <div className="pr-band-left-label">Sample Collection</div>
        {report.footer.whatsapp && (
          <div className="pr-band-right-label">
            <span>WhatsApp</span>
            <span>{report.footer.whatsapp}</span>
          </div>
        )}
      </div>
    </article>
  );
}
