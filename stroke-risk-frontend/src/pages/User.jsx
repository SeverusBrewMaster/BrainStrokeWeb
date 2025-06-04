import React from 'react';
import Header from '../components/Header';
import EmergencyButton from '../components/EmergencyButton';

const User = () => {
  return (
    <>
      <Header />
      <div className="container mt-5">
        <h1>User Profile</h1>
        <p>This page will contain user profile information.</p>
        {/* Add your user profile content here */}
      </div>
      <EmergencyButton />
    </>
  );
};

export default User;