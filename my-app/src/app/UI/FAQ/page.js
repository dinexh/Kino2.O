'use client';

import { useState } from 'react';
import './faq.css';

import { faqs } from '../../Data/faqs';

const FAQ = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
                

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-container">
        <div className="faq-heading">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-content">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <h3 
                className="faq-question" 
                onClick={() => toggleFaq(index)}
              >
                {faq.question}
                <span className={`faq-indicator ${openFaqIndex === index ? 'open' : ''}`}>
                  &#x25BC;
                </span>
              </h3>
              <p className={`faq-answer ${openFaqIndex === index ? 'open' : ''}`}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;