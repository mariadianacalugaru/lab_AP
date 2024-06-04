import React, { useState } from 'react'
import SearchBar from './SearchBar'
import SearchResultsList from './SearchResultsList';
const SearchBarComponent = ({city, setCity}) => {
  const [results, setResults] = useState([]);
    return (
      <div className='SearchBarComponent'>
          <SearchBar setResults={ setResults} city={city} setCity={setCity}/>
          <SearchResultsList results={results} city={city} setCity={setCity}/>
          
    </div>
  )
}

export default SearchBarComponent