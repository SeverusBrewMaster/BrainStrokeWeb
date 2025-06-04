import React from 'react';
import Header from '../components/Header';
import EmergencyButton from '../components/EmergencyButton';

const Symptom = () => {
  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1>Stroke Symptoms Details</h1>
        <p>This page will contain detailed information about stroke symptoms.</p>
        {/* Add your detailed symptoms information here */}
      </div>
      <EmergencyButton />
    </>
  );
};

export default Symptom;