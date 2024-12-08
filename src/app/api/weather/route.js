export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  // Helper function to check if location is in coordinates format
  const isCoordinates = (location) => {
    const regex = /^-?\d+(\.\d+)?,\s?-?\d+(\.\d+)?$/;
    return regex.test(location);
  };

  try {
    let lat, lon, subName, isSubNameCoordinates;

    if (isCoordinates(location)) {
      // If the location is already in coordinates format
      const [latitude, longitude] = location.split(",").map(Number);
      lat = latitude;
      lon = longitude;
      subName = `${latitude},${longitude}`;
      isSubNameCoordinates = true;
    } else {
      // Step 1: Convert location to coordinates using Geocoding API
      const geocodingApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        location
      )}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geocodingApiUrl);
      const geoData = await geoResponse.json();

      if (!geoData.length) {
        return new Response(JSON.stringify({ error: "Location not found." }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      // Use the first result from geocoding API
      lat = geoData[0].lat;
      lon = geoData[0].lon;
      subName = geoData[0].name;
      isSubNameCoordinates = false;
    }

    // Step 2: Fetch weather data for the coordinates
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const weatherResponse = await fetch(weatherApiUrl);
    const weatherData = await weatherResponse.json();
    weatherData.subName = subName;
    weatherData.isSubNameCoordinates = isSubNameCoordinates;

    return new Response(JSON.stringify(weatherData), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    return new Response(
      JSON.stringify({ error: "Failed to fetch weather data." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
