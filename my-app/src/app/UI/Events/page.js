import Image from 'next/image';
import { useRef, useState } from 'react';
import './events.css';
import { activities } from '../../Data/activities';
import Modal from '../../components/Modal/Modal';

const Events = () => {
  const eventsRef = useRef(null);
  const activitiesRef = useRef(null);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  return (
    <div className="events-container" ref={eventsRef} id="events">
      <div className="events-header">
        <h2>Get to know our events</h2>
      </div>
      <div className="events-cards-wrapper">
        <div className="events-cards-container" ref={activitiesRef}>
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
      
      <div className="events-navigation">
        <button 
          className="events-nav-button" 
          onClick={() => scrollActivities('left')}
        >
          &lt;
        </button>
        <button 
          className="events-nav-button" 
          onClick={() => scrollActivities('right')}
        >
          &gt;
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
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
                  height={300}
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
                    // Add registration logic here
                    setIsModalOpen(false);
                  }}
                >
                  Register Now
                </button>
              </div>
            </div>

            <div className="event-modal-rules">
              <h3>Rules and Guidelines</h3>
              <ul>
                <li>The event is open to all registered participants</li>
                <li>Each participant must have a valid registration to compete</li>
                <li>Participants must follow all event guidelines</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Events;