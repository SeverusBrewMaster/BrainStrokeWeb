import React from 'react';

const ServicesSection = () => {
  return (
    <section className="container-fluid text-white py-5" style={{backgroundColor: '#0d6efd'}}>
      <div className="row text-center">
        <div className="col-lg-4 col-md-6 mb-3">
          <div className="p-4">
            <i className="fas fa-hand-holding-heart fa-3x"></i>
            <h4 className="mt-3">Next NGO Camp</h4>
            <p>Join us for a free health camp on <strong>date</strong>, at <strong>Location</strong>.</p>
            <a href="#" className="btn btn-outline-light">Learn More</a>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 mb-3">
          <div className="p-4">
            <i className="fas fa-phone-alt fa-3x"></i>
            <h4 className="mt-3">Emergency Contact</h4>
            <p>For immediate assistance, call:</p>
            <a href="tel:+911234567890" className="btn btn-outline-light">+91 123 456 7890</a>
          </div>
        </div>
        <div className="col-lg-4 col-md-6 mb-3">
          <div className="p-4">
            <i className="fas fa-hospital-alt fa-3x"></i>
            <h4 className="mt-3">Contact Your Nearby Hospital</h4>
            <p>For immediate assistance, please reach out to your nearest hospital.</p>
            <a href="#" className="btn btn-outline-light">Find Nearby Hospitals</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;