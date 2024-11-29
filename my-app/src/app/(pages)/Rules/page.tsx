"use client";
import './rules.css';
import React from 'react';
import Footer from '../../components/Footer/Footer';
import { useState, useEffect } from 'react';
import { FaArrowUp, FaHome } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const Rules = () => {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const goToHome = () => {
        router.push('/');
    };

    const filterButtons = [
        { id: "all", label: "All Rules" },
        { id: "short-film-contest", label: "Short Film" },
        { id: "photography-contest", label: "Photography" },
        { id: "reel-making-contest", label: "Reel Making" },
        { id: "movie-poster-design", label: "Poster Design" },
        { id: "cine-quiz", label: "Cine Quiz" }
    ];

    const renderContent = () => {
        const shortFilmCard = (
            <div className="rule-card">
                <div className="rule-card-heading">
                    <h2>Short Film Contest Rules and Regulations</h2>
                </div>
                <div className="rule-card-content">
                    <div className="rule-section">
                        <h3>Eligibility</h3>
                        <ul>
                            <li>Open to all aspiring filmmakers.</li>
                            <li>The short film must be original and not have been submitted to any prior competitions.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Submission Guidelines</h3>
                        <ul>
                            <li>Films must be submitted 20 days before the event via the Chitramela portal.</li>
                            <li>Duration of the short film should be between 5 to 15 minutes.</li>
                            <li>Films can be in any language, but non-English or non-Hindi films must include English subtitles.</li>
                            <li>Plagiarism will lead to disqualification.</li>
                            <li>All cast members should attend the event.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Judging & Evaluation</h3>
                        <div className="evaluation-phase">
                            <h4>Round 1: Initial Shortlisting</h4>
                            <ul>
                                <li>100 short films will be selected from the total submissions by the Chitramela team.</li>
                            </ul>
                        </div>
                        <div className="evaluation-phase">
                            <h4>Online Promotion</h4>
                            <ul>
                                <li>The shortlisted films will be uploaded to the Chitramela YouTube channel.</li>
                                <li>Creators are encouraged to promote their films to gather likes and views.</li>
                                <li>50% of the final score will be based on likes and views.</li>
                            </ul>
                        </div>
                        <div className="evaluation-phase">
                            <h4>Final Round</h4>
                            <ul>
                                <li>The jury will select 5 short films for the final screening.</li>
                                <li>The top 3 winners will be announced by the Chief Guest during the final day.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );

        const photographyCard = (
            <div className="rule-card">
                <div className="rule-card-heading">
                    <h2>Photography Contest Rules and Regulations</h2>
                </div>
                <div className="rule-card-content">
                    <div className="rule-section">
                        <h3>Eligibility</h3>
                        <ul>
                            <li>Open to photographers of all skill levels.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Theme & Location</h3>
                        <ul>
                            <li>The theme will be announced on the day of the contest.</li>
                            <li>Participants will be taken to a relevant location for their photography session.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Judging Criteria</h3>
                        <ul>
                            <li>Creativity and originality</li>
                            <li>Quality and technique</li>
                            <li>Relevance to the theme</li>
                        </ul>
                    </div>
                </div>
            </div>
        );

        const reelMakingCard = (
            <div className="rule-card">
                <div className="rule-card-heading">
                    <h2>Reel Making Contest Rules and Regulations</h2>
                </div>
                <div className="rule-card-content">
                    <div className="rule-section">
                        <h3>Eligibility</h3>
                        <ul>
                            <li>Open to all participants.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Submission Guidelines</h3>
                        <ul>
                            <li>Participants must upload their reels to the designated Instagram page provided by the Chitramela team.</li>
                            <li>Reels must not exceed 60 seconds.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Promotion & Judging</h3>
                        <ul>
                            <li>Participants can promote their reels to gather likes and shares, which will contribute to 50% of the final score.</li>
                            <li>The remaining 50% of the score will be determined by the jury based on:</li>
                            <li>Creativity and storytelling</li>
                            <li>Technical skills</li>
                            <li>Audience engagement and relevance</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Content Guidelines</h3>
                        <ul>
                            <li>All content must be original, and participants must avoid offensive or inappropriate material.</li>
                        </ul>
                    </div>
                </div>
            </div>
        );

        const posterDesignCard = (
            <div className="rule-card">
                <div className="rule-card-heading">
                    <h2>Movie Poster Design Contest Rules and Regulations</h2>
                </div>
                <div className="rule-card-content">
                    <div className="rule-section">
                        <h3>Eligibility</h3>
                        <ul>
                            <li>Open to all graphic designers and artists.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Theme & Time Limit</h3>
                        <ul>
                            <li>The theme will be provided at the start of the event.</li>
                            <li>Participants will have 2 hours to create their poster.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Submission Guidelines</h3>
                        <ul>
                            <li>Posters must be submitted through the link provided by the Chitramela team before the time limit expires.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Judging Criteria</h3>
                        <ul>
                            <li>Creativity and aesthetic appeal</li>
                            <li>Originality and relevance to the theme</li>
                        </ul>
                    </div>
                </div>
            </div>
        );

        const cineQuizCard = (
            <div className="rule-card">
                <div className="rule-card-heading">
                    <h2>Cine Quiz: Rules and Regulations</h2>
                </div>
                <div className="rule-card-content">
                    <div className="rule-section">
                        <h3>Eligibility</h3>
                        <ul>
                            <li>The quiz is open to all registered participants of the Chitramela event.</li>
                            <li>Each participant must have a valid registration to compete in the quiz.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Format</h3>
                        <ul>
                            <li>The quiz will be conducted online through a designated website.</li>
                            <li>All participants must have access to a computer or device with internet connectivity.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Rounds</h3>
                        <ul>
                            <li>Round 1: 50 questions with a 30-second time limit per question.</li>
                            <li>Round 2: 10 questions with a 30-second time limit per question.</li>
                            <li>Only the top 10 participants from Round 1 will qualify for Round 2.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Technical Guidelines</h3>
                        <ul>
                            <li>Participants are responsible for ensuring a stable internet connection.</li>
                            <li>Any technical issues faced during the quiz will not be the responsibility of the organizing team.</li>
                        </ul>
                    </div>

                    <div className="rule-section">
                        <h3>Code of Conduct</h3>
                        <ul>
                            <li>Cheating or use of unfair means will lead to immediate disqualification.</li>
                            <li>Participants must not collaborate with others during the quiz.</li>
                        </ul>
                    </div>
                </div>
            </div>
        );

        switch(selectedCategory) {
            case 'short-film-contest':
                return shortFilmCard;
            case 'photography-contest':
                return photographyCard;
            case 'reel-making-contest':
                return reelMakingCard;
            case 'movie-poster-design':
                return posterDesignCard;
            case 'cine-quiz':
                return cineQuizCard;
            default:
                return (
                    <>
                        {shortFilmCard}
                        {photographyCard}
                        {reelMakingCard}
                        {posterDesignCard}
                        {cineQuizCard}
                    </>
                );
        }
    };

    return (
        <div className="rule-component">
            <div className="rule-component-in">
                <div className="rule-component-heading">
                    <h1>Competition Rules</h1>
                    <p>Please review all guidelines carefully before participating in the event</p>
                </div>
            </div>
            <div className="rule-component-filter">
                <div className="rule-component-filter-in">
                    {filterButtons.map(button => (
                        <button 
                            key={button.id}
                            className={`filter-btn ${selectedCategory === button.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(button.id)}
                        >
                            {button.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="rule-component-main">
                <div className="rule-component-main-in">
                    <div className="rule-grid">
                        {renderContent()}
                    </div>
                </div>
            </div>
            <div className="rule-component-footer">
                <Footer />
            </div>
            <div className="navigation-buttons">
                <button 
                    className="back-to-home"
                    onClick={goToHome}
                    aria-label="Back to home"
                >
                    <FaHome />
                </button>
                <button 
                    className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
                    onClick={scrollToTop}
                    aria-label="Back to top"
                >
                    <FaArrowUp />
                </button>
            </div>
        </div>
    );
}

export default Rules;