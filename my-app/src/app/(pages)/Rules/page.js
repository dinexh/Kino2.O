"use client"
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { rules } from '../../Data/rules';

const Rules = () => {
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  useEffect(() => {
    if (eventId) {
      // Find the element with the specific event ID and scroll to it
      const element = document.getElementById(`rule-${eventId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Optional: Add a highlight effect
        element.classList.add('highlight');
        setTimeout(() => element.classList.remove('highlight'), 2000);
      }
    }
  }, [eventId]);

  return (
    <div className="rules-page">
      <h1>Rules and Guidelines</h1>
      {rules.map((rule) => (
        <div 
          key={rule.id} 
          id={`rule-${rule.id}`} 
          className="rule-section"
        >
          {/* Your existing rules content */}
        </div>
      ))}
    </div>
  );
};

export default Rules; 