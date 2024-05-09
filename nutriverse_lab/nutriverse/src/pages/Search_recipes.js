import React, {useEffect, useState } from 'react'
import './css/Home.css'
import './css/Recipes.css';
import axios from 'axios'
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from 'react-bootstrap/Button';
import ListGroup from "react-bootstrap/ListGroup";




const Search_recipes = ({setSid}) => {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState([])

    const chngFn = (event) => {
        const { name, value } = event.target;
        setQuery(value);;
    };



    async function print_recipe(){
        console.log(query)
    }



    async function search_recipe(){
        const requestData = query;
        const configuration = {
          method: "get",
          url: "https://api.edamam.com/api/recipes/v2",
    
          headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            
          },
          params: {
            app_id: '9fda4e6f',
            app_key: '8cd66b32159b147b399db440e3773c57',
            type: 'public',
            q: requestData
          }, 
        };
    
        try {
          await axios(configuration)
            .then(res => {
              //console.log(res.data)
              setResult(res.data.hits)
              console.log(result)
              //console.log(res.data.hits)
            })
            .catch(event => {
              alert("wrong details")
              console.error(event);
            })
    
        }
        catch (event) {
          console.log(event);
    
        }
    }






    return (
      <>
        <div className="home-background">      
          <div className='full_div'>
            <h4>Search for recipes suggestions ... </h4>
            
            <div className='search'>
                <Form.Control className='keywords' placeholder='type some key words' value={query} onChange={chngFn}/>
                <Button onClick={() => search_recipe()}> Get recipes suggestions</Button>
            </div>
            <div className="receipes_cont"> 
            {result.map((item, index) => {
                      return (
                          <div className="receipe">
                              <ListGroup.Item variant="light" style={{ display: "flex", }}>
                                    <img src = {item.recipe.image} className="rec_image"></img>
                                    <div className="rec_info">
                                        <div className="rec_name">{item.recipe.label}</div>
                                        Ingredients:
                                        <div>{item.recipe.ingredientLines.map((ingredient,index) => {
                                            return (<div>- {ingredient}</div>)
                                        })}</div>
                                    </div>
                                    <div className="rec_values">
                                        <ListGroup.Item className="cals" variant="light" style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div >Calories</div>
                                            <div> {parseInt(item.recipe.totalNutrients.ENERC_KCAL.quantity)} {item.recipe.totalNutrients.ENERC_KCAL.unit}</div>
                                        </ListGroup.Item>
                                        <ListGroup.Item  className="val" variant="light" style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div >Fats</div>
                                            <div> {parseInt(item.recipe.totalNutrients.FAT.quantity)} {item.recipe.totalNutrients.FAT.unit}</div>
                                        </ListGroup.Item>
                                        <ListGroup.Item  className="val" variant="light" style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div >Proteins</div>
                                            <div> {parseInt(item.recipe.totalNutrients.PROCNT.quantity)} {item.recipe.totalNutrients.PROCNT.unit}</div>
                                        </ListGroup.Item>
                                        <ListGroup.Item  className="val" variant="light" style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div >Cholesterol</div>
                                            <div> {parseInt(item.recipe.totalNutrients.CHOLE.quantity)} {item.recipe.totalNutrients.CHOLE.unit}</div>
                                        </ListGroup.Item>
                                        <ListGroup.Item  className="val" variant="light" style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div >Sugar</div>
                                            <div> {parseInt(item.recipe.totalNutrients.SUGAR.quantity)} {item.recipe.totalNutrients.SUGAR.unit}</div>
                                        </ListGroup.Item>
                                        <ListGroup.Item  variant="light" style={{ display: "flex", justifyContent: "space-between" }}>
                                        </ListGroup.Item>       
                                                                        
                                    </div>
                              </ListGroup.Item>
                          </div>
                      );
                  })}
                    
            </div>
          </div>
        </div> 
      </>
  )
}

export default Search_recipes