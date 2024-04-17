import React, { useState } from 'react'
import SearchBarCountry from './SearchBarCountry';
import SearchResultsListCountry from './SearchResultsListCountry';

const SearchCountry = ({country,setCountry, setListCity, setCity,setSelectedCountry}) => {
  const [list, setList] = useState([]);
      return (
        <div className='SearchCountryComponent'>
          <SearchBarCountry setResults={setList} country={country} setCountry={setCountry} setCity={setCity} setListCity={setListCity} setSelectedCountry={setSelectedCountry} />
          <SearchResultsListCountry setCountry={setCountry} results={list} setList={setList} setListCity={setListCity} setCity={setCity} setSelectedCountry={setSelectedCountry} />        
      </div>
    )
  }
export default SearchCountry