import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'


const SearchBarCity = ({setResults,country,city,setCity}) => {
    
    const fetchData = async (value) => {
          await fetch("https://countriesnow.space/api/v0.1/countries/cities",{
            method: "POST",
            mode: 'cors', 
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "http://localhost:3000",
            },
            referrerPolicy: 'no-referrer',
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
          <input id="input" placeholder='Choose the city of your study'
              value={city}
              onChange={(e) => handleChange(e.target.value)}
              
          />
      </div>
  )
}

export default SearchBarCity