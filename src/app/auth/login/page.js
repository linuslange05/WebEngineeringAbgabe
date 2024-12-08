"use client"; // This makes the component a client-side component

import { useState } from "react";
import Link from "next/link"; // Import Link from next/link

import Footer from "../../shared/footer";
import { useEffect } from "react";

import getIsLoggedIn from "../../utils/getIsLoggedIn";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      getIsLoggedIn().then((data) => {
        const error = data.error;
        error
          ? console.log(error)
          : console.log("Successfully fetched user login status");
        if (data.loggedIn && window.location.pathname !== "/") {
          window.location.href = "/";
        }
      });
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Proceed with login logic (e.g., send data to API)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Setzt den Content-Type Header
          },
          body: JSON.stringify({ email: email, password: password }),
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        window.location.href = "/";
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to login.");
    }
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Login to Your Account</h2>

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
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Login
          </button>
        </form>

        <div className="mt-4">
          <p className="text-gray-700">
            Don't have an account?{" "}
            {/* Using Link component for navigation to the Register page */}
            <Link
              href="/auth/register"
              className="text-blue-500 hover:underline"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
