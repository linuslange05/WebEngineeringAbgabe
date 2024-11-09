// app/api/weather/route.js

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get('location');
  
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;
  
    const response = await fetch(apiUrl);
    const data = await response.json();
  
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
   