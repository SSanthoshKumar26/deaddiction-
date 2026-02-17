const puppeteer = require('puppeteer');

const generatePdf = async (htmlContent, appointmentId) => {
    let browser;

    try {
        console.log(`[PDF Service] Generating PDF for Appointment: ${appointmentId}`);

        // Dynamically resolve Chrome path
        const executablePath = puppeteer.executablePath();

        console.log("Using Chrome at:", executablePath);

        browser = await puppeteer.launch({
            executablePath,
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu'
            ],
            timeout: 60000
        });

        const page = await browser.newPage();

        await page.setContent(htmlContent, {
            waitUntil: 'domcontentloaded',
            timeout: 60000
        });

        const pdfBuffer = await page.pdf({
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

        if (!pdfBuffer || pdfBuffer.length === 0) {
            throw new Error('Generated PDF buffer is empty');
        }

        console.log(`[PDF Service] Successfully generated PDF (${pdfBuffer.length} bytes)`);

        return pdfBuffer;

    } catch (error) {
        console.error('[PDF Service] Failed:', error);
        if (browser) await browser.close();
        throw error;
    }
};

module.exports = { generatePdf };
