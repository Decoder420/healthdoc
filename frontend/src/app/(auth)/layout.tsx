export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background px-4"
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "#f4f6f9",
      }}
    >
      <div className="w-full max-w-md" style={{ width: "100%", maxWidth: "28rem" }}>
        {children}
      </div>
    </div>
  );
}
