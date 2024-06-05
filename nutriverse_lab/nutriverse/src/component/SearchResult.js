import React from 'react'
import "../App.css"

const SearchResult = ({result, setCity, get_nutritionists, setListCities}) => {
    const ciao = () => {
      setCity(result)
      get_nutritionists(result)
      setListCities([]);
    }

    return (
        <div className='search-result'  onClick={ciao}>{result}</div>
  )
}

export default SearchResult