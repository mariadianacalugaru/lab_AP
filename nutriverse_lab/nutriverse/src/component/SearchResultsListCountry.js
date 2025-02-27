import React from 'react'
import "../App.css"
import SearchResultCountry from './SearchResultCountry'
const SearchResultsListCountry = ({results,setCountry,setList, setListCity, setCity,setSelectedCountry}) => {
  return (
      <div className='results-list-country'>
          {
              results.map((result, id) => {
                  return <SearchResultCountry setCountry={setCountry} setList={setList} setListCity={setListCity} setCity={setCity} setSelectedCountry={setSelectedCountry} result={result} key={id} />
              }
              )
          }
      </div>
  )
}

export default SearchResultsListCountry