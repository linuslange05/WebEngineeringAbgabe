'use client';  // This makes the component a client-side component

import { useState } from 'react';
import Link from 'next/link';  // Import Link from next/link

import Footer from "../../shared/footer";

export default function Register() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatchError, setPasswordMatchError] = useState(false);
  const handleSubmit = async(e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }
    // Proceed with registration logic (e.g., send data to API)
    try {

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Setzt den Content-Type Header
                  },
                body: JSON.stringify({email: email, password: password}),
                credentials: 'include',
            }
        );
        const data = await response.json();
        if (response.ok) {
          window.location.href = '/';
        } else {
          setError(data.message);        }
      } catch (err) {
        setError('Failed to register.');
      }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-2 border ${passwordMatchError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {passwordMatchError && (
            <p className="text-red-500 text-sm">Passwords do not match.</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>

        <div className="mt-4">
          <p className="text-gray-700">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
      <Footer/>
      
    </div>
  );
}
