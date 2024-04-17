import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import SearchResultCity from './search_city/SearchResultCity';


const SearchBarCountry = ({setResults,country,setCountry, setCity}) => {
    
    const fetchData = async (value) => {
          await fetch("https://countriesnow.space/api/v0.1/countries/states")
            .then(response => response.json())
              .then(json => {
                  const results = json.data.filter((state) => {
                    return state &&  state.name.toLowerCase().startsWith(value.toLowerCase())
                });
                setResults(results);

            });
    }


    
    const handleChange = (value) => {
        setCountry(value);
        setCity("");
        fetchData(value);
    }
    
  return (
      <div className='input-wrapper'>
          <FaSearch id="search-icon-country" />
          <input id="input" placeholder='Choose the country of your study'
              value={country}
              onChange={(e) => handleChange(e.target.value)}
              
          />
      </div>
  )
}

export default SearchBarCountry