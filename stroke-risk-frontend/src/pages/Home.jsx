import React from 'react';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServiceSection';
import SymptomsSection from '../components/SymptomsSection';
import BrainCareSection from '../components/BrainCareSection';
import WhatsAppSection from '../components/WhatsAppSection';
import AmbassadorsSection from '../components/AmbassadorsSection';
import FeedbackForm from '../components/FeedbackForm';
import TestimonialsSection from '../components/TestimonialsSection';
import EmergencyButton from '../components/EmergencyButton';

const Home = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <ServicesSection />
      <SymptomsSection />
      <BrainCareSection />
      <WhatsAppSection />
      <AmbassadorsSection />
      <FeedbackForm />
      <TestimonialsSection />
      <EmergencyButton />
    </>
  );
};

export default Home;