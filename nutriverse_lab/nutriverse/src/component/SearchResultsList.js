import React from 'react'
import "../App.css"
import SearchResult from './SearchResult'
const SearchResultsList = ({results, setCity}) => {
  return (
      <div className='results-list'>
          {
              results.map((result, id) => {
                  return <SearchResult result={result} setCity={setCity} key={id} />
              }
              )
          }
      </div>
  )
}

export default SearchResultsList