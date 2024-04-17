import React from 'react'
import "../App.css"

const SearchResultCountry = ({ result, setCountry,setList, setListCity, setCity,setSelectedCountry }) => {
  
  const ciao = () => {
    setCountry(result.name)
    setList([])
    setListCity([])
    setCity("")
    setSelectedCountry(true)
  }
  return (
    <div className='search-result-country' onClick={ciao}>{result.name}</div>
  )
}

export default SearchResultCountry