import React from 'react';

const BrainCareSection = () => {
  return (
    <section className="container my-5">
      <div className="row align-items-center">
        <div className="col-lg-6 position-relative">
          <img 
            src="/images/image1.jpg" 
            className="img-fluid rounded shadow-lg position-absolute top-0 start-0" 
            style={{width: '50%', zIndex: 1}} 
            alt="Doctor" 
          />
          <img 
            src="/images/image2.jpg" 
            className="img-fluid rounded shadow-lg position-relative" 
            style={{width: '60%', marginLeft: '20%', marginTop: '40px', zIndex: 2}} 
            alt="Brain Consultation" 
          />
        </div>
        <div className="col-lg-6">
          <h6 className="text-primary">Making your brain healthy</h6>
          <h2 className="fw-bold">Best Care For Your Brain</h2>
          <p className="text-muted">
            Taking care of your brain is essential to prevent strokes and maintain cognitive health.
            Stay physically active, eat a balanced diet rich in nutrients, manage stress levels,
            monitor blood pressure, avoid smoking, and get regular check-ups. A healthy brain
            leads to a healthier life.
          </p>
          <ul className="list-unstyled">
            <li><i className="fas fa-check-circle text-primary"></i> Regular Exercises.</li>
            <li><i className="fas fa-check-circle text-primary"></i> Visiting doctors in case of slightest inconvenience.</li>
            <li><i className="fas fa-check-circle text-primary"></i> Checking your BMI on regular basis.</li>
            <li><i className="fas fa-check-circle text-primary"></i> Avoid Alcohol Consumption.</li>
          </ul>
          <a href="#" className="btn btn-outline-primary mt-3">Learn More</a>
        </div>
      </div>
    </section>
  );
};

export default BrainCareSection;