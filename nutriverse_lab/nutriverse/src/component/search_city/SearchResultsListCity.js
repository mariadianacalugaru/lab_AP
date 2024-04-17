import React from 'react'
import "../../App.css"
import SearchResultCity from './SearchResultCity'

const SearchResultsListCity = ({results,setCity,setList}) => {
  return (
      <div className='results-list-country'>
          {
              results.map((result, id) => {
                  return <SearchResultCity setCity={setCity} setList={setList} result={result} key={id} />
              }
              )
          }
      </div>
  )
}

export default SearchResultsListCity