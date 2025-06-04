import React from 'react';
import { Link } from 'react-router-dom';

const SymptomsSection = () => {
  const symptoms = [
    {
      icon: "fas fa-people-arrows",
      title: "Loss of Balance",
      description: "Difficulty in maintaining balance and coordination while walking or standing."
    },
    {
      icon: "fas fa-eye",
      title: "Eye Problems",
      description: "Sudden vision changes, including blurred or double vision."
    },
    {
      icon: "fas fa-battery-empty",
      title: "Extreme Fatigue",
      description: "Unusual tiredness and lack of energy throughout the day."
    },
    {
      icon: "fas fa-microphone-alt-slash",
      title: "Speech Disturbance",
      description: "Slurred speech or difficulty in speaking clearly."
    },
    {
      icon: "fas fa-head-side-virus",
      title: "Terrible Headache",
      description: "Severe and sudden headaches with no known cause."
    },
    {
      icon: "fas fa-user-clock",
      title: "Lack of Concentration",
      description: "Difficulty in focusing or staying attentive."
    }
  ];

  return (
    <div className="container mt-5 text-center">
      <h3 className="fw-bold text-center mt-4" style={{
        fontSize: '2rem',
        textTransform: 'uppercase',
        letterSpacing: '1px'
      }}>
        Symptoms of Brain Stroke
      </h3>
      
      <div className="row">
        {symptoms.map((symptom, index) => (
          <div key={index} className="col-xl-4 col-lg-4 col-md-6 col-sm-12">
            <div className="symptom-box mb-4">
              <i className={`${symptom.icon} symptom-icon fa-2x`}></i>
              <h5 className="mt-3">{symptom.title}</h5>
              <p>{symptom.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-4">
        <Link to="/symptom" className="btn btn-outline-primary btn-hover">Learn More</Link>
      </div>
    </div>
  );
};

export default SymptomsSection;