import React from 'react'
import { FaSearch } from 'react-icons/fa'
import { useState } from 'react'


const SearchBar = ({setResults}) => {
    const [input, setInput] = useState("");

    /*const fetchData = (value) => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then(response => response.json())
            .then(json => { 
                const results = json.filter((user) => {
                    return value
                        && user
                        && user.name
                        && user.name.toLowerCase().includes(value)
                });
                console.log(results);
                setResults(results );
            });
        
    }*/

    
      const fetchData = (value) => {
        fetch("http://localhost:4000/search_nutritionists")
            .then(response=>response.json())
            .then(json=>{

                const results = json.filter((user) => {
                //alert(user)
                return value && user.firstname;
                   
            });
            setResults(results);
            });
    
            /*.then(response => response.json())
            .then(json => { 
                const results = json.filter((user) => {
                    return value
                        && user
                        && user.firstname
                        && user.firstname.toLowerCase().includes(value)
                });
                console.log(results);
                setResults(results);
            });*/
        
    }

    const handleChange = (value) => {
        setInput(value);
        fetchData(value);
    }
    
  return (
      <div className='input-wrapper'>
          <FaSearch id="search-icon" />
          <input placeholder='Search for nutritionist'
              value={input}
              onChange={(e) => handleChange(e.target.value)}
              
          />
      </div>
  )
}

export default SearchBar