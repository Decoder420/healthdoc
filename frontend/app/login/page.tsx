"use client";

// F1-W1-03 implements the real flow: Keycloak redirect (PKCE), JWT refresh,
// role-based redirect after login. lib/auth.ts holds the Keycloak client.
export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-80 rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-semibold">Sign in</h1>
        <button
          className="w-full rounded bg-blue-600 px-4 py-2 text-white"
          onClick={() => alert("F1-W1-03: wire Keycloak login here")}
        >
          Continue with Keycloak
        </button>
      </div>
    </main>
  );
}
