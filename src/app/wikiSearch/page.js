"use client";
import { useState } from "react";
import Footer from "./components/footer";

export default function WikiSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const searchWikipedia = async () => {
    setError(null);  // Clear previous errors
    try {
      const response = await fetch(`https://de.wikipedia.org/w/api.php?action=query&list=search&srsearch=${query}&format=json&origin=*`);
      const data = await response.json();

      if (data?.query?.search) {
        setResults(data.query.search);
      } else {
        setError("No results found.");
        setResults([]);
      }
    } catch (err) {
      setError("Failed to fetch data from Wikipedia.");
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6">
        <div className="w-full md:w-4/5 lg:w-3/4 xl:w-11/12 bg-white mb-6 p-6 rounded-lg shadow-lg text-center">
          <h1 className="text-2xl font-bold mb-4">WikiSearch</h1>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search term"
            className="border p-2 rounded w-full mb-4"
          />
          <button
            onClick={searchWikipedia}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
          {results.length > 0 && (
            <table className="mt-6 w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Snippet</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="border px-4 py-2">
                      <a
                        href={`https://de.wikipedia.org/wiki/${result.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {result.title}
                      </a>
                    </td>
                    <td className="border px-4 py-2" dangerouslySetInnerHTML={{ __html: result.snippet }} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
