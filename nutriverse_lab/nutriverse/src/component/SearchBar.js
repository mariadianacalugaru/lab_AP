import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { useState } from 'react'


const SearchBar = ({setResults, city, setCity}) => {
    const [input, setInput] = useState("");

      const fetchData = (value) => {
        fetch("http://localhost:4000/search_nutritionists_cities")
            .then(response => response.json())
            .then(json => {
                const results = json.filter((city) => {
                    return value
                        && (city.toLowerCase().startsWith(value.toLowerCase()))
                });
                setResults(results);
            });
    }


    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    }
    
  return (
      <div className='input-wrapper'>
          <FaSearch id="search-icon" />
          <input placeholder='Search for nutritionist'
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              
          />
      </div>
  )
}

export default SearchBar