const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    appointmentId: {
        type: String,
        unique: true,
        sparse: true // Allow null initially if generated on confirmation
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for now if allowing guest bookings or if auth not fully strictly enforced
    },
    // Step 1: Identity
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    age: { type: Number },
    bloodGroup: { type: String },
    height: { type: String },
    weight: { type: String },
    govtId: { type: String },
    maritalStatus: { type: String },
    occupation: { type: String },
    education: { type: String },

    // Step 2: Contact
    phone: { type: String, required: true },
    secondaryPhone: { type: String },
    whatsapp: { type: String },
    email: { type: String, required: true },
    address: {
        street: String,
        city: String,
        state: String,
        pincode: String
    },

    // Step 3: Emergency & Family
    fatherName: String,
    motherName: String,
    spouseName: String,
    guardianName: String,
    guardianPhone: String,
    emergencyContact: {
        name: String,
        phone: String
    },
    familyMembersCount: Number,
    familyMedicalHistory: String,
    familyPsychiatricHistory: String,

    // Step 4: Clinical
    primaryConcern: { type: String, required: true },
    durationOfIssue: String,
    previousTreatment: String,
    currentMedications: String,
    allergies: String,
    suicidalThoughts: String,
    selfHarmHistory: String,
    substanceUse: {
        type: { type: String }, // Alcohol, Drugs, etc.
        frequency: String,
        lastConsumption: Date
    },
    smokingHabit: String,
    medicalConditions: String,
    insuranceDetails: String,

    // Step 5: Preferences
    preferredDoctor: String,
    preferredDate: Date,
    preferredTimeSlot: String,
    appointmentType: { type: String, enum: ['General Consultation', 'Follow-up Visit', 'Diagnostic Review', 'Consultation', 'OP', 'IP'], default: 'Consultation' },
    mode: { type: String, enum: ['In-Person', 'Online'], default: 'In-Person' },

    // System Fields
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled', 'No-show'],
        default: 'Pending'
    },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: Date,
    confirmedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    confirmedAt: Date,
    rejectionReason: String,
    notes: String,
    emailStatus: {
        type: String,
        enum: ['pending', 'sent', 'failed'],
        default: 'pending'
    }

}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
