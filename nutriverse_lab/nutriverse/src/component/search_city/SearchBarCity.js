import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'


const SearchBarCity = ({setResults,country,city,setCity,selectedCountry,setSelectedCountry}) => {
    
    const fetchData = async (value) => {
          await fetch("https://countriesnow.space/api/v0.1/countries/cities",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({"country": country})
          })
            .then(response => response.json())
            .then(json => {
              const results = json.data.filter((city) => { 
                    return city && city.toLowerCase().startsWith(value.toLowerCase())
                });
                setResults(results);
            })

            };
    


    const handleChange = (value) => {
        setCity(value);
        fetchData(value);
    }
    
  return (
      <div className='input-wrapper'>
          <FaSearch id="search-icon-country" />
          {selectedCountry && <input id="input" placeholder='Choose the city of your study'
              value={city}
              onChange={(e) => handleChange(e.target.value)}
              
          />}
      </div>
  )
}

export default SearchBarCity