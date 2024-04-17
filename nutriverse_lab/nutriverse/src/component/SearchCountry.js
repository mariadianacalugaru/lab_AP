import React, { useState } from 'react'
import SearchBarCountry from './SearchBarCountry';
import SearchResultsListCountry from './SearchResultsListCountry';

const SearchCountry = ({country,setCountry}) => {
  const [list, setList] = useState([]);
      return (
        <div className='SearchCountryComponent'>
          <SearchBarCountry setResults={setList} country={country} setCountry={setCountry}/>
          <SearchResultsListCountry setCountry={setCountry} results={list} setList={setList} />
          <h1>{country}</h1>
            
      </div>
    )
  }
export default SearchCountry