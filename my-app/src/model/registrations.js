import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    profession: {
        type: String,
        required: true,
        enum: ['student', 'working']
    },
    idType: {
        type: String,
        required: function() {
            return this.profession === 'working';
        },
        enum: ['aadhar', 'voter', 'pan', 'passport']
    },
    idNumber: {
        type: String,
        trim: true,
        required: true
    },
    college: {
        type: String,
        required: function() {
            return this.profession === 'student';
        },
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    referralName: {
        type: String,
        trim: true,
        default: null
    },
    selectedEvents: [{
        type: String,
        enum: ['Photography Contest', 'Short Film Contest', 'Reel Making Contest', 'Attend Festival'],
        required: true
    }],
    registrationDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending_verification', 'verified', 'failed'],
        default: 'pending_verification'
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    paymentDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Google Pay', 'PhonePe', 'Paytm', 'Other']
    },
    otherPaymentMethod: {
        type: String,
        required: function() {
            return this.paymentMethod === 'Other';
        },
        trim: true
    }
});

// Create the model only if it hasn't been created before
const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

export default Registration;
