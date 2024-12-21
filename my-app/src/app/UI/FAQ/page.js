'use client';

import { useState } from 'react';
import './faq.css';
import '../../moblie.css';
import { faqs } from '../../Data/faqs';

const FAQ = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
                
  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="faq-container" id="faq">
      <div className="faq-container-in">
        <div className="faq-container-in-one">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-container-in-two">
          <div className="faq-container-in-two-in">
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
      </div>
    </section>
  );
};

export default FAQ;
