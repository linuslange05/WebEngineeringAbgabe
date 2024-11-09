'use client'

import { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
export default function ContactForm() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [recaptchaToken, setRecaptchaToken] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Check if the reCAPTCHA token exists
    if (!recaptchaToken) {
      setError('Please verify you are human.');
      return;
    }

    // Reset any previous error
    setError(null);

    // Handle form submission (e.g., send the data to an API)
    const formData = {
      name: name,
      message: message,
      g_recaptcha_token: recaptchaToken,
    };

    // Mock submission - replace with your actual API call
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/contact/sendMessage`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

    // Clear form fields after submission (optional)
    setName('');
    setMessage('');
    setRecaptchaToken('');
  };

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  return (
    <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-left">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Us</h3>

      <form onSubmit={handleSubmit}>
        <label className="block mb-2 text-gray-600 font-medium">
          Name
          <input
            required
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
          />
        </label>

        <label className="block mb-4 text-gray-600 font-medium">
          Message
          <textarea
            required
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-200"
            rows="4"
          />
        </label>

        {/* Google reCAPTCHA */}
        <div className="mb-4">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY} // Replace with your site key
            onChange={handleRecaptchaChange}
          />
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Send Feedback
        </button>
      </form>
    </div>
  );
}
