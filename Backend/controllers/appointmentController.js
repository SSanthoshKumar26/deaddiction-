const Appointment = require('../models/Appointment');
const sendEmail = require('../utils/sendEmail');
const { generatePdf } = require('../utils/pdfService');
const appointmentSlipTemplate = require('../utils/appointmentSlipTemplate');

const User = require('../models/User');
const {
    appointmentAdminNotificationTemplate,
    appointmentRejectionTemplate
} = require('../utils/emailTemplates');

// @desc    Book a new appointment (Patient)
// @route   POST /api/appointments/book
exports.bookAppointment = async (req, res) => {
    try {
        const patientId = req.user._id;
        const { fullName, phone, email, primaryConcern } = req.body;

        if (!fullName || !phone || !primaryConcern) {
            return res.status(400).json({ success: false, message: 'Please provide essential details' });
        }

        const appointment = await Appointment.create({
            ...req.body,
            patientId,
            status: 'Pending'
        });

        const adminEmailContent = appointmentAdminNotificationTemplate(req.body);

        try {
            await sendEmail({
                email: 'soberhospital.care@gmail.com',
                subject: `New Appointment Request - ${fullName}`,
                html: adminEmailContent
            });
        } catch (emailError) {
            console.error('Failed to send admin notification email', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Appointment request submitted successfully.',
            data: appointment
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

// @desc    Get all appointments (Admin)
exports.getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get my appointments (Patient)
exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: appointments.length, data: appointments });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single appointment details
exports.getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        if (req.user.role !== 'admin' && appointment.patientId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Confirm Appointment (Admin)
// @route   PUT /api/appointments/admin/confirm/:id
exports.confirmAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        if (appointment.status === 'Confirmed') return res.status(400).json({ success: false, message: 'Already confirmed' });

        const year = new Date().getFullYear();
        const startOfYear = new Date(year, 0, 1);
        const endOfYear = new Date(year + 1, 0, 1);
        const count = await Appointment.countDocuments({
            createdAt: { $gte: startOfYear, $lt: endOfYear },
            status: { $in: ['Confirmed', 'Completed'] }
        });

        const sequence = String(count + 1).padStart(6, '0');
        const appointmentId = `SOBER-${year}-${sequence}`;

        appointment.status = 'Confirmed';
        appointment.appointmentId = appointmentId;
        appointment.confirmedBy = req.user._id;
        appointment.confirmedAt = Date.now();
        await appointment.save();

        res.status(200).json({ success: true, data: appointment });

        // Generate PDF and Send Email Asynchronously
        setImmediate(async () => {
            try {
                // 1. Generate Unified Slip HTML
                const slipHtml = appointmentSlipTemplate(appointment, appointmentId);

                // 2. Generate PDF using unified HTML
                console.log(`[Email Service] Generating Official PDF Slip for: ${appointmentId}`);
                const pdfBuffer = await generatePdf(slipHtml, appointmentId);

                if (!pdfBuffer) throw new Error('PDF Generation failed');

                // 3. Premium Branded Email Body
                const premiumEmailHtml = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Inter:wght@400;700&display=swap');
                            body { font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
                            .wrapper { padding: 40px 20px; }
                            .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 32px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05); }
                            .header { background: #0f172a; padding: 40px; text-align: left; }
                            .logo { font-size: 22px; font-weight: 800; color: #ffffff; text-transform: uppercase; letter-spacing: -0.02em; }
                            .body-content { padding: 40px; }
                            .badge { display: inline-block; padding: 6px 14px; background: #e0f2fe; color: #0284c7; border-radius: 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; }
                            h2 { font-size: 32px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; letter-spacing: -0.02em; }
                            .intro-text { font-size: 16px; color: #475569; margin-bottom: 32px; font-weight: 500; }
                            
                            .details-grid { background: #f1f5f9; border-radius: 20px; padding: 30px; margin-bottom: 32px; display: grid; grid-template-columns: 1fr; gap: 20px; }
                            .detail-item { }
                            .label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px; }
                            .value { font-size: 15px; font-weight: 700; color: #0f172a; display: block; }
                            
                            .attachment-section { border: 2px dashed #e2e8f0; padding: 30px; border-radius: 24px; text-align: center; margin-bottom: 32px; }
                            .attachment-icon { font-size: 24px; margin-bottom: 12px; display: block; }
                            .attachment-title { font-size: 14px; font-weight: 800; color: #0f172a; display: block; margin-bottom: 8px; }
                            .attachment-desc { font-size: 13px; color: #64748b; font-weight: 500; }
                            
                            .cta-notice { background: #0284c7; color: #ffffff; border-radius: 16px; padding: 20px; text-align: center; font-size: 14px; font-weight: 700; margin-bottom: 32px; }
                            
                            .footer { background: #f8fafc; padding: 40px; border-top: 1px solid #e2e8f0; text-align: center; }
                            .footer-text { font-size: 12px; color: #94a3b8; font-weight: 600; line-height: 1.8; }
                        </style>
                    </head>
                    <body>
                        <div class="wrapper">
                            <div class="container">
                                <div class="header">
                                    <div class="logo">SOBER CENTRE</div>
                                </div>
                                <div class="body-content">
                                    <div class="badge">Clinical Verification System</div>
                                    <h2>Consultation Confirmed</h2>
                                    <p class="intro-text">Dear <strong>${appointment.fullName}</strong>,<br><br>Your clinical intake for the specified psychiatric evaluation has been formally verified and scheduled within our institutional system.</p>
                                    
                                    <div class="details-grid">
                                        <div class="detail-item">
                                            <span class="label">Consultation ID</span>
                                            <span class="value" style="color: #0284c7;">#${appointmentId}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="label">Scheduled Date</span>
                                            <span class="value">${new Date(appointment.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                        </div>
                                        <div class="detail-item">
                                            <span class="label">Assigned Slot</span>
                                            <span class="value">${appointment.preferredTimeSlot}</span>
                                        </div>
                                    </div>

                                    <div class="attachment-section">
                                        <span class="attachment-title">📎 Official Appointment Slip (PDF)</span>
                                        <p class="attachment-desc">Your encrypted digital slip is attached to this email. This document is mandatory for premises entry and clinical intake.</p>
                                    </div>

                                    <div class="cta-notice">
                                        Mandatory: Please present the digital/printed PDF at the reception.
                                    </div>

                                    <p style="font-size: 14px; color: #475569; font-weight: 500;">Please arrive exactly <strong>15 minutes</strong> before your assigned slot to complete the pre-intake screening protocols.</p>
                                </div>

                                <div class="footer">
                                    <p class="footer-text">
                                        <strong>SOBER Psychiatric Centre & Clinical Intake Unit</strong><br>
                                        26, Nehru Nagar, Madurai, TN • Helpline: +91 74185 51156<br>
                                        © 2026 Institutional Clinical Records
                                    </p>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `;

                // 4. Send Email with PDF Attachment
                const safeName = appointment.fullName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 30);
                await sendEmail({
                    email: appointment.email,
                    subject: `Confirmed: Official Appointment Slip - ${appointmentId}`,
                    html: premiumEmailHtml,
                    attachments: [{
                        name: `${safeName || 'Appointment'}_Slip.pdf`,
                        content: pdfBuffer.toString('base64')
                    }]
                });

                appointment.emailStatus = 'sent';
                await appointment.save();
                console.log(`[Email Service] Success: ${appointmentId}`);

            } catch (error) {
                console.error(`[Email Service] CRITICAL FAILURE for ${appointmentId}:`, error.message);
                try {
                    appointment.emailStatus = 'failed';
                    await appointment.save();
                } catch (saveError) {
                    console.error('[Email Service] Failed to update status:', saveError.message);
                }
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Unified Digital Slip (Web View)
// @route   GET /api/appointments/slip/:id
exports.getAppointmentSlip = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).send('Appointment not found');

        // Generate the same HTML used for PDF
        const html = appointmentSlipTemplate(appointment, appointment.appointmentId || 'PENDING');
        res.set('Content-Type', 'text/html');
        res.send(html);
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// @desc    Reject Appointment (Admin)
exports.rejectAppointment = async (req, res) => {
    try {
        const { rejectionReason } = req.body;
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

        appointment.status = 'Rejected';
        appointment.rejectionReason = rejectionReason || 'Schedule conflict';
        appointment.confirmedBy = req.user._id;
        await appointment.save();

        const emailMessage = appointmentRejectionTemplate(appointment);
        try {
            await sendEmail({
                email: appointment.email,
                subject: 'Update on your Appointment Request - SOBER Psychiatric Center',
                html: emailMessage
            });
        } catch (emailError) {
            console.error('Failed to send rejection email', emailError);
        }

        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Delete Appointment (Admin)
exports.deleteAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        await appointment.deleteOne();
        res.status(200).json({ success: true, message: 'Appointment removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Verify Appointment (Public)
exports.getAppointmentPublic = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .select('appointmentId fullName gender dateOfBirth age phone email primaryConcern preferredDoctor preferredDate preferredTimeSlot status checkedIn patientId govtId occupation address durationOfIssue substanceUse previousTreatment currentMedications familyPsychiatricHistory emergencyContact');
        if (!appointment) return res.status(404).json({ success: false, message: 'Invalid Ref' });
        res.status(200).json({ success: true, data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Check-in patient (QR Scan)
exports.checkInAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        if (appointment.status !== 'Confirmed') return res.status(400).json({ success: false, message: 'Only confirmed appointments' });
        appointment.checkedIn = true;
        appointment.checkedInAt = Date.now();
        await appointment.save();
        res.status(200).json({ success: true, message: 'Checked-in', data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Mark as No-show (Admin)
exports.markNoShow = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        appointment.status = 'No-show';
        await appointment.save();
        res.status(200).json({ success: true, message: 'Marked No-show', data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Set back to Pending (Admin)
exports.pendingAppointment = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });
        appointment.status = 'Pending';
        appointment.confirmedBy = undefined;
        appointment.confirmedAt = undefined;
        appointment.appointmentId = undefined;
        await appointment.save();
        res.status(200).json({ success: true, message: 'Reverted to Pending', data: appointment });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
