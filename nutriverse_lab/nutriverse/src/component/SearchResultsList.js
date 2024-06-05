import React from 'react'
import "../App.css"
import SearchResult from './SearchResult'
const SearchResultsList = ({results, setCity, get_nutritionists, setListCities}) => {
  return (
      <div className='results-list'>
          {
              results.map((result, id) => {
                  return <SearchResult result={result} setListCities={setListCities} setCity={setCity} get_nutritionists={get_nutritionists} key={id} />
              }
              )
          }
      </div>
  )
}

export default SearchResultsList