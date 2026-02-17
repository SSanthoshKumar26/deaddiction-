const getBaseStyles = () => `
  body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Plus Jakarta Sans', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
  .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
  .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0; }
  .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 20px; text-align: center; }
  .logo-text { color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.025em; margin: 0; text-transform: uppercase; }
  .logo-text span { color: #38bdf8; }
  .content { padding: 40px; }
  .title { font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; letter-spacing: -0.025em; text-align: center; }
  .description { font-size: 16px; color: #64748b; line-height: 1.6; margin-bottom: 24px; text-align: center; }
  .card { background-color: #f1f5f9; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #e2e8f0; }
  .card-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; }
  .card-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .card-label { font-size: 13px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
  .card-value { font-size: 15px; font-weight: 700; color: #0f172a; text-align: right; }
  .btn-container { text-align: center; margin-top: 32px; }
  .btn { display: inline-block; background-color: #0f172a; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; transition: background-color 0.2s; box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.1); }
  .footer { background-color: #f8fafc; padding: 32px; border-top: 1px solid #f1f5f9; text-align: center; }
  .footer-text { font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0; }
`;

exports.forgotPasswordTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
    <style>${getBaseStyles()}</style>
</head>
<body>
    <center class="wrapper">
        <table class="main" role="presentation">
            <tr>
                <td class="header">
                   <h1 class="logo-text">SOBER <span>CENTER</span></h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <h2 class="title">Reset Your Password</h2>
                    <p class="description">
                        We received a request to reset your password. Use the secure OTP below to proceed.
                    </p>
                    
                    <div style="background-color: #f0f9ff; border: 2px solid #bae6fd; border-radius: 24px; padding: 32px; margin: 32px 0; text-align: center;">
                        <span style="font-size: 12px; font-weight: 800; color: #0369a1; text-transform: uppercase; letter-spacing: 0.2em; display: block; margin-bottom: 16px;">One-Time Password</span>
                        <div style="font-size: 48px; font-weight: 800; color: #0284c7; letter-spacing: 8px; font-family: monospace;">${otp}</div>
                    </div>

                    <p class="description" style="font-size: 14px; margin-bottom: 0;">
                        This code is valid for 10 minutes. If you didn't request this, please ignore this email.
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p class="footer-text">SOBER Psychiatric & De-Addiction Center</p>
                    <p class="footer-text">&copy; ${new Date().getFullYear()} All rights reserved.</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;

