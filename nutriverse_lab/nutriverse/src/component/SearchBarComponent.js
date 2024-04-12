import React, { useState } from 'react'
import SearchBar from './SearchBar'
import SearchResultsList from './SearchResultsList';
const SearchBarComponent = () => {
    const [results, setResults] = useState([]);
    return (
      <div className='SearchBarComponent'>
          <SearchBar setResults={ setResults} />
          <SearchResultsList results={results} />
          
    </div>
  )
}

export default SearchBarComponent