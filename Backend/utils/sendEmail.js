const axios = require('axios');

/**
 * Send email using Brevo REST API (v3)
 * @param {Object} options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML body
 * @param {Array}  [options.attachments] - [{ name, content }]
 */
const sendEmail = async (options) => {
    try {
        const apiKey = process.env.BREVO_API_KEY;
        const fromName = process.env.FROM_NAME || 'SOBER Psychiatric Center';
        const fromEmail = process.env.FROM_EMAIL || 'soberhospital.care@gmail.com';

        if (!apiKey) {
            throw new Error('BREVO_API_KEY is missing');
        }

        // ✅ Properly prepare attachments (Brevo uses "attachment" key - singular)
        let attachmentPayload = undefined;

        if (options.attachments && options.attachments.length > 0) {
            attachmentPayload = options.attachments.map(file => {
                let base64Content = file.content;

                if (typeof base64Content === 'string') {
                    // Remove base64 prefix if exists
                    base64Content = base64Content
                        .replace(/^data:.*?;base64,/, '')
                        .replace(/\s/g, '');
                }

                return {
                    name: file.name,
                    content: base64Content
                };
            });
        }

        const payload = {
            sender: {
                name: fromName,
                email: fromEmail
            },
            to: [
                {
                    email: options.email
                }
            ],
            subject: options.subject,
            htmlContent: options.html,
            attachment: attachmentPayload // ✅ correct key
        };

        const response = await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            payload,
            {
                headers: {
                    'api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(
            `[Brevo API] Email sent to ${options.email}. MsgID: ${response.data.messageId}`
        );

        return response.data;

    } catch (error) {
        if (error.response) {
            console.error(
                '[Brevo API] Failure:',
                JSON.stringify(error.response.data, null, 2)
            );
            throw new Error(error.response.data.message || 'Brevo API Error');
        }

        console.error('[Brevo API] Error:', error.message);
        throw error;
    }
};

module.exports = sendEmail;
