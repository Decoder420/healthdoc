import { generatePDF } from "@/lib/lab_pdf";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolveBaseUrl(request: Request) {
  const configured = process.env.NEXT_PUBLIC_APP_URL;
  if (configured) return configured.replace(/\/$/, "");

  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const proto =
    request.headers.get("x-forwarded-proto") ??
    (host?.includes("localhost") ? "http" : "https");

  if (host) return `${proto}://${host}`;

  return "http://localhost:3000";
}

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{
      reportId: string;
    }>;
  }
) {
  const { reportId } = await params;
  const baseUrl = resolveBaseUrl(request);
  const reportUrl = `${baseUrl}/reports/${encodeURIComponent(reportId)}?pdf=1`;

  try {
    const pdf = await generatePDF(reportUrl);

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${reportId}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF generation failed:", error);

    return Response.json(
      {
        success: false,
        message: "Unable to generate PDF",
      },
      {
        status: 500,
      }
    );
  }
}
