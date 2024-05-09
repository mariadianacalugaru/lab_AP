import React, { useEffect, useState } from 'react'
import SearchBarFood from './SearchBarFood'
import SearchResultsListFood from './SearchResultsListFood';

const SearchBarComponentFood = ({elements,ingredient, setIngredient, listFoods, setListFoods, selectedFood, setSelectedFood, addItem, day, meal}) => {
  //const [results, setResults] = useState([]);
  useEffect(() => {
    console.log(elements)
  });
    return (
      <div className='SearchCountryComponent'>
          <SearchBarFood setResults={setListFoods} ingredient={ingredient} setIngredient={setIngredient} selectedFood={selectedFood} setSelectedFood={setSelectedFood} addItem={addItem} day={day} meal={meal}/>
          <SearchResultsListFood results={listFoods} setIngredient={setIngredient} setSelectedFood={setSelectedFood} setListFoods={setListFoods} addItem={addItem} day={day} meal={meal}/>
          
    </div>
  )
}

export default SearchBarComponentFood