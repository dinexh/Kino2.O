'use client';
import { useState } from 'react';
import './page.css';

export default function SubmissionPage() {
    const [event, setEvent] = useState('');

    return (
        <div className="submission-page">
            <div className="submission-page-in">
                <div className="submission-page-in-heading">
                    <h1>Congratulations! Your payment has been successful.</h1>
                    <p>Please upload your submission here for the short film and other events.</p>
                </div>
                <div className="submission-page-in-form">
                    <div className="submission-form">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" />
                    </div>
                    <div className="submission-form">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" />
                    </div>
                    <div className="submission-form">
                        <label htmlFor="phone">Phone</label>
                        <input type="tel" id="phone" />
                    </div>
                    <div className="submission-form">
                        <label htmlFor="event">Event</label>
                        <select id="event" value={event} onChange={(e) => setEvent(e.target.value)}>
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
                                    />
                                </div>
                            </>
                        )}
                        <div className="submission-form-button">
                            <button>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}