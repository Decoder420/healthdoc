import puppeteer from "puppeteer";

interface RouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: Request,
  { params }: RouteProps
) {
  const { id } = await params;

  let browser: Awaited<
    ReturnType<typeof puppeteer.launch>
  > | null = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
      ],
    });

    const page = await browser.newPage();

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      "http://localhost:3000";

    await page.goto(
      `${baseUrl}/radiology/reports/${id}?pdf=1`,
      {
        waitUntil: "networkidle0",
        timeout: 60000,
      }
    );

    await page.waitForSelector("#radiology-report", {
      visible: true,
      timeout: 60000,
    });

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      displayHeaderFooter: true,

      headerTemplate: `<div></div>`,

      footerTemplate: `
        <div style="
          width:100%;
          padding:0 20px;
          font-size:10px;
          color:#666;
          display:flex;
          justify-content:space-between;
        ">
          <span>Radiology Report</span>

          <span>
            Page
            <span class="pageNumber"></span>
            /
            <span class="totalPages"></span>
          </span>
        </div>
      `,

      margin: {
        top: "15mm",
        right: "10mm",
        bottom: "20mm",
        left: "10mm",
      },
    });

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(pdf);
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${id}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Failed to generate PDF",
      },
      {
        status: 500,
      }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}