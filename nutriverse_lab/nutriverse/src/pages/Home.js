import React from 'react'
import './css/Home.css'
import SearchBarComponent from '../component/SearchBarComponent'
import Logo_home from '../assets/scritta.png'
import { useLocation } from "react-router-dom";

const Home = () => {
  const location = useLocation();
  const data = location.state
    return (
      <>
        <div className="home-background">
        <center><div  className='logo-home'><img src={Logo_home} alt="Nutriverse"></img></div>
        </center>
          <div className="search-bar"><SearchBarComponent /></div>
          <h1>{data && data.firstname}</h1>
        </div> 
      </>
  )
}

export default Home