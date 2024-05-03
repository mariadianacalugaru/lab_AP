import React from 'react'
import { FaRegPlusSquare } from "react-icons/fa";
import { useState } from 'react'


const SearchBarFood = ({setResults, ingredient, setIngredient, setSelectedFood, setListFoods}) => {
    

      const fetchData = (value) => {
        fetch("http://localhost:4000/search_food")
            .then(response => response.json())
            .then(json => {
                const results = json.filter((ingredient) => {
                    return value
                        && ingredient
                        && ingredient.Name
                        && (ingredient.Name).toLowerCase().startsWith(value.toLowerCase())
                });
                setResults(results);
            });
    }


    
    const handleChange = (value) => {
        setIngredient(value);
        setSelectedFood(false)
        fetchData(value);
    }
    
  return (
      <div className='input-wrapper'>
          <FaRegPlusSquare id="plus-icon" />
          <input autoFocus={true} type="text" id="input" placeholder='Add an ingredient'
              value={ingredient}
              onChange={(e) => handleChange(e.target.value)}
              
          />
      </div>
  )
}

export default SearchBarFood