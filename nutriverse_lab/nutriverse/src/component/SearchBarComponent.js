import React, { useState } from 'react'
import SearchBar from './SearchBar'
import SearchResultsList from './SearchResultsList';
//import { set } from 'mongoose';

const SearchBarComponent = ({city, setCity, get_nutritionists, listCities, setListCities}) => {
  //const [results, setResults] = useState([]);
    return (
      <div className='SearchBarComponent'>
          <SearchBar setResults={setListCities} city={city} setCity={setCity} get_nutritionists={get_nutritionists} />
          <SearchResultsList results={listCities} city={city} setCity={setCity} setListCities={setListCities}get_nutritionists={get_nutritionists} />
          
    </div>
  )
}

export default SearchBarComponent