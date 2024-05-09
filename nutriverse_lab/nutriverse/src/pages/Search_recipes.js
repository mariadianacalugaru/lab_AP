import React, {useEffect, useState } from 'react'
import './css/Home.css'
import './css/Recipes.css';
import axios from 'axios'
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from 'react-bootstrap/Button';




const Search_recipes = ({}) => {
    return (
      <>
        <div className="home-background">      
          <div className='full_div'>
            <div className='search'>
                <Form.Control className='keywords' placeholder='type some key words' />
                <Button >Get recipes suggestions</Button>
            </div>
          </div>
        </div> 
      </>
  )
}

export default Search_recipes