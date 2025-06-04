import React from 'react';

const AmbassadorsSection = () => {
  const ambassadors = [
    {
      name: "Shankar Mahadevan",
      title: "Indian Singer & Music Director",
      image: "/images/shankar_mahadevan.jpg"
    },
    {
      name: "Supriya Vinod",
      title: "Marathi Actress & Costume Designer",
      image: "/images/supriya_vinod.jpg"
    }
  ];

  return (
    <section className="ambassador-section">
      <div className="container">
        <h2>Our Brand Ambassadors</h2>
        <p>We are honored to be represented by these distinguished personalities.</p>

        <div className="row">
          {ambassadors.map((ambassador, index) => (
            <div key={index} className="col-md-6 col-lg-6">
              <div className="ambassador-card">
                <img 
                  src={ambassador.image} 
                  alt={ambassador.name} 
                  className="ambassador-img" 
                />
                <div className="ambassador-info">
                  <h4>{ambassador.name}</h4>
                  <p>{ambassador.title}</p>
                  <div className="social-icons">
                    <a href="#"><i className="fab fa-facebook"></i></a>
                    <a href="#"><i className="fab fa-twitter"></i></a>
                    <a href="#"><i className="fab fa-instagram"></i></a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AmbassadorsSection;