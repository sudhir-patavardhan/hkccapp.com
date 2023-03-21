import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function AutocompleteTextbox() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef();

  // Fetch results from the API
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.post(
          'https://h878q1k811.execute-api.us-west-2.amazonaws.com/Prod/vaccine',
          { vaccineName: search }
        );
        setResults(JSON.parse(response.data));// Assuming the API returns an array of results
         // alert(JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching results:', error);
      }
    };

    if (search) {
      fetchResults();
    }
  }, [search]);

  // Hide results when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef}>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setShowResults(true);
        }}
        placeholder="Vaccine"
      />
      {showResults && (
        <ul>
          {
              results.map((result) => (
            <li
              key={result.vaccineName} // Replace 'id' with the unique identifier from your API results
              onClick={() => {
                setSearch(result.vaccineName);
                setShowResults(false);
              }}
            >
              {result.vaccineName} 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AutocompleteTextbox;

