import React, { useState } from 'react'
import SearchBarCity from './SearchBarCity';
import SearchResultsListCity from './SearchResultsListCity';

const SearchCity = ({country, city, setCity, listCity, setListCity}) => {
      return (
        <div className='SearchCountryComponent'>
          <SearchBarCity setResults={setListCity} country={country} city={city} setCity={setCity}/>
          <SearchResultsListCity setCity={setCity} results={listCity} setList={setListCity} />
      </div>
    )
  }
export default SearchCity