exports.appointmentRequestTemplate = (details) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Appointment Received</title>
    <style>
        body { margin: 0; padding: 0; background-color: #0f172a; font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #0f172a; padding: 40px 0; }
        .main { background-color: #1e293b; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #f8fafc; border-radius: 32px; overflow: hidden; border: 1px solid #334155; }
        .header { padding: 48px 40px; text-align: left; }
        .logo-text { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; margin: 0; text-transform: uppercase; }
        .logo-text span { color: #38bdf8; font-weight: 300; }
        .content { padding: 0 40px 40px 40px; }
        .title { font-size: 32px; font-weight: 800; color: #ffffff; margin-bottom: 24px; letter-spacing: -0.025em; }
        .description { font-size: 16px; color: #94a3b8; line-height: 1.6; margin-bottom: 32px; }
        .card { background-color: #0f172a; border-radius: 24px; padding: 32px; margin-bottom: 32px; border: 1px solid #334155; }
        .card-row { margin-bottom: 20px; }
        .card-row:last-child { margin-bottom: 0; }
        .card-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px; }
        .card-value { font-size: 18px; font-weight: 700; color: #ffffff; }
        .footer { background-color: #0f172a; padding: 40px; text-align: left; border-top: 1px solid #334155; }
        .footer-text { font-size: 12px; color: #64748b; line-height: 1.8; margin: 0; }
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; background: rgba(234, 88, 12, 0.1); color: #fb923c; border: 1px solid rgba(234, 88, 12, 0.2); }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main" role="presentation">
            <tr>
                <td class="header">
                   <h1 class="logo-text">SOBER <span>CENTER</span></h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <h2 class="title">Request Received</h2>
                    <p class="description">
                        Dear <strong>${details.fullName}</strong>,<br><br>
                        We have received your clinical intake request. Our medical team is currently reviewing your details. You will receive a confirmation once your slot is approved.
                    </p>
                    
                    <div class="card">
                        <div class="card-row">
                            <span class="card-label">Requested Date</span>
                            <span class="card-value">${new Date(details.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div class="card-row">
                            <span class="card-label">Time Preference</span>
                            <span class="card-value">${details.preferredTimeSlot || 'Flexible'}</span>
                        </div>
                        <div class="card-row">
                            <span class="card-label">Current Status</span>
                            <div class="status-badge">PENDING REVIEW</div>
                        </div>
                    </div>

                    <p style="font-size: 14px; color: #64748b; font-weight: 500;">
                        Wait time for clinical review is typically less than 2 hours during operational hours.
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p class="footer-text"><strong>SOBER Psychiatric & De-Addiction Center</strong></p>
                    <p class="footer-text">26, Nehru Nagar, Madurai, TN • Helpline: +91 97510 55190</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;

exports.appointmentAdminNotificationTemplate = (details) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>New Intake Request</title>
    <style>
        body { margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f8fafc; padding: 40px 0; }
        .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #0f172a; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
        .header { background: #0f172a; padding: 32px 40px; text-align: left; }
        .logo-text { color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: -0.025em; margin: 0; text-transform: uppercase; }
        .logo-text span { color: #ef4444; }
        .content { padding: 40px; }
        .title { font-size: 24px; font-weight: 800; color: #0f172a; margin-bottom: 24px; letter-spacing: -0.025em; }
        .card { background-color: #f8fafc; border-radius: 16px; padding: 24px; margin-bottom: 24px; border: 1px solid #e2e8f0; }
        .card-row { margin-bottom: 16px; display: flex; justify-content: space-between; align-items: baseline; }
        .card-row:last-child { margin-bottom: 0; }
        .card-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; width: 120px; }
        .card-value { font-size: 15px; font-weight: 600; color: #0f172a; text-align: right; flex: 1; }
        .footer { background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #f1f5f9; }
        .footer-text { font-size: 12px; color: #94a3b8; margin: 0; }
        .btn { display: inline-block; background-color: #0f172a; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main" role="presentation">
             <tr>
                <td class="header">
                   <h1 class="logo-text">ADMIN <span>ALERT</span></h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <h2 class="title">New Intake Request</h2>
                    
                    <div class="card">
                         <div class="card-row">
                            <span class="card-label">Patient</span>
                            <span class="card-value">${details.fullName}</span>
                        </div>
                        <div class="card-row">
                            <span class="card-label">Contact</span>
                            <span class="card-value">${details.phone}</span>
                        </div>
                         <div class="card-row">
                            <span class="card-label">Schedule Date</span>
                            <span class="card-value">${new Date(details.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                         <div class="card-row">
                            <span class="card-label">Primary Concern</span>
                            <span class="card-value">${details.primaryConcern}</span>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 32px;">
                        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" class="btn">View in Dashboard</a>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p class="footer-text">Institutional Clinical Records System v2.0</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;

exports.appointmentConfirmationTemplate = (details, appointmentId) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consultation Confirmed</title>
    <style>
        body { margin: 0; padding: 0; background-color: #0f172a; font-family: 'Inter', system-ui, -apple-system, sans-serif; -webkit-font-smoothing: antialiased; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #0f172a; padding: 40px 0; }
        .main { background-color: #1e293b; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; color: #f8fafc; border-radius: 32px; overflow: hidden; border: 1px solid #334155; }
        .header { padding: 48px 40px; text-align: left; }
        .logo-text { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; margin: 0; text-transform: uppercase; }
        .logo-text span { color: #38bdf8; font-weight: 300; }
        .content { padding: 0 40px 40px 40px; }
        .status-header { margin-bottom: 32px; }
        .status-title { font-size: 32px; font-weight: 800; color: #10b981; margin: 0; letter-spacing: -0.025em; text-transform: uppercase; }
        .description { font-size: 16px; color: #94a3b8; line-height: 1.6; margin-bottom: 32px; }
        .card { background-color: #0f172a; border-radius: 24px; padding: 32px; margin-bottom: 32px; border: 1px solid #334155; }
        .card-row { margin-bottom: 24px; }
        .card-row:last-child { margin-bottom: 0; }
        .card-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 8px; }
        .card-value { font-size: 18px; font-weight: 700; color: #ffffff; }
        .card-value.primary { color: #38bdf8; font-family: 'Roboto Mono', monospace; }
        .pdf-section { border: 2px dashed #334155; padding: 32px; border-radius: 24px; text-align: center; margin-top: 32px; background: rgba(15, 23, 42, 0.5); }
        .pdf-icon { font-size: 24px; margin-bottom: 12px; display: block; }
        .pdf-title { font-size: 16px; font-weight: 700; color: #ffffff; display: block; margin-bottom: 8px; }
        .pdf-desc { font-size: 14px; color: #94a3b8; line-height: 1.5; }
        .footer { background-color: #0f172a; padding: 40px; text-align: left; border-top: 1px solid #334155; }
        .footer-text { font-size: 12px; color: #64748b; line-height: 1.8; margin: 0; }
        .btn { display: inline-block; background: #ffffff; color: #0f172a; padding: 16px 32px; border-radius: 16px; font-weight: 700; text-decoration: none; margin-top: 24px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
    </style>
</head>
<body>
    <center class="wrapper">
        <table class="main" role="presentation">
            <tr>
                <td class="header">
                   <h1 class="logo-text">SOBER <span>CENTER</span></h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <div class="status-header">
                        <h2 class="status-title">CONSULTATION CONFIRMED</h2>
                    </div>
                    <p class="description">
                        Dear <strong>${details.fullName}</strong>,<br><br>
                        Your clinical intake for the specified psychiatric evaluation has been formally verified and scheduled within our institutional system.
                    </p>
                    
                    <div class="card">
                        <div class="card-row">
                            <span class="card-label">CONSULTATION ID</span>
                            <span class="card-value primary">#${appointmentId}</span>
                        </div>
                        <div class="card-row">
                            <span class="card-label">SCHEDULED DATE</span>
                            <span class="card-value">${new Date(details.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                        <div class="card-row">
                            <span class="card-label">ASSIGNED SLOT</span>
                            <span class="card-value">${details.preferredTimeSlot}</span>
                        </div>
                    </div>

                    <div class="pdf-section">
                        <span class="pdf-title">📎 Official Appointment Slip (PDF)</span>
                        <p class="pdf-desc">Your encrypted digital slip is attached to this email. This document is mandatory for premises entry and clinical intake.</p>
                    </div>

                    <p style="font-size: 14px; color: #64748b; font-weight: 500; margin-top: 32px;">
                        Please arrive exactly <strong>15 minutes</strong> before your assigned slot to complete the pre-intake screening protocols.
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p class="footer-text"><strong>SOBER Psychiatric Centre & Clinical Intake Unit</strong></p>
                    <p class="footer-text">26, Nehru Nagar, Madurai, TN • Helpline: +91 74185 51156</p>
                    <p class="footer-text" style="margin-top: 16px; opacity: 0.5;">© 2026 Institutional Clinical Records. Confidential.</p>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;

exports.appointmentRejectionTemplate = (details) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Appointment Status</title>
    <style>${getBaseStyles()}</style>
</head>
<body>
    <center class="wrapper">
        <table class="main" role="presentation">
            <tr>
                <td class="header" style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);">
                   <h1 class="logo-text">SOBER <span>CENTER</span></h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <h2 class="title" style="color: #991b1b;">Appointment Update</h2>
                    <p class="description">
                        Dear <strong>${details.fullName}</strong>,<br>
                        We regret to inform you that we cannot accommodate your appointment request for ${new Date(details.preferredDate).toDateString()}.
                    </p>
                    
                    <div class="card" style="background-color: #fef2f2; border-color: #fecaca;">
                        <span class="card-label" style="color: #991b1b;">Reason</span>
                        <div style="font-size: 16px; font-weight: 500; color: #7f1d1d; margin-top: 8px;">
                            ${details.rejectionReason}
                        </div>
                    </div>

                     <p class="description">
                        Please contact us to reschedule for a different time.
                    </p>

                    <div class="btn-container">
                        <a href="tel:+919751055190" class="btn" style="background-color: #991b1b;">Call Helpline</a>
                    </div>
                </td>
            </tr>
        </table>
    </center>
</body>
</html>
`;
