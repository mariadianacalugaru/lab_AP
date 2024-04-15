import React, { useState,useEffect } from 'react'
import './css/Home.css'
import SearchBarComponent from '../component/SearchBarComponent'
import Logo_home from '../assets/scritta.png'
import { useLocation } from "react-router-dom";
import axios from 'axios'
import Cookies from "js-cookie";
const Home = () => {
  const [info, setInfo] = useState(false)
  const[firstname,setFirstname] = useState("")


 

  useEffect(() => {
    // Define your async function
    async function get_info() {
      const configuration = {
        method: "post",
        url: "http://localhost:4000/user_informations",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:4000",
        },
        data: {
          _id: Cookies.get("_id"),
        },
      };
      try {
        await axios(configuration)
          .then(res => {
            if (res.data == "No account") {
              return "";
            }
            else {
              setInfo(true);
              setFirstname(res.data)
            }
          })
          .catch(event => {
            console.log(event);
          })
  
      }
      catch (event) {
        console.log(event);
  
      }
    }
    // Call the async function
    get_info();
  },);

    return (
      <>
        <div className="home-background">
        <center><div  className='logo-home'><img src={Logo_home} alt="Nutriverse"></img></div>
        </center>
          <div className="search-bar"><SearchBarComponent /></div>
          <h1>{info && firstname}</h1>
        </div> 
      </>
  )
}

export default Home