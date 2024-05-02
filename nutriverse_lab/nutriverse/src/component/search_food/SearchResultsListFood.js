import React from 'react'
import "../../App.css"
import SearchResultFood from './SearchResultFood'

const SearchResultsListFood = ({results, setIngredient, setSelectedFood, setListFoods, addItem}) => {
  return (
      <div className='results-list-country'>
          {
              results.map((result, id) => {
                  return <SearchResultFood result={result} setListFoods={setListFoods} setIngredient={setIngredient} setSelectedFood={setSelectedFood} addItem={addItem} key={id} />
              }
              )
          }
      </div>
  )
}

export default SearchResultsListFood