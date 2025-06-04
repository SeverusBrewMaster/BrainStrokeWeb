import React, { useState } from 'react';

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    feedback: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', { ...formData, rating });
    // Add your form submission logic here
  };

  return (
    <div className="feedback-container mb-5 mt-5">
      <div className="form-box">
        <h3 className="text-center mb-3 fw-bold">FEEDBACK FORM</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="First Name" 
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="email" 
              className="form-control" 
              placeholder="Email" 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="mb-3">
            <input 
              type="tel" 
              className="form-control" 
              placeholder="Phone Number" 
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required 
            />
          </div>
          <div className="mb-3">
            <textarea 
              className="form-control" 
              rows="3" 
              placeholder="Your Feedback" 
              name="feedback"
              value={formData.feedback}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <div className="mb-3 text-center">
            <label className="form-label">Rate Us:</label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <i 
                  key={star}
                  className={`fas fa-star ${star <= rating ? 'active' : ''}`}
                  onClick={() => handleRatingClick(star)}
                  style={{ cursor: 'pointer' }}
                ></i>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-100">Submit Feedback</button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;