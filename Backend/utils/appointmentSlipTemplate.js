/**
 * Appointment Slip Template - Premium Institutional Architecture
 * Optimized for High-Resolution Single-Page PDF Production
 */
const appointmentSlipTemplate = (appointment, appointmentId) => {
    // Format dates
    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const bookingDate = formatDate(appointment.createdAt);
    const appointmentDate = formatDate(appointment.preferredDate);

    // Format Address
    let formattedAddress = appointment.address || 'Not Provided';
    if (typeof formattedAddress === 'object') {
        formattedAddress = `${formattedAddress.street || ''}, ${formattedAddress.city || ''}, ${formattedAddress.state || ''} - ${formattedAddress.pincode || ''}`.replace(/^, |, $/g, '');
    } else if (typeof formattedAddress === 'string' && formattedAddress.startsWith('{')) {
        try {
            const addrObj = JSON.parse(formattedAddress.replace(/'/g, '"'));
            formattedAddress = `${addrObj.street || ''}, ${addrObj.city || ''}, ${addrObj.state || ''} - ${addrObj.pincode || ''}`.replace(/^, |, $/g, '');
        } catch (e) { }
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Official Record - ${appointmentId}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        :root {
            --slate-900: #0f172a;
            --slate-600: #475569;
            --slate-400: #94a3b8;
            --slate-200: #e2e8f0;
            --slate-100: #f1f5f9;
            --emerald-600: #059669;
            --blue-600: #2563eb;
        }

        body {
            font-family: 'Inter', -apple-system, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #fff;
            color: var(--slate-900);
            -webkit-print-color-adjust: exact;
        }

        .slip-outer {
            width: 210mm;
            height: 297mm;
            padding: 20mm;
            margin: auto;
            box-sizing: border-box;
            background: #fff;
            overflow: hidden; /* Ensure single page */
        }

        .institutional-frame {
            border: 1px solid var(--slate-200);
            padding: 40px;
            height: 100%;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            position: relative;
            background: #ffffff;
        }

        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 40px;
            border-bottom: 2px solid var(--slate-900);
            margin-bottom: 50px;
        }

        .hospital-branding h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: -0.02em;
            color: var(--slate-900);
        }

        .hospital-branding p {
            margin: 8px 0 0;
            font-size: 11px;
            font-weight: 700;
            color: var(--slate-400);
            letter-spacing: 0.25em;
            text-transform: uppercase;
        }

        .document-identity {
            text-align: right;
        }

        .document-identity h2 {
            margin: 0;
            font-size: 10px;
            font-weight: 800;
            color: var(--slate-400);
            text-transform: uppercase;
            letter-spacing: 0.2em;
        }

        .id-badge {
            font-size: 22px;
            font-weight: 800;
            color: var(--slate-900);
            margin-top: 8px;
        }

        .status-pill {
            display: inline-block;
            margin-top: 12px;
            font-size: 9px;
            font-weight: 900;
            background: #dcfce7;
            color: #166534;
            padding: 4px 12px;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        /* Essential Details Grid */
        .essential-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
            margin-bottom: 50px;
            background: var(--slate-100);
            padding: 30px;
            border-radius: 12px;
        }

        .essential-item span {
            display: block;
            font-size: 9px;
            font-weight: 800;
            color: var(--slate-400);
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 8px;
        }

        .essential-item strong {
            font-size: 15px;
            font-weight: 700;
            color: var(--slate-900);
        }

        /* Main Information Split */
        .main-info {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 60px;
            margin-bottom: 100px;
        }

        .section-title {
            font-size: 11px;
            font-weight: 800;
            color: var(--slate-900);
            text-transform: uppercase;
            letter-spacing: 0.2em;
            border-bottom: 1px solid var(--slate-200);
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .info-row {
            display: flex;
            margin-bottom: 15px;
            align-items: baseline;
        }

        .info-label {
            flex: 0 0 130px;
            font-size: 12px;
            font-weight: 600;
            color: var(--slate-400);
        }

        .info-value {
            flex: 1;
            font-size: 13px;
            font-weight: 700;
            color: var(--slate-900);
        }

        /* Protocol Footer Area */
        .page-footer {
            margin-top: auto;
        }

        .protocol-box {
            background: #fff;
            border: 1px dashed var(--slate-200);
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 40px;
        }

        .protocol-title {
            font-size: 10px;
            font-weight: 800;
            color: var(--slate-900);
            text-transform: uppercase;
            letter-spacing: 0.15em;
            margin-bottom: 20px;
        }

        .protocol-list {
            margin: 0;
            padding: 0;
            list-style: none;
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 40px;
            row-gap: 12px;
        }

        .protocol-list li {
            font-size: 11px;
            color: var(--slate-600);
            line-height: 1.6;
            padding-left: 15px;
            position: relative;
        }

        .protocol-list li::before {
            content: "";
            position: absolute;
            left: 0;
            top: 7px;
            width: 4px;
            height: 4px;
            background: var(--slate-900);
            border-radius: 50%;
        }

        .signature-area {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding-top: 30px;
        }

        .signature-box {
            width: 200px;
            text-align: center;
        }

        .signature-line {
            border-top: 1px solid var(--slate-900);
            padding-top: 10px;
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .emergency-bar {
            background: var(--slate-900);
            color: #fff;
            padding: 15px;
            text-align: center;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            margin: 40px -40px -40px;
        }

        @media print {
            .slip-outer { padding: 0; width: 210mm; height: 297mm; }
            body { background: #fff; }
        }
    </style>
</head>
<body>
    <div class="slip-outer">
        <div class="institutional-frame">
            <div class="header">
                <div class="hospital-branding">
                    <h1>SOBER Psychiatric Centre</h1>
                    <p>Clinical Recovery & Psychiatric Unit</p>
                </div>
                <div class="document-identity">
                    <h2>Professional Consultation Slip</h2>
                    <div class="id-badge">${appointmentId}</div>
                    <div class="status-pill">AUTHENTICATED</div>
                </div>
            </div>

            <div class="essential-grid">
                <div class="essential-item">
                    <span>In-Person Date</span>
                    <strong>${appointmentDate}</strong>
                </div>
                <div class="essential-item">
                    <span>Timing Window</span>
                    <strong>${appointment.preferredTimeSlot || 'Allocated'}</strong>
                </div>
                <div class="essential-item">
                    <span>Medical Unit</span>
                    <strong>Main Administration 04</strong>
                </div>
            </div>

            <div class="main-info">
                <div class="info-section">
                    <div class="section-title">01 / Patient Information</div>
                    <div class="info-row">
                        <div class="info-label">Legal Name</div>
                        <div class="info-value">${appointment.fullName}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Age / Gender</div>
                        <div class="info-value">${appointment.age} Yrs / ${appointment.gender}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Contact No</div>
                        <div class="info-value">${appointment.phone}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Security ID</div>
                        <div class="info-value">${appointment.govtId || 'Verified at Entry'}</div>
                    </div>
                </div>

                <div class="info-section">
                    <div class="section-title">02 / Clinical Context</div>
                    <div class="info-row">
                        <div class="info-label">Primary Concern</div>
                        <div class="info-value" style="text-transform: uppercase;">${appointment.primaryConcern}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Assigned Specialist</div>
                        <div class="info-value">${appointment.preferredDoctor || 'Clinical Specialist'}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Recorded On</div>
                        <div class="info-value">${bookingDate}</div>
                    </div>
                </div>
            </div>

            <div class="page-footer">
                <div class="protocol-box">
                    <div class="protocol-title">Institutional Entry Directives</div>
                    <ul class="protocol-list">
                        <li>Report exactly 15 minutes before the allocated window.</li>
                        <li>Digital slip validation required at the security hub.</li>
                        <li>One authorized companion allowed per patient.</li>
                        <li>Silence is strictly maintained across clinical wings.</li>
                        <li>Follow residential safety protocols upon entry.</li>
                        <li>Reschedule requests must be submitted 24h prior.</li>
                    </ul>
                </div>

                <div class="signature-area">
                    <div class="signature-box" style="text-align: left;">
                        <div style="font-weight: 900; color: var(--emerald-600); font-size: 11px; margin-bottom: 30px;">[ ELECTRONICALLY VERIFIED ]</div>
                        <div class="signature-line">Digital Registrar Authorization</div>
                    </div>
                    <div class="signature-box">
                        <div style="height: 40px;"></div>
                        <div class="signature-line">Patient / Authorized Guardian</div>
                    </div>
                </div>

                <div class="emergency-bar">
                    24/7 Clinical Emergency Line: +91 74185 51156 • SOBERCENTER.COM
                </div>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

module.exports = appointmentSlipTemplate;
