import React, { useState } from 'react'
import SearchBarFood from './SearchBarFood'
import SearchResultsListFood from './SearchResultsListFood';

const SearchBarComponentFood = ({ingredient, setIngredient, listFoods, setListFoods, selectedFood, setSelectedFood, addItem}) => {
  //const [results, setResults] = useState([]);
    return (
      <div className='SearchCountryComponent'>
          <SearchBarFood setResults={setListFoods} ingredient={ingredient} setIngredient={setIngredient} selectedFood={selectedFood} setSelectedFood={setSelectedFood} addItem={addItem} />
          <SearchResultsListFood results={listFoods} setIngredient={setIngredient} setSelectedFood={setSelectedFood} setListFoods={setListFoods} addItem={addItem}/>
          
    </div>
  )
}

export default SearchBarComponentFood