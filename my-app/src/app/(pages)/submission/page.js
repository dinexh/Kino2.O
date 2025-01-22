'use client';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './page.css';

export default function SubmissionPage() {
    const [event, setEvent] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [youtubeLink, setYoutubeLink] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const submissionData = {
            name,
            email,
            phone,
            event,
            youtubeLink: event === 'short-film' ? youtubeLink : null,
        };

        const response = await fetch('/api/submission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(submissionData),
        });

        if (response.ok) {
            toast.success('Submission saved successfully');
        } else {
            toast.error('Failed to save submission');
        }
    };

    return (
        <div className="submission-page">
            <ToastContainer />
            <div className="submission-page-in">
                <div className="submission-page-in-heading">
                    <h1>Congratulations! Your payment has been successful.</h1>
                    <p>Please upload your submission here for the short film and other events.</p>
                </div>
                <div className="submission-page-in-form">
                    <form onSubmit={handleSubmit}>
                        <div className="submission-form">
                            <label htmlFor="name">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                            />
                        </div>
                        <div className="submission-form">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div className="submission-form">
                            <label htmlFor="phone">Phone</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                            />
                        </div>
                        <div className="submission-form">
                            <label htmlFor="event">Event</label>
                            <select 
                                id="event" 
                                value={event} 
                                onChange={(e) => setEvent(e.target.value)}
                            >
                                <option value="">Select Event</option>
                                <option value="short-film">Short Film</option>
                                <option value="photography">Photography</option>
                                <option value="short-film-review">Reel making Contest</option>
                                <option value="other">Attendee</option>
                            </select>
                            {event === "short-film" && (
                                <>
                                    <div className="submission-form-instructions">
                                        <p className="instruction-text">
                                            Please upload your short film to YouTube and provide the link below. 
                                            Make sure your video is either public or unlisted.
                                        </p>
                                    </div>
                                    <div className="submission-form">
                                        <label htmlFor="youtube-link">YouTube Link</label>
                                        <input 
                                            type="url" 
                                            id="youtube-link" 
                                            placeholder="https://www.youtube.com/watch?v=..." 
                                            value={youtubeLink} 
                                            onChange={(e) => setYoutubeLink(e.target.value)} 
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="submission-form-button">
                            <button type="submit">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}