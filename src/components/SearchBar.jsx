import debounce from "lodash.debounce";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { API_KEY } from "../constants";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);
  const searchRef = useRef(null);

  const BASE_API_URL = 'https://v2.api.noroff.dev/holidaze';

  const fetchFilteredVenues = async (query) => {
    if (!query) {
      setFilteredVenues([]);
      return;
    }

    const url = `${BASE_API_URL}/venues/search?q=${query}`;

    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch venues: ${response.statusText}`);
      }

      const result = await response.json();

      setFilteredVenues(result.data.slice(0, 4));
    } catch (error) {
      setFilteredVenues([]);
    }
  };

  const debouncedFetchFilteredVenues = debounce((query) => {
    fetchFilteredVenues(query);
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedFetchFilteredVenues(value);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="search-bar-container">
      <div className="search-title">Where next?</div>

      <div className="search-bar" ref={searchRef}>
        <form onSubmit={(e) => e.preventDefault()} className="relative w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Search venues..."
            className="search-input"
          />
        </form>
      </div>

      {filteredVenues.length > 0 && (
        <div className="search-results absolute w-full mt-2 rounded-md border border-gray-200 bg-white shadow-lg">
          {filteredVenues.map((venue) => (
            <Link
              key={venue.id}
              to={`/venues/${venue.id}`}
              className="flex items-center p-3 hover:bg-gray-100 transition duration-150"
            >
              {!venue.media || venue.media.length === 0 || !venue.media[0]?.url ? (
                <div
                  className="h-12 w-12 flex items-center justify-center bg-gray-200 text-gray-500 rounded-full text-xs"
                  style={{
                    maxHeight: "100px",
                    maxWidth: "100px",
                  }}
                >
                  No image available
                </div>
              ) : (
                <img
                  src={venue.media[0]?.url}
                  alt={venue.media[0]?.alt || "No image available"}
                  className="h-12 w-12 rounded-full object-cover"
                  style={{
                    maxHeight: "100px",
                    maxWidth: "100px",
                    objectFit: "cover",
                  }}
                />
              )}

              <span className="ml-4 text-sm font-medium text-gray-800">{venue.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
