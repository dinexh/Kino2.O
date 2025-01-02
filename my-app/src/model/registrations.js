import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  Sno: {
    type: Number,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  college: {
    type: String,
    trim: true,
    default: null,
  },
  profession: {
    type: String,
    required: true,
    enum: ['student', 'working'],
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true,
  },
  referralName: {
    type: String,
    trim: true,
    default: null,
  },
  selectedEvents: [{
    type: String,
    enum: [
      'Photography Contest',
      'Short Film Contest',
      'Reel Making Contest',
      'Attend Festival',
    ],
    required: true,
  }],
  registrationDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending_verification', 'verified', 'failed'],
    default: 'pending_verification',
  },
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  paymentDate: {
    type: Date,
    required: false,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Google Pay', 'PhonePe', 'Paytm', 'Other'],
  },
  otherPaymentMethod: {
    type: String,
    required: function() {
      return this.paymentMethod === 'Other';
    },
    trim: true,
  },
  idNumber: {
    type: String,
    required: true,
    trim: true,
  },
  idType: {
    type: String,
    enum: ['aadhar', 'voter', 'pan', 'passport'],
    required: function() {
      return this.profession === 'working';
    },
  },
});

// Add pre-save hook to automatically assign Sno
registrationSchema.pre('save', async function(next) {
  try {
    if (this.isNew) {
      // Find the highest Sno
      const highestRecord = await this.constructor.findOne({}, { Sno: 1 })
        .sort({ Sno: -1 })
        .lean();
      
      // Assign next Sno (if no records exist, start from 1)
      this.Sno = highestRecord ? highestRecord.Sno + 1 : 1;
    }
  } catch (error) {
    return next(error);
  }
});

// Delete existing model if it exists
if (mongoose.models.Registration) {
  delete mongoose.models.Registration;
}

// Create a new model instance
const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
