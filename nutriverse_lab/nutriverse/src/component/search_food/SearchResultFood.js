import React from 'react'
import "../../App.css"

const SearchResultsFood = ({result, setIngredient, setSelectedFood, setListFoods, addItem}) => {
    const ciao = () => {
        setIngredient(result.Name);
        setSelectedFood(true);
        setListFoods([]);
        addItem("Monday","Breakfast",result.Name,"");
        setIngredient("")
      }

    return (
        <div className='search-result-country' onClick={ciao}>{result.Name}</div>
  )
}

export default SearchResultsFood