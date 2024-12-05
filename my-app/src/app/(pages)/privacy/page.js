"use client";
import React from 'react';
import './privacy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>
      <div className="privacy-content">
        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us when registering for Chitramela events.</p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>2.1. To process your event registrations</p>
          <p>2.2. To communicate important event updates</p>
          <p>2.3. To improve our services and user experience</p>
        </section>

        <section>
          <h2>3. Information Security</h2>
          <p>We implement appropriate security measures to protect your personal information.</p>
        </section>

        <section>
          <h2>4. Contact Information</h2>
          <p>For any privacy-related concerns, please contact us at klsacphotography@gmail.com</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 