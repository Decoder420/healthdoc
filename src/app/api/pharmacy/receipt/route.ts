import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import { getReceiptTemplate } from "@/features/pharmacy/ReceiptTemplate";
import { dispenseReceiptData } from "@/features/pharmacy/data/dispenseData";
export async function GET() {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    const html = getReceiptTemplate(dispenseReceiptData);

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm",
      },
    });

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'inline; filename="pharmacy-receipt.pdf"',
      },
    });
  } catch (error) {
    console.error("Receipt Generation Error:", error);

    return NextResponse.json(
      {
        message: "Failed to generate receipt.",
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