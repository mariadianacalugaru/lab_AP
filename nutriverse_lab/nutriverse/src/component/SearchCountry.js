import React, { useState } from 'react'
import SearchBarCountry from './SearchBarCountry';
import SearchResultsListCountry from './SearchResultsListCountry';

const SearchCountry = ({country,setCountry, setListCity, setCity}) => {
  const [list, setList] = useState([]);
      return (
        <div className='SearchCountryComponent'>
          <SearchBarCountry setResults={setList} country={country} setCountry={setCountry} setCity={setCity}/>
          <SearchResultsListCountry setCountry={setCountry} results={list} setList={setList} setListCity={setListCity} setCity={setCity}/>        
      </div>
    )
  }
export default SearchCountry