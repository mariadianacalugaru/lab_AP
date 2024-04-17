import React from 'react'
import "../App.css"

const SearchResult = ({result}) => {
    return (
        <div className='search-result' onClick={(e)=>alert(`You clicked on ${result.firstname}`)}>{result.firstname+" "+result.lastname}</div>
  )
}

export default SearchResult