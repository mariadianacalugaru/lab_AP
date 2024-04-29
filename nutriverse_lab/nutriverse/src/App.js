import MyFoodPlan from "./pages/MyFoodPlan";
import MyProfile from "./pages/MyProfile";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Nutritionists from "./pages/Nutritionists";
import { Route, Routes } from "react-router-dom"
import Navbar from "./component/Navbar";
import 'react-chat-elements/dist/main.css'
import { useState,useEffect } from 'react'
import Admin from "./pages/Admin";
import Booking from "./pages/Booking";
import axios from "axios"


function App() {
  const [sid, setSid] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    // Define your async function
    async function get_info() {
      const configuration = {
        method: "post",
        url: "http://localhost:4000/session_info",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://localhost:4000",
        },
        withCredentials:true,
      };
      try {
        await axios(configuration)
          .then(res => {
            if (res.data == "No account") {
              return "";
            }
            else {
              console.log(res)
              
              setSid(res.data.user.firstname+" "+res.data.user.lastname);
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
      <Navbar sid={sid} setSid={setSid} />
    
      <Routes>
      <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home setSid={setSid}/>} />
          <Route path="/MyProfile" element={<MyProfile setSid={setSid}/>} />
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
