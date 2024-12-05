"use client";
import React from 'react';
import './terms.css';

const TermsAndConditions = () => {
  return (
    <div className="terms-container">
      <h1>Terms and Conditions</h1>
      <div className="terms-content">
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and participating in Chitramela, you agree to be bound by these Terms and Conditions.</p>
        </section>

        <section>
          <h2>2. Event Participation</h2>
          <p>2.1. All participants must be currently enrolled students of KL University.</p>
          <p>2.2. Registration is mandatory for participating in any event.</p>
          <p>2.3. The organizing committee reserves the right to modify event rules and schedules.</p>
        </section>

        <section>
          <h2>3. Content Submission</h2>
          <p>3.1. All submitted content must be original and free from copyright violations.</p>
          <p>3.2. The festival reserves the right to use submitted content for promotional purposes.</p>
        </section>

        <section>
          <h2>4. Code of Conduct</h2>
          <p>4.1. Participants must maintain professional behavior throughout the festival.</p>
          <p>4.2. Any form of discrimination or harassment will not be tolerated.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions; 