import React from 'react'
import "../../App.css"

const SearchResultCity = ({ result, setCity,setList }) => {
  
  const ciao = () => {
    setCity(result)
    setList([])
  }
  return (
    <div className='search-result-country' onClick={ciao}>{result}</div>
  )
}

export default SearchResultCity