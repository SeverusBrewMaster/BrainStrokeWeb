import React from 'react';

const WhatsAppSection = () => {
  return (
    <>
      <h2 className="fw-bold text-center mt-4">CONNECT WITH US</h2>
      <section className="connect-section text-white py-5 mb-5">
        <div className="container">
          <p className="lead text-center">Scan the QR code to join our community on WhatsApp</p>
          
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-5 d-flex justify-content-center">
              <div className="card p-4 text-dark shadow-lg text-center"
                  style={{
                    borderRadius: '15px', 
                    background: 'rgba(255, 255, 255, 0.9)'
                  }}>
                <h5 className="card-title text-primary fw-bold">Join Our Community</h5>
                <p className="card-text text-muted">Use your WhatsApp camera to scan the QR code.</p>
                <div className="p-3 d-flex justify-content-center">
                  <img 
                    src="/images/qr_code.png" 
                    alt="QR Code" 
                    className="qr-image img-fluid"
                    style={{
                      width: '220px', 
                      height: '220px', 
                      borderRadius: '10px', 
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                  />
                </div>
                <button className="btn btn-primary mt-3 px-4">Join Now</button>
              </div>
            </div>

            <div className="col-lg-5 d-flex flex-column justify-content-center">
              <h4 className="fw-bold">How to Join?</h4>
              <ul className="fs-5 list-unstyled">
                <li>• Open WhatsApp App</li>
                <li>• Click Camera / QR icon to scan</li>
                <li>• Join our growing community</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default WhatsAppSection;