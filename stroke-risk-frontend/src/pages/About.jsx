import React from 'react';
import Header from '../components/Header';
import EmergencyButton from '../components/EmergencyButton';

const About = () => {
  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1>About Us</h1>
        <p>This page will contain information about the organization.</p>
        {/* Add your about content here */}
      </div>
      <EmergencyButton />
    </>
  );
};

export default About;