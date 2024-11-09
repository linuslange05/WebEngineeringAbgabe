// app/saved/page.js
"use client";
import { useState, useEffect } from "react";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";


export default function Saved() {
  const [savedLocations, setSavedLocations] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // Fetch saved locations from the backend
  const fetchSavedLocations = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/all`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        const locations = [];
        // data.locations.forEach(entry => {
        //     locations.push(entry.name);
        // });
        data.forEach(entry => {
            locations.push(entry.name);
            
        });
        setSavedLocations(locations);
      } else {
        setError(data.message);
      }
    } catch (err) {
        console.log(err);
      setError("Failed to fetch saved locations.");
    }
  };

  // Fetch weather for a specific location
  const fetchWeatherForLocation = async (location) => {
    try {
      const response = await fetch(`/api/weather?location=${location}`);
      const data = await response.json();
      if (data.cod === 200) {
        setWeather({ ...data, name: location });
        setError(null);
      } else {
        setError(data.message);
        setWeather(null);
      }
    } catch (err) {
      setError("Failed to fetch weather data.");
      setWeather(null);
    }
  };

  // Remove a location from saved list
  const removeLocation = async (location) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/remove`, {
        method: "DELETE",
        body: JSON.stringify({ name: location }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      if (response.ok) {
        setSavedLocations(savedLocations.filter((loc) => loc !== location));
        if (weather && weather.name === location) {
          setWeather(null);
        }
      } else {
        setError("Failed to delete location.");
      }
    } catch (err) {
      setError("Failed to delete location.");
    }
  };

  useEffect(() => {
    fetchSavedLocations();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Saved Locations</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {savedLocations.length === 0 && <p>No saved locations found.</p>}
          <ul>
            {savedLocations.map((location) => (
              <li key={location} className="flex justify-between items-center mb-2">
                <span className="text-lg">{location}</span>
                <div className="flex space-x-2">
                  <button
                    onClick={() => fetchWeatherForLocation(location)}
                    className="text-blue-500 hover:underline"
                  >
                    Show Weather
                  </button>
                  <button
                    onClick={() => removeLocation(location)}
                    className="text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {weather && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold">{weather.name}</h2>
              <p className="text-lg">{weather.main.temp}°C</p>
              <p className="text-sm text-gray-500">{weather.weather[0].description}</p>
            </div>
          )}
        </div>
      </div>
      <Footer/>

    </div>
  );
}
