import React from 'react'
import "../App.css"

const SearchResult = ({result, setCity}) => {
    const ciao = () => {
      setCity(result)
    }

    return (
        <div className='search-result'  onClick={ciao}>{result}</div>
  )
}

export default SearchResult