import React from 'react'
import "../../App.css"

const SearchResultsFood = ({result, setIngredient, setSelectedFood, setListFoods, addItem, day, meal}) => {
    const ciao = () => {
        setIngredient(result.Name);
        setSelectedFood(true);
        setListFoods([]);
        //addItem(day, meal ,result.Name,"");
        //setIngredient("")
      }

    return (
        <div className='search-result-country' onClick={ciao}>{result.Name}</div>
  )
}

export default SearchResultsFood