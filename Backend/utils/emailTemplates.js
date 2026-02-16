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
                    <h2 class="title" style="color: #0f172a;">Request Received</h2>
                    <p class="description">
                        Dear <strong>${details.fullName}</strong>,<br>
                        We have received your appointment request. Our team will review shortly and confirm your slot.
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
                            <span class="card-label">Doctor</span>
                            <span class="card-value">${details.preferredDoctor || 'Specialist'}</span>
                        </div>
                         <div class="card-row">
                            <span class="card-label">Status</span>
                            <span class="card-value" style="color: #ea580c;">Pending Review</span>
                        </div>
                    </div>

                     <p class="description" style="font-size: 14px;">
                        We appreciate your trust in us. You will receive a confirmation email once your appointment is approved.
                    </p>
                </td>
            </tr>
            <tr>
                <td class="footer">
                    <p class="footer-text">Questions? Call +91 97510 55190</p>
                    <p class="footer-text">SOBER Psychiatric & De-Addiction Center</p>
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
    <title>New Appointment</title>
    <style>${getBaseStyles()}</style>
</head>
<body>
    <center class="wrapper">
        <table class="main" role="presentation">
             <tr>
                <td class="header" style="background: #0f172a;">
                   <h1 class="logo-text">ADMIN <span>ALERT</span></h1>
                </td>
            </tr>
            <tr>
                <td class="content">
                    <h2 class="title">New Intake Request</h2>
                    
                    <div class="card">
                         <div class="card-row">
                            <span class="card-label">Patient Name</span>
                            <span class="card-value">${details.fullName}</span>
                        </div>
                        <div class="card-row">
                            <span class="card-label">Contact</span>
                            <span class="card-value">${details.phone}</span>
                        </div>
                         <div class="card-row">
                            <span class="card-label">Date</span>
                            <span class="card-value">${new Date(details.preferredDate).toLocaleDateString()}</span>
                        </div>
                         <div class="card-row">
                            <span class="card-label">Concern</span>
                            <span class="card-value" style="font-weight: 500;">${details.primaryConcern}</span>
                        </div>
                    </div>

                    <div class="btn-container">
                        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/login" class="btn">Process in Dashboard</a>
                    </div>
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
    <title>Digital Appointment Slip</title>
    <style>${getBaseStyles()}</style>
</head>
<body style="background-color: #f1f5f9;">
    <center class="wrapper">
        <table class="main" role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
            <!-- Medical Header -->
            <tr>
                <td class="header" style="background-color: #0f172a; padding: 40px 30px; text-align: left; border-bottom: 4px solid #3b82f6;">
                   <h1 class="logo-text" style="font-size: 24px; margin-bottom: 8px;">SOBER <span style="font-weight: 300; opacity: 0.9;">PSYCHIATRIC CENTER</span></h1>
                   <p style="margin: 0; color: #94a3b8; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Excellence in Mental Health & De-Addiction</p>
                </td>
            </tr>
            
            <!-- Slip Body -->
            <tr>
                <td class="content" style="padding: 40px 30px;">
                    <div style="border-left: 4px solid #10b981; padding-left: 20px; margin-bottom: 30px;">
                        <h2 class="title" style="text-align: left; margin-bottom: 4px; color: #0f172a;">Appointment Confirmed</h2>
                        <p style="margin: 0; color: #10b981; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">Digital Entry Pass Generated</p>
                    </div>

                    <p class="description" style="text-align: left; color: #334155;">
                        Dear <strong>${details.fullName}</strong>,<br>
                        This email serves as your official digital appointment slip. Please present this at the reception desk upon arrival.
                    </p>
                    
                    <!-- Digital Slip Container -->
                    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; margin-top: 25px;">
                        
                        <!-- Reference ID -->
                        <div style="background-color: #e2e8f0; padding: 15px 25px; border-bottom: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.1em;">Reference ID</span>
                            <span style="font-family: monospace; font-size: 16px; font-weight: 700; color: #0f172a; letter-spacing: 0.05em;">${appointmentId}</span>
                        </div>

                        <div style="padding: 25px;">
                            <!-- Patient Details Section -->
                            <div style="margin-bottom: 25px;">
                                <h3 style="font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Patient Information</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #64748b; font-size: 13px; font-weight: 500; width: 40%;">Full Name</td>
                                        <td style="padding: 5px 0; color: #0f172a; font-size: 13px; font-weight: 600; text-align: right;">${details.fullName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #64748b; font-size: 13px; font-weight: 500;">Phone</td>
                                        <td style="padding: 5px 0; color: #0f172a; font-size: 13px; font-weight: 600; text-align: right;">${details.phone}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #64748b; font-size: 13px; font-weight: 500;">Email</td>
                                        <td style="padding: 5px 0; color: #0f172a; font-size: 13px; font-weight: 600; text-align: right;">${details.email}</td>
                                    </tr>
                                </table>
                            </div>

                            <!-- Appointment Details Section -->
                            <div>
                                <h3 style="font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;">Clinical Details</h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #64748b; font-size: 13px; font-weight: 500; width: 40%;">Attending Specialist</td>
                                        <td style="padding: 5px 0; color: #0f172a; font-size: 13px; font-weight: 600; text-align: right;">${details.preferredDoctor || 'Assigned on Arrival'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #64748b; font-size: 13px; font-weight: 500;">Date</td>
                                        <td style="padding: 5px 0; color: #0f172a; font-size: 13px; font-weight: 600; text-align: right;">${new Date(details.preferredDate).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #64748b; font-size: 13px; font-weight: 500;">Time Slot</td>
                                        <td style="padding: 5px 0; color: #0f172a; font-size: 13px; font-weight: 600; text-align: right;">${details.preferredTimeSlot || 'Standard Slot'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #64748b; font-size: 13px; font-weight: 500;">Clinic Location</td>
                                        <td style="padding: 5px 0; color: #0f172a; font-size: 13px; font-weight: 600; text-align: right;">26, Nehru Nagar, Madurai</td>
                                    </tr>
                                </table>
                            </div>
                        </div>
                    </div>

                     <!-- Instructions -->
                    <div style="background-color: #fff1f2; padding: 15px; border-radius: 8px; margin-top: 25px; border: 1px solid #fecdd3;">
                        <p style="margin: 0; color: #9f1239; font-size: 12px; line-height: 1.5;">
                            <strong>Important:</strong> Please arrive 15 minutes prior to your scheduled time. Bring a valid government ID for verification.
                        </p>
                    </div>

                    <div class="btn-container" style="margin-top: 35px;">
                        <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/appointment/confirmation/${details._id}" class="btn" style="background-color: #0f172a; padding: 16px 32px; font-size: 14px; letter-spacing: 0.1em; width: 100%; box-sizing: border-box; text-align: center; display: block;">DOWNLOAD PDF SLIP</a>
                    </div>
                </td>
            </tr>
             <tr>
                <td class="footer" style="background-color: #1e293b; color: #94a3b8; border-top: none;">
                    <p class="footer-text" style="color: #64748b;">This is an automated message. Please do not reply directly.</p>
                    <p class="footer-text" style="color: #64748b;">&copy; ${new Date().getFullYear()} SOBER Psychiatric Center. Confidential.</p>
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
