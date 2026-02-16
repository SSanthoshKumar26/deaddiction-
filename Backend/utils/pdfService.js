const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const generatePdf = async (htmlContent, appointmentId) => {
    let browser;
    try {
        console.log(`[PDF Service] Generating PDF for Appointment: ${appointmentId}`);

        // Define local executable path
        const localChromePath = path.join(process.cwd(), '.cache', 'puppeteer', 'chrome', 'win64-145.0.7632.67', 'chrome-win64', 'chrome.exe');

        const launchOptions = {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--font-render-hinting=none'
            ],
            timeout: 60000
        };

        if (fs.existsSync(localChromePath)) {
            launchOptions.executablePath = localChromePath;
        }

        browser = await puppeteer.launch(launchOptions);
        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        // page.pdf() returns a Uint8Array in some environments, but we want a Node Buffer
        const pdfData = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            }
        });

        await browser.close();

        // Ensure it's a Node.js Buffer so .toString('base64') works correctly
        const pdfBuffer = Buffer.from(pdfData);

        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error('Generated PDF buffer is empty');
        }

        console.log(`[PDF Service] Successfully generated PDF (${pdfBuffer.length} bytes)`);
        return pdfBuffer;
    } catch (error) {
        console.error(`[PDF Service] Failed:`, error.message);
        if (browser) await browser.close();
        throw error;
    }
};

module.exports = { generatePdf };
