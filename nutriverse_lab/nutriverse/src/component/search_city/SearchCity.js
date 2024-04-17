import React, { useState } from 'react'
import SearchBarCity from './SearchBarCity';
import SearchResultsListCity from './SearchResultsListCity';

const SearchCity = ({country, city, setCity, listCity, setListCity, selectedCountry,setSelectedCountry}) => {
      return (
        <div className='SearchCountryComponent'>
          <SearchBarCity setResults={setListCity} country={country} city={city} setCity={setCity} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}/>
          <SearchResultsListCity setCity={setCity} results={listCity} setList={setListCity} />
      </div>
    )
  }
export default SearchCity