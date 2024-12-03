"use client"
import Image from 'next/image';
import { useRef, useState } from 'react';
import './events.css';
import { activities } from '../../Data/activities';
import Modal from '../../components/Modal/Modal';
import { rules } from '../../Data/rules';
import { useRouter } from 'next/navigation';

const Events = () => {
  const router = useRouter();
  const eventsRef = useRef(null);
  const activitiesRef = useRef(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const scrollActivities = (direction) => {
    if (activitiesRef.current) {
      const scrollAmount = 300;
      const currentScroll = activitiesRef.current.scrollLeft;
      
      activitiesRef.current.scrollTo({
        left: direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  const handleReadMore = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const GoToRules = (eventId) => {
    router.push(`/Rules?eventId=${eventId}`);
  }

  return (
    <div className="events-container" ref={eventsRef} id="events">
      <div className="events-container-one">
        <h2>Events</h2>
      </div>
      <div className="events-container-two">
        <div className="events-container-two-in" ref={activitiesRef}>
          {activities.map((activity) => (
            <div key={activity.id} className="events-card">
              <div className="events-card-image">
                <Image 
                  src={activity.image} 
                  alt={activity.title} 
                  width={600}
                  height={600}
                  priority={true}
                />
              </div>
              <div className="events-card-overlay">
                <button 
                  className="events-card-button" 
                  onClick={() => handleReadMore(activity)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedActivity(null);
          setShowRules(false);
        }}
        event={selectedActivity}
      >
        {selectedActivity && (
          <div className="event-modal-content">
            <h2>{selectedActivity.title}</h2>
            
            <div className="event-modal-top">
              <div className="event-modal-image">
                <Image 
                  src={selectedActivity.image} 
                  alt={selectedActivity.title} 
                  width={400}
                  height={400}
                  objectFit="cover"
                />
              </div>
              
              <div className="event-modal-details">
                <p><strong>Date:</strong> {selectedActivity.date}</p>
                <p><strong>Time:</strong> {selectedActivity.time}</p>
                <p><strong>Venue:</strong> {selectedActivity.venue}</p>
                <p><strong>Fee:</strong> {selectedActivity.fee}</p>
                <button 
                  className="register-button"
                  onClick={() => {
                    console.log(`Registered for ${selectedActivity.title}`);
                    setIsModalOpen(false);
                    setSelectedActivity(null);
                  }}
                >
                  Register Now
                </button>
                <button 
                  className="register-button"
                  onClick={() => {
                    GoToRules(selectedActivity.rulesId);
                    setIsModalOpen(false);
                    setSelectedActivity(null);
                  }}
                  style={{ marginTop: '1rem' }}
                >
                  More Info
                </button>
              </div>
            </div>

            {showRules && (
              <div className="event-modal-rules">
                <h1>Rules and Guidelines</h1>
                {rules.find(r => r.id === selectedActivity.rulesId) ? (
                  <div className="rules-container">
                    {/* Title */}
                    <h3 className="rules-title" style={{color: "#ffffff"}}>
                      {rules.find(r => r.id === selectedActivity.rulesId)?.title}
                    </h3>

                    {/* Eligibility */}
                    {rules.find(r => r.id === selectedActivity.rulesId)?.eligibility && (
                      <div className="rules-section">
                        <h4>Eligibility:</h4>
                        <ul>
                          {rules.find(r => r.id === selectedActivity.rulesId)?.eligibility?.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {/* Submission Guidelines */}
                    {rules.find(r => r.id === selectedActivity.rulesId)?.submissionGuidelines && (
                      <div className="rules-section">
                        <h4>Submission Guidelines:</h4>
                        <ul>
                          {rules.find(r => r.id === selectedActivity.rulesId)?.submissionGuidelines?.map((guideline, index) => (
                            <li key={index}>{guideline}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Judging Criteria */}
                    {rules.find(r => r.id === selectedActivity.rulesId)?.judgingCriteria && (
                      <div className="rules-section">
                        <h4>Judging Criteria:</h4>
                        <ul>
                          {rules.find(r => r.id === selectedActivity.rulesId)?.judgingCriteria?.map((criteria, index) => (
                            <li key={index}>{criteria}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Content Guidelines */}
                    {rules.find(r => r.id === selectedActivity.rulesId)?.contentGuidelines && (
                      <div className="rules-section">
                        <h4>Content Guidelines:</h4>
                        <ul>
                          {rules.find(r => r.id === selectedActivity.rulesId)?.contentGuidelines?.map((guideline, index) => (
                            <li key={index}>{guideline}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>No rules available for this activity.</p>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Events;