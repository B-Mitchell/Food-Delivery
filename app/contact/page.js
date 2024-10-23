'use client'
import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here, you can add functionality to send the data to a backend server, email API, or Supabase
    console.log('Form Data:', formData);
    setSubmitted(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-6">Contact Us</h1>

      {submitted ? (
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-green-500">Thank you!</h2>
          <p className="text-lg">Your message has been sent. We will get back to you soon.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows="4"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Send Message
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactPage;
