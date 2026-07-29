import { NextRequest } from "next/server";
import puppeteer from "puppeteer";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
) {
  const { reportId } = await params;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    await page.setViewport({
      width: 1400,
      height: 2200,
      deviceScaleFactor: 2,
    });

    const origin =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const url = `${origin}/lab/reports/${reportId}?pdf=1`;

    console.log("Opening:", url);

    await page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait until the report is actually rendered
    await page.waitForSelector("#lab-report", {
      visible: true,
      timeout: 60000,
    });

    // Wait for React to finish rendering
    await page.waitForFunction(
      () => document.querySelector("#lab-report")?.innerHTML.length! > 500,
      {
        timeout: 60000,
      }
    );

    // Wait for fonts
    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    // Wait a little more for QR code, barcode etc.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // page.pdf() uses print media; ensure printable report CSS has applied.
    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm",
      },
    });

    await browser.close();

    return new Response(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${reportId}.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        success: false,
        error: String(err),
      },
      {
        status: 500,
      }
    );
  }
}