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
    <>
    {/* Tailwind CSS CDN */}
    <link href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css" rel="stylesheet" />
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat py-8 px-4"
      style={{
        backgroundImage: `url('/images/feedback.webp')`, // Replace with your background image path
        backgroundSize: 'cover',
        backgroundPosition: 'center center'
      }}
    >
      {/* Semi-transparent overlay for better form visibility */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="relative z-10 max-w-md mx-auto">
        <div className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-6">
          <h3 className="text-center mb-6 text-xl font-bold text-gray-800">FEEDBACK FORM</h3>
          <div className="space-y-4">
            <div>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="First Name" 
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div>
              <input 
                type="text" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div>
              <input 
                type="email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Email" 
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div>
              <input 
                type="tel" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                placeholder="Phone Number" 
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div>
              <textarea 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" 
                rows="3" 
                placeholder="Your Feedback" 
                name="feedback"
                value={formData.feedback}
                onChange={handleInputChange}
                required
              ></textarea>
            </div>
            <div className="text-center">
              <label className="block text-gray-700 font-medium mb-2">Rate Us:</label>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => handleRatingClick(star)}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
            </div>
            <button 
              type="button" 
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleSubmit}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default FeedbackForm;