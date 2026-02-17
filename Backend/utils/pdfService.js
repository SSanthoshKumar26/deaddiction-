const puppeteer = require('puppeteer');

const generatePdf = async (htmlContent, appointmentId) => {
    let browser;

    try {
        console.log(`[PDF Service] Generating PDF for Appointment: ${appointmentId}`);

        const isProduction = process.env.RENDER === "true";

        browser = await puppeteer.launch({
            headless: true,
            executablePath: isProduction ? "/usr/bin/chromium" : undefined,
            args: isProduction
                ? [
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--disable-dev-shm-usage",
                    "--disable-gpu"
                ]
                : [],
            timeout: 60000
        });

        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true
        });

        await browser.close();
        return pdfBuffer;

    } catch (error) {
        console.error('[PDF Service] Failed:', error);
        if (browser) await browser.close();
        throw error;
    }
};

module.exports = { generatePdf };
