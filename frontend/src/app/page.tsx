import Link from "next/link";

export default function HomePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-muted px-6">
      <div className="max-w-lg text-center">
        <p className="text-xs font-medium tracking-[0.28em] text-muted-foreground">
          HEALTHDOC HMIS
        </p>
        <h1 className="mt-3 text-3xl sm:text-4xl">
          Hospital Information Management
        </h1>
        <p className="mt-3 mb-8 text-sm text-muted-foreground">
          Staging frontend. Patient search is the first live module on this
          branch.
        </p>
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link className="btn btn-primary" href="/receptionist/patient-search">
            Patient search
          </Link>
          <Link className="btn btn-outline" href="/login">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
