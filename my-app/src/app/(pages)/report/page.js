"use client";
import React, { useState } from 'react';
import './report.css';

const BugReport = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bugType: 'technical',
    description: '',
    screenshot: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Bug report submitted:', formData);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <div className="bug-report-container">
      <h1>Report a Bug</h1>
      <form onSubmit={handleSubmit} className="bug-report-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bugType">Bug Type</label>
          <select
            id="bugType"
            name="bugType"
            value={formData.bugType}
            onChange={handleChange}
          >
            <option value="technical">Technical Issue</option>
            <option value="ui">UI/Design Issue</option>
            <option value="content">Content Issue</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="screenshot">Screenshot (optional)</label>
          <input
            type="file"
            id="screenshot"
            name="screenshot"
            onChange={handleChange}
            accept="image/*"
          />
        </div>

        <button type="submit" className="submit-button">Submit Report</button>
      </form>
    </div>
  );
};

export default BugReport; 