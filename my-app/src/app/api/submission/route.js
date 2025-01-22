import connectDB from '../../../config/db';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, phone, event, youtubeLink } = req.body;

        if (!name || !email || !phone || !event) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        try {
            const { db } = await connectDB();
            const collection = db.collection('submissions');

            const submission = {
                name,
                email,
                phone,
                event,
                youtubeLink: event === 'short-film' ? youtubeLink : null,
                createdAt: new Date(),
            };

            await collection.insertOne(submission);

            return res.status(201).json({ message: 'Submission saved successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ message: 'Method not allowed' });
    }
}
