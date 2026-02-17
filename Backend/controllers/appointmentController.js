const Appointment = require('../models/Appointment');
const sendEmail = require('../utils/sendEmail');
const { generatePdf } = require('../utils/pdfService');
const appointmentSlipTemplate = require('../utils/appointmentSlipTemplate');

const User = require('../models/User');
const {
    appointmentAdminNotificationTemplate,
    appointmentRejectionTemplate,
    appointmentConfirmationTemplate,
    appointmentRequestTemplate
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
        const patientEmailContent = appointmentRequestTemplate(req.body);

        try {
            // Send to Admin
            await sendEmail({
                email: 'soberhospital.care@gmail.com',
                subject: `New Appointment Request - ${fullName}`,
                html: adminEmailContent
            });

            // Send to Patient
            await sendEmail({
                email: email,
                subject: `Request Received: Clinical Intake - SOBER CENTER`,
                html: patientEmailContent
            });
        } catch (emailError) {
            console.error('Failed to send notification emails', emailError);
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
                const premiumEmailHtml = appointmentConfirmationTemplate(appointment, appointmentId);

                // 4. Send Email with PDF Attachment
                const safeName = appointment.fullName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 30);
                await sendEmail({
                    email: appointment.email,
                    subject: `Confirmed: Official Appointment Slip - ${appointmentId}`,
                    html: premiumEmailHtml,
                    attachments: [{
                        name: `${safeName || 'Appointment'}_Slip.pdf`,
                        content: Buffer.from(pdfBuffer).toString('base64')
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
