import React from 'react'
import './css/Home.css'
import SearchBarComponent from '../component/SearchBarComponent'
import Logo_home from '../assets/scritta.png'


const Home = () => {
    return (
      <>
        
        <div className="home-background">
        <center><div  className='logo-home'><img src={Logo_home} alt="Nutriverse"></img></div>
        Ciao ciaco caico
        </center>
          <div className="search-bar"><SearchBarComponent/></div>
      
        </div> 
      </>
  )
}

export default Home