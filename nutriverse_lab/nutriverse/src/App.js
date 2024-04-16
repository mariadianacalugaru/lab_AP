import MyFoodPlan from "./pages/MyFoodPlan";
import MyProfile from "./pages/MyProfile";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom"
import Navbar from "./component/Navbar";
import Cookies from 'js-cookie';
import { useState, useEffect } from 'react'

function App() {
  const [sid,setSid] = useState("Logout")

  return (
    <>
      <Navbar sid={sid}/>
    
        <Routes>
        <Route path="/" element={<Home setSid={setSid}/>} />
          <Route path="/MyProfile" element={<MyProfile />} />
          <Route path="/MyFoodPlan" element={<MyFoodPlan />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      
       </>
    
    
  )
}

export default App;
