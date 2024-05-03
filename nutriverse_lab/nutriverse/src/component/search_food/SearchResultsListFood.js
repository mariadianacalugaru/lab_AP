import React from 'react'
import "../../App.css"
import SearchResultFood from './SearchResultFood'

const SearchResultsListFood = ({results, setIngredient, setSelectedFood, setListFoods, addItem, day, meal}) => {
  return (
      <div className='results-list-country'>
          {
              results.map((result, id) => {
                  return <SearchResultFood result={result} setListFoods={setListFoods} setIngredient={setIngredient} setSelectedFood={setSelectedFood} addItem={addItem} key={id} day={day} meal={meal}/>
              }
              )
          }
      </div>
  )
}

export default SearchResultsListFood