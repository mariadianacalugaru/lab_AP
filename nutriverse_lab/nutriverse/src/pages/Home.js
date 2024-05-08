import React, {useEffect, useState } from 'react'
import './css/Home.css'
import SearchBarComponent from '../component/SearchBarComponent'
import Logo_home from '../assets/scritta.png'
import axios from 'axios'




const Home = ({setSid}) => {
 

  

    return (
      <>
        <div className="home-background">      
        <center>
          <div className='logo-home'><img src={Logo_home} alt="Nutriverse"></img></div>
          <div className="search-bar"><SearchBarComponent /></div>
        </center>
        </div> 
      </>
  )
}

export default Home