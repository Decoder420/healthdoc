import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: 720, margin: "0 auto", fontFamily: "system-ui" }}>
      <h1 style={{ margin: 0 }}>HealthDoc HMIS</h1>
      <p style={{ color: "#4a6282" }}>Frontend is running.</p>
      <ul>
        <li>
          <Link href="/billing">Billing</Link>
        </li>
        <li>
          <Link href="/audit-viewer">Audit trail</Link>
        </li>
        <li>
          <Link href="/consent">Consent</Link>
        </li>
        <li>
          <Link href="/inventory">Inventory</Link>
        </li>
        <li>
          <Link href="/lab/dashboard">Lab dashboard</Link>
        </li>
      </ul>
    </main>
  );
}
