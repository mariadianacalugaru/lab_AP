import React from 'react'
import "../App.css"

const SearchResultCountry = ({ result, setCountry,setList }) => {
  
  const ciao = () => {
    
    setCountry(result.name)
    setList([])
  }
  return (
    <div className='search-result-country' onClick={ciao}>{result.name}</div>
  )
}

export default SearchResultCountry