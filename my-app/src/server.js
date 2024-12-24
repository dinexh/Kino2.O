import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import Registration from './model/registrations.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// Get all registrations
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find({});
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new registration
app.post('/api/registrations', async (req, res) => {
    try {
        const registration = new Registration(req.body);
        const savedRegistration = await registration.save();
        res.status(201).json(savedRegistration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get registration by ID
app.get('/api/registrations/:id', async (req, res) => {
    try {
        const registration = await Registration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        res.json(registration);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update payment status
app.patch('/api/registrations/:id/payment', async (req, res) => {
    try {
        const registration = await Registration.findByIdAndUpdate(
            req.params.id,
            { 
                paymentStatus: req.body.paymentStatus,
                paymentDate: req.body.paymentDate || Date.now()
            },
            { new: true }
        );
        if (!registration) {
            return res.status(404).json({ message: 'Registration not found' });
        }
        res.json(registration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 