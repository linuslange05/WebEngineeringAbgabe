"use client"; // This makes the component a client-side component

import { useState, useEffect } from "react";
import Link from "next/link"; // Import Link from next/link

import Footer from "../../shared/footer";

import getIsLoggedIn from "@/app/utils/getIsLoggedIn";

export default function Register() {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [emailError, setEmailError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      getIsLoggedIn().then((data) => {
        const error = data.error;
        error
          ? console.log(error)
          : console.log("Successfully fetched user login status");
        if (data.loggedIn) {
          window.location.href = "/";
        }
      });
    };
    fetchData();
  }, []);

  const validateData = () => {
    let hasError = false; // Temporäre Variable zur Nachverfolgung von Fehlern
    setPasswordError(false);
    setEmailError(false);
    setError(null);

    if (password !== confirmPassword) {
      setPasswordError(true);
      setError("Passwords do not match.");
      hasError = true;
    }
    if (password.length < 8) {
      setPasswordError(true);
      setError("Password must be at least 8 characters long.");
      hasError = true;
    }
    if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      setEmailError(true);
      setError("Email is not valid.");
      hasError = true;
    }

    return !hasError; // Rückgabe, ob die Validierung erfolgreich war oder nicht
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Verhindere Standard-Formular-Übermittlung

    if (!validateData()) {
      return; // Beende, falls Validierung fehlschlägt
    }

    // Code für den Registrierungsvorgang...
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
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
        window.location.href = '/';
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to register.");
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
            className={`w-full px-4 py-2 border ${
              emailError ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full px-4 py-2 border ${
              passwordError ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full px-4 py-2 border ${
              passwordError ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Register
          </button>
        </form>

        <div className="mt-4">
          <p className="text-gray-700">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
