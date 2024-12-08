"use client";
import { useState, useEffect } from "react";
import Navbar from "../shared/navbar";
import Footer from "../shared/footer";
import getIsLoggedIn from "@/app/utils/getIsLoggedIn";
import RainBackground from "./components/rainBackground";
import SnowBackground from "./components/snowBackground";
import CloudyBackground from "./components/cloudyBackground";
import SunnyBackground from "./components/sunnyBackground";
import ThunderBackground from "./components/thunderBackground";

import { Line } from "react-chartjs-2"; // Import Chart.js-Komponente
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useSearchParams } from "next/navigation";

// Chart.js registrieren
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Search() {
  const searchParams = useSearchParams();
  const savedLocationLatitude = searchParams.get("latitude");
  const savedLocationLongitude = searchParams.get("longitude");
  const savedLocationName = searchParams.get("name");

  const [location, setLocation] = useState(
    savedLocationLatitude && savedLocationLongitude
      ? `${savedLocationLatitude},${savedLocationLongitude}`
      : ""
  );
  const [isLocationSaved, setIsLocationSaved] = useState(false);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null); // For popup modal
  const [isFirstLoadFromSaved, setIsFirstLoadFromSaved] = useState(
    savedLocationName ? true : false
  );

  useEffect(() => {
    // Check user login status
    const fetchData = async () => {
      getIsLoggedIn().then((data) => {
        const error = data.error;
        error
          ? console.log(error)
          : console.log("Successfully fetched user login status");
        if (!data.loggedIn && window.location.pathname !== "/") {
          window.location.href = "/";
        }
      });
    };
    fetchData();
    if (savedLocationLatitude && savedLocationLongitude) {
      fetchWeather();
      console.log(isFirstLoadFromSaved);
      if (savedLocationName) {
        setLocation(savedLocationName);
      }
    } else {
      // Get the user's current location and set it in the input field
      const getCurrentLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation(`${latitude},${longitude}`); // Set coordinates in the input
            },
            (error) => {
              console.error("Error getting location:", error);
              setError("Could not get your location.");
            }
          );
        } else {
          setError("Geolocation is not supported by this browser.");
        }
      };

      getCurrentLocation(); // Fetch location on page load
    }
  }, []);

  useEffect(() => {
    if (forecast) {
      getIsLocationSaved(); // Wird nur ausgeführt, wenn forecast gesetzt ist
    }
  }, [forecast]); // Abonniert Änderungen an forecast

  const getIsLocationSaved = async () => {
    try {
      let locationName = forecast.subName;
      if (isFirstLoadFromSaved) {
        locationName = savedLocationName;
      } else if (forecast.isSubNameCoordinates) {
        locationName = forecast.city.name;
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/isLocationSaved?name=${locationName}`,
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
      console.log(err);
    }
  };

  const fetchWeatherByClick = async () => {
    setIsFirstLoadFromSaved(false);
    fetchWeather();
  };

  const fetchWeather = async () => {
    try {
      const response = await fetch(`/api/weather?location=${location}`);
      const data = await response.json();

      if (data.cod == "200") {
        console.log(data);
        setForecast(data);
        setError(null);
      } else {
        setError(data.message);
        setForecast(null);
        return;
      }
    } catch (err) {
      setError("Failed to fetch weather data.");
      setForecast(null);
      return;
    }
  };

  const changeSavedState = async () => {
    const currentSavedState = isLocationSaved;
    const newSavedState = !currentSavedState;
    setIsLocationSaved(newSavedState);
    if (newSavedState) {
      try {
        let locationLatitude = forecast.city.coord.lat;
        let locationLongitude = forecast.city.coord.lon;
        let locationName = forecast.subName;

        if (isFirstLoadFromSaved) {
          locationLatitude = savedLocationLatitude;
          locationLongitude = savedLocationLongitude;
          locationName = savedLocationName;
        } else if (forecast.isSubNameCoordinates) {
          locationName = forecast.city.name;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/save`,
          {
            method: "POST",
            body: JSON.stringify({
              latitude: locationLatitude,
              longitude: locationLongitude,
              name: locationName,
            }),
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
    } else {
      try {
        let locationName = forecast.subName;
        if (isFirstLoadFromSaved) {
          locationName = savedLocationName;
        } else if (forecast.isSubNameCoordinates) {
          locationName = forecast.city.name;
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/locations/remove`,
          {
            method: "DELETE",
            body: JSON.stringify({ name: locationName }),
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

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const getFormattedDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  const getTemperatureRangeForDay = (dayStartIndex) => {
    const dayData = forecast.list.slice(dayStartIndex, dayStartIndex + 8);
    const temps = dayData.map((entry) => entry.main.temp - 273.15); // Kelvin to Celsius
    return {
      min: Math.min(...temps).toFixed(1),
      max: Math.max(...temps).toFixed(1),
      dayData,
    };
  };

  return (
    <div className="min-h-screen bg-blue-50 overflow-hidden">
      <Navbar />
      <div className="flex flex-col">
        {/* Header and Input Section */}
        <div className="flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-4">Ordinary Weather App</h1>
            <p className="text-gray-700 mb-4">
              Search by City or Coordinates (
              <span className="text-gray-500">latitude,longitude</span>) to get
              a five-day weather forecast.
            </p>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter location"
              className="border p-2 rounded w-full mb-4"
            />
            <button
              onClick={fetchWeatherByClick}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Get Weather
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>

        {/* Weather Forecast Section */}
        {forecast && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              <div className="flex justify-center items-center gap-2">
                <h2 className="text-3xl font-semibold">
                  {isFirstLoadFromSaved
                    ? savedLocationName
                    : forecast.isSubNameCoordinates
                    ? forecast.city.name
                    : forecast.subName}
                </h2>
                <button
                  onClick={changeSavedState}
                  className="text-yellow-500 text-4xl hover:text-yellow-600"
                >
                  {isLocationSaved ? "★" : "☆"}
                </button>
              </div>
              <h4 className="text-xl text-gray-500">
                {forecast.city.name !== forecast.subName
                  ? forecast.isSubNameCoordinates
                    ? forecast.subName
                    : forecast.city.name
                  : ""}
              </h4>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap justify-center items-stretch gap-4 px-6">
              {forecast.list
                .filter((_, index) => index % 8 === 0) // Hole Daten alle 24 Stunden
                .map((day, index) => {
                  const { min, max, dayData } = getTemperatureRangeForDay(
                    index * 8
                  );
                  return (
                    <div
                      key={index}
                      className="weather-card flex-1 sm:flex-initial min-w-[150px] max-w-[200px] bg-blue-100 p-4 rounded shadow text-center cursor-pointer"
                      onClick={() => setSelectedDay(dayData)}
                    >
                      <p className="font-bold">{getDayName(day.dt_txt)}</p>
                      <img
                        src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                        alt={day.weather[0].description}
                        className="mx-auto"
                      />
                      <p className="text-lg font-semibold">
                        {min}°C - {max}°C
                      </p>
                      <p className="text-sm text-gray-500">
                        {day.weather[0].description}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Popup Modal */}
        {selectedDay && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-hidden bg-gray-900 bg-opacity-50" // Overlay
          >
            {console.log(selectedDay[0].weather[0].main.toLowerCase())}
            {selectedDay[0].weather[0].main.toLowerCase() === "thunderstorm" ? (
              <ThunderBackground />
            ) : null}
            {selectedDay[0].weather[0].main.toLowerCase() === "clear" ? (
              <SunnyBackground />
            ) : null}
            {selectedDay[0].weather[0].main.toLowerCase() === "clouds" ? (
              <CloudyBackground />
            ) : null}
            {selectedDay[0].weather[0].main.toLowerCase() === "rain" ? (
              <RainBackground />
            ) : null}
            {selectedDay[0].weather[0].main.toLowerCase() === "drizzle" ? (
              <RainBackground type="light" />
            ) : null}
            {selectedDay[0].weather[0].main.toLowerCase() === "snow" ? (
              <SnowBackground />
            ) : null}
            <div className="bg-white max-w-screen-sm sm:max-w-lg lg:max-w-xl w-full h-[80%] sm:h-[90%] p-6 rounded-lg shadow-lg overflow-auto relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {getDayName(selectedDay[0].dt_txt)},{" "}
                  {getFormattedDate(selectedDay[0].dt_txt)}
                </h2>
                <button
                  onClick={() => setSelectedDay(null)}
                  className="text-red-500 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Diagramm */}
              <div className="mb-4">
                <Line
                  data={{
                    labels: selectedDay.map((entry) =>
                      new Date(entry.dt_txt).toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    ),
                    datasets: [
                      {
                        label: "Temperature (°C)",
                        data: selectedDay.map(
                          (entry) => entry.main.temp - 273.15
                        ),
                        borderColor: "rgba(59, 130, 246, 0.8)", // Blau
                        backgroundColor: "rgba(59, 130, 246, 0.2)",
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                    },
                  }}
                />
              </div>

              {/* Zusatzinfos und großes Icon */}
              <div className="mt-4 flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">More info</h3>
                  <p className="text-gray-700">
                    <strong>Average temperature:</strong>{" "}
                    {(
                      selectedDay.reduce(
                        (sum, entry) => sum + (entry.main.temp - 273.15),
                        0
                      ) / selectedDay.length
                    ).toFixed(1)}{" "}
                    °C
                  </p>
                  <p className="text-gray-700">
                    <strong>Weather description:</strong>{" "}
                    {selectedDay[0].weather[0].description
                      .charAt(0)
                      .toUpperCase() +
                      selectedDay[0].weather[0].description.slice(1)}
                  </p>
                  <p className="text-gray-700">
                    <strong>Maximum wind speed:</strong>{" "}
                    {Math.max(
                      ...selectedDay.map((entry) => entry.wind.speed)
                    ).toFixed(1)}{" "}
                    m/s
                  </p>
                  <p className="text-gray-700">
                    <strong>Average humidity:</strong>{" "}
                    {(
                      selectedDay.reduce(
                        (sum, entry) => sum + entry.main.humidity,
                        0
                      ) / selectedDay.length
                    ).toFixed(1)}{" "}
                    %
                  </p>
                  <p className="text-gray-700">
                    <strong>Average air pressure:</strong>{" "}
                    {(
                      selectedDay.reduce(
                        (sum, entry) => sum + entry.main.pressure,
                        0
                      ) / selectedDay.length
                    ).toFixed(1)}{" "}
                    hPa
                  </p>
                </div>
                <div className="flex items-center justify-center sm:ml-6 mt-4 sm:mt-0">
                  <img
                    src={`https://openweathermap.org/img/wn/${selectedDay[0].weather[0].icon}@4x.png`}
                    alt="Haupt-Wetter-Icon"
                    className="w-32 h-32 sm:w-40 sm:h-40"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
