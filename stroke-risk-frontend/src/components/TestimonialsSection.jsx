import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Raghav Mishra",
      role: "Patient's Family Member",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "Thanks to this NGO, I learned the early signs of stroke and got help for my father in time. Their awareness programs are lifesaving!"
    },
    {
      name: "Pandurang Kokate",
      role: "Patient",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      quote: "The awareness campaigns are incredible. I now understand the importance of stroke prevention and early diagnosis!"
    },
    {
      name: "Jay Wagh",
      role: "Volunteer",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      quote: "Volunteering here has been life-changing. Helping spread awareness has saved lives and made a real difference!"
    }
  ];

  return (
    <>
      <h2 className="text-uppercase text-center fw-bold">Our Testimonials</h2>
      <section className="testimonial-section mt-5">
        <div className="testimonial-overlay"></div>
        <div className="container testimonial-container">
          <h2 className="fw-bold">Our Patients Say</h2>

          <div className="row justify-content-center">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="col-md-4">
                <div className="testimonial-card">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="testimonial-img" 
                  />
                  <i className="fas fa-quote-left quote-icon"></i>
                  <p>"{testimonial.quote}"</p>
                  <h5><strong>{testimonial.name}</strong></h5>
                  <p className="text-muted">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsSection;