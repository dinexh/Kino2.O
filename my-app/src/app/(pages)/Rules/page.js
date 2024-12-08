"use client";
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { rules } from '../../Data/rules';
import Footer from '../../components/Footer/Footer';
import { activities } from '../../Data/activities';
import Image from 'next/image';
import './rules.css';

const Rules = () => {
  const searchParams = useSearchParams();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedRules, setSelectedRules] = useState(null);
  const eventId = searchParams.get('eventId');

  useEffect(() => {
    if (eventId) {
      const event = activities.find(activity => activity.id === parseInt(eventId));
      setSelectedEvent(event);
      if (event) {
        const eventRules = rules.find(rule => rule.rulesId === event.rulesId);
        setSelectedRules(eventRules);
      }
    } else {
      // Set default to Reel Making Contest
      const defaultEvent = activities.find(activity => activity.title === 'Reel Making Contest');
      setSelectedEvent(defaultEvent || activities[0]);
      const defaultRules = rules.find(rule => rule.rulesId === defaultEvent?.rulesId);
      setSelectedRules(defaultRules);
    }
  }, [eventId]);

  const handleEventChange = (activityId) => {
    const selected = activities.find(activity => activity.id === activityId);
    setSelectedEvent(selected);
    const eventRules = rules.find(rule => rule.rulesId === selected.rulesId);
    setSelectedRules(eventRules);
  };

  return (
    <div className="rule-component">        
      <div className="rule-component-in">
        <h1>Rules and Regulations</h1>
      
        <div className="event-buttons">
          {activities.map(activity => (
            <button
              key={activity.id}
              className={`event-button ${selectedEvent?.id === activity.id ? 'active' : ''}`}
              onClick={() => handleEventChange(activity.id)}
            >
              {activity.title}
            </button>
          ))}
        </div>

        {selectedEvent && selectedRules && (
          <div className="selected-event">
            <h2>{selectedRules.title}</h2>
            <div className="event-image">
              <Image
                src={selectedEvent.image}
                alt={selectedEvent.title}
                width={400}
                height={300}
                priority
              />
            </div>
            
            <div className="rules-content">
              {selectedRules.eligibility && (
                <div className="rules-section">
                  <h3>Eligibility</h3>
                  <ul>
                    {selectedRules.eligibility.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRules.submissionGuidelines && (
                <div className="rules-section">
                  <h3>Submission Guidelines</h3>
                  <ul>
                    {selectedRules.submissionGuidelines.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRules.judgingEvaluation && (
                <div className="rules-section">
                  <h3>Judging & Evaluation</h3>
                  {selectedRules.judgingEvaluation.map((phase, index) => (
                    <div key={index} className="evaluation-phase">
                      <h4>{phase.phase}</h4>
                      <ul>
                        {phase.details.map((detail, idx) => (
                          <li key={idx}>{detail}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {selectedRules.judgingCriteria && (
                <div className="rules-section">
                  <h3>Judging Criteria</h3>
                  <ul>
                    {selectedRules.judgingCriteria.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedRules.contentGuidelines && (
                <div className="rules-section">
                  <h3>Content Guidelines</h3>
                  <ul>
                    {selectedRules.contentGuidelines.map((rule, index) => (
                      <li key={index}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    <Footer/>
    </div>
  );
};

export default Rules;