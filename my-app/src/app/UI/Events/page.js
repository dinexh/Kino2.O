"use client"
import Image from 'next/image';
import { useRef, useState } from 'react';
import './events.css';
import { activities } from '../../Data/activities';
import Modal from '../../components/Modal/Modal';
import { useRouter } from 'next/navigation';
import '../../moblie.css';

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
    router.push(`/Rules?eventId=${selectedActivity.id}`);
  }

  const Register = () =>{
    router.push(`/events/register`);
  }

  return (
    <div className="events-container" ref={eventsRef} id="events">
      <div className="events-container-one">
        <h2>Events</h2>
      </div>
      <div className="events-container-two">
        <div className="events-container-two-in" ref={activitiesRef}>
          {activities.map((activity) => (
            <div key={activity.id} className="events-card" onClick={() => handleReadMore(activity)}>
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
            <div className="event-modal-content-heading">
              <h2>{selectedActivity.title}</h2>
            </div>
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
                <div className="event-modal-details-in">
                  <div className="events-modal-details-heading-one">
                  <p className='date'><strong>Date:</strong> {selectedActivity.date}</p>
                  <p className='endDate'><strong>End Date to Register and Submit : {selectedActivity.End}</strong></p>
                  </div>
                  <div className="events-modal-details-heading-two">
                  <p className='description'>{selectedActivity.description}</p>
                  </div>
                  <div className="events-modal-details-buttons">
                  <button 
                  className="register-button"
                  onClick={() => {
                    console.log(`Registered for ${selectedActivity.title}`);
                    setIsModalOpen(false);
                    setSelectedActivity(null);
                    Register();
                  }}
                >
                    Register Now
                </button>
                <button 
                  className="register-button"
                  onClick={() => GoToRules(selectedActivity.id)}
                  style={{ marginTop: '1rem' }}
                >
                  Rules and Regulations
                </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Events;