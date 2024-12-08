'use client';

import { useEffect, useState } from "react";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";

import getIsLoggedIn from "@/app/utils/getIsLoggedIn";


export default function Account() {
  const [userEmail, setUserEmail] = useState(null); // E-Mail des Benutzers
  const [loading, setLoading] = useState(true); // Ladeanzeige
  const [error, setError] = useState(null); // Fehlerbehandlung

  // Fetch für die Benutzerdaten
  const fetchUserEmail = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/email`, {
        method: "GET",
        credentials: "include",  // Authentifizierung über Cookies (falls verwendet)
      });

      if (response.ok) {
        const data = await response.json();
        setUserEmail(data.email); // E-Mail aus der Antwort setzen
      } else {
        setError("Failed to fetch user data.");
      }
    } catch (err) {
      setError("Error fetching user data.");
    } finally {
      setLoading(false); // Ladeanzeige deaktivieren
    }
  };

  useEffect(() => {
    fetchUserEmail(); // Benutzerdaten laden
    const fetchData = async () => {
      getIsLoggedIn().then((data) => {
        const error = data.error;
        error
          ? console.log(error)
          : console.log("Successfully fetched user login status");
        if (!data.loggedIn) {
          window.location.href = "/";
        }
      });
    };
    fetchData();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 200) {
        window.location.href = "/";
      } else {
        alert("Failed to logout.");
      }
    } catch (err) {
      alert(err);
    }
  };

  if (loading) {
    return (
      <div>Loading...</div> // Ladeanzeige
    );
  }

  if (error) {
    return (
      <div>{error}</div> // Fehleranzeige, falls Datenabruf fehlschlägt
    );
  }

  return (
    <div>
      <Navbar />
      <div className="p-6 flex flex-col items-center bg-blue-50 min-h-screen">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Your Account</h2>

          <div className="mb-6">
            <p className="text-gray-700">Signed in as:</p>
            <p className="text-lg font-semibold text-gray-800">
              {userEmail || "Email not available"} {/* Anzeige der echten E-Mail-Adresse */}
            </p>
          </div>

          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4"
            onClick={() => alert("Reset Password feature coming soon!")}
          >
            Reset Password
          </button>

          <button
            className="w-full bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      </div>
      <Footer/>

    </div>
  );
}
