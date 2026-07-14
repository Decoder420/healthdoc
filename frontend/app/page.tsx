import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">HealthDoc HMIS</h1>
      <p className="text-gray-500">Skeleton running. Role dashboards land in Week 1–2.</p>
      <Link href="/login" className="rounded bg-blue-600 px-4 py-2 text-white">
        Sign in
      </Link>
    </main>
  );
}
