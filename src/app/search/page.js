//  app/search/page.js
"use client";
import { useState } from "react";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";

export default function Search() {
  const [location, setLocation] = useState("Berlin");
  const [isLocationSaved, setIsLocationSaved] = useState(false);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const getIsLocationSaved = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/isLocationSaved?name=${location}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.ok) {
        setIsLocationSaved(data.isLocationSaved);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to get whether location is saved by user.");
    }
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(`/api/weather?location=${location}`);
      const data = await response.json();

      if (data.cod === 200) {
        setWeather(data);
        setError(null);
        await getIsLocationSaved();
      } else {
        setError(data.message);
        setWeather(null);
        return;
      }
    } catch (err) {
      setError("Failed to fetch weather data.");
      setWeather(null);
      return;
    }
    
  };

  const changeSavedState = async () => {
    const currentSavedState = isLocationSaved;
    const newSavedState = !currentSavedState;
    setIsLocationSaved(newSavedState);
    if(newSavedState){
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/save`,
          {
            method: "POST",
            body: JSON.stringify({ name: location }),
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        if (!response.ok) {
          setError("Failed to save location.");
          setIsLocationSaved(currentSavedState);
        }
      } catch (err) {
        setIsLocationSaved(currentSavedState);
        setError("Failed to save location.");
      }
    }else{
        try {
            const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/remove`,
            {
                method: "DELETE",
                body: JSON.stringify({ name: location }),
                headers: {
                "Content-Type": "application/json",
                },
                credentials: "include",
            }
            );
            if (!response.ok) {
            setError("Failed to delete location.");
            setIsLocationSaved(currentSavedState);
            }
        } catch (err) {
            setIsLocationSaved(currentSavedState);
            setError("Failed to delete location.");
        }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">Weather App</h1>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="border p-2 rounded w-full mb-4"
          />
          <button
            onClick={fetchWeather}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Get Weather
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {weather && (
            <div className="mt-6">
              <div>
                <h2 className="text-xl font-semibold">{weather.name}</h2>
                <button
                  onClick={changeSavedState}
                  className="text-yellow-500 text-2xl hover:text-yellow-600"
                >
                  {isLocationSaved ? '★' : '☆'}
                </button>
              </div>
              <p className="text-lg">{weather.main.temp}°C</p>
              <p className="text-sm text-gray-500">
                {weather.weather[0].description}
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
