import React from 'react'
import "../App.css"

const SearchResultCountry = ({ result, setCountry,setList, setListCity, setCity }) => {
  
  const ciao = () => {
    setCountry(result.name)
    setList([])
    setListCity([])
    setCity("")
  }
  return (
    <div className='search-result-country' onClick={ciao}>{result.name}</div>
  )
}

export default SearchResultCountry