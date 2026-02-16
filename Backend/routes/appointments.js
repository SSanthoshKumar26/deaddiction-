const express = require('express');
const router = express.Router();
const {
    bookAppointment,
    getAllAppointments,
    getMyAppointments,
    getAppointmentById,
    confirmAppointment,
    rejectAppointment,
    deleteAppointment,
    getAppointmentPublic,
    getAppointmentSlip,
    checkInAppointment,
    markNoShow,
    pendingAppointment
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public/Patient Routes (Protected by Login)
router.post('/book', protect, bookAppointment);
router.get('/my', protect, getMyAppointments);

// Shared Routes (Admin & Patient Owner)
router.get('/:id', protect, getAppointmentById);

// Admin Routes
router.get('/admin/all', protect, admin, getAllAppointments);
router.put('/admin/confirm/:id', protect, admin, confirmAppointment);
router.put('/admin/reject/:id', protect, admin, rejectAppointment);
router.put('/admin/noshow/:id', protect, admin, markNoShow);
router.put('/admin/pending/:id', protect, admin, pendingAppointment);
router.delete('/admin/:id', protect, admin, deleteAppointment);

// Public Routes (No Login Required)
router.get('/verify/:id', getAppointmentPublic);
router.get('/slip/:id', getAppointmentSlip);
router.put('/checkin/:id', checkInAppointment);

module.exports = router;
