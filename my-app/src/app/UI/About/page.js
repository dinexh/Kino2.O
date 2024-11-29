"use client"
import Image from 'next/image';
import FilmBackground from '../../components/Background/FilmBackground';
import './about.css';
import logo from '../../Assets/about-img.webp';
import { about1, about2 } from '../../Data/about';
import { useState } from 'react';
import Modal from '../../components/Modal/Modal';

const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const openModal = (activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  return (
    <div className="about-container">
      <FilmBackground />
      <div className="about-content-wrapper">
        {about1.map((about, index) => (
          <div className="about-card" key={about.id || index}>
            <h3>{about.title}</h3>
            <p>{about.description}</p>
            <button className="read-more" onClick={() => openModal(about)}>READ MORE</button>
          </div>
        ))}

        <div className="about-header">
          <h2>
            <p className="about">ABOUT</p>
            <p> THE FESTIVAL</p>
          </h2>
        </div>

        <div className="about-logo-wrapper">
          <Image 
            src={logo}
            alt="Chitramela Logo"
            className="about-logo"
            width={350}
            height={300}
            priority
          />
        </div>

        {about2.map((about, index) => (
          <div className="about-card" key={about.id || index}>
            <h3>{about.title}</h3>
            <p>{about.description}</p>
            <button className="read-more" onClick={() => openModal(about)}>READ MORE</button>
          </div>
        ))}

        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal}
        >
          {selectedActivity && (
            <div className="event-modal-content">
              <h2>{selectedActivity.title}</h2>
              <p>{selectedActivity.fullContent}</p>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default About;
