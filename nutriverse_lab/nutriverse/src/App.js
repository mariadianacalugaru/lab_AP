import MyFoodPlan from "./pages/MyFoodPlan";
import MyProfile from "./pages/MyProfile";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Nutritionists from "./pages/Nutritionists";
import { Route, Routes } from "react-router-dom"
import Navbar from "./component/Navbar";
import 'react-chat-elements/dist/main.css'
import { useState } from 'react'
import Admin from "./pages/Admin";
import Booking from "./pages/Booking";



function App() {
  const [sid, setSid] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  
  return (
    <>
      <Navbar sid={sid} setSid={setSid} />
    
      <Routes>
      <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home setSid={setSid}/>} />
          <Route path="/MyProfile" element={<MyProfile />} />
          <Route path="/MyFoodPlan" element={<MyFoodPlan />} />
        <Route path="/Nutritionists" element={<Nutritionists setName={setName} setEmail={setEmail} />} />
          <Route path="/Login" element={<Login />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/Booking" element={<Booking name={name} email={email} />} />
        </Routes>
      
       </>
    
    
  )
}

export default App;
