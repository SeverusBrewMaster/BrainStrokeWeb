import React from 'react';
import Header from '../components/Header';
import EmergencyButton from '../components/EmergencyButton';

const Risk = () => {
  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1>Stroke Risk Assessment</h1>
        <p>This page will contain the stroke risk assessment tool.</p>
        {/* Add your risk assessment form here */}
      </div>
      <EmergencyButton />
    </>
  );
};

export default Risk;