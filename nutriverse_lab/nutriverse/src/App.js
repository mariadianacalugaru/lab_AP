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
import MyPatients from "./pages/MyPatients"
import Create_foodplan from "./pages/Create_foodplan"
import Search_recipes from "./pages/Search_recipes"
import Appointment from "./component/Appointment";
import Progress from "./pages/Progress";
import See_progress from "./pages/See_progress";
import Review from "./pages/Review";

function App() {
  const [sid, setSid] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const[is_nutritionist,setIs_nutritionist] = useState(false)

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
              setIs_nutritionist(res.data.user.is_nutritionist)
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
      <Navbar sid={sid} setSid={setSid} is_nutritionist={is_nutritionist} />
      <Routes>
      <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Home sid= {sid} setSid={setSid}/>} />
          <Route path="/MyProfile" element={<MyProfile setSid={setSid} setIs_nutritionist={setIs_nutritionist}/>} />
        <Route path="/MyFoodPlan" element={<MyFoodPlan />} />
        <Route path="/MyPatients" element={<MyPatients is_nut={is_nutritionist} />} />
        <Route path="/Nutritionists" element={<Nutritionists setName={setName} setEmail={setEmail} />} />
          <Route path="/Login" element={<Login />} />
        <Route path="/Chat" element={<Chat />} />
        <Route path="/Booking" element={<Booking name={name} email={email} />} />
        <Route path="/Create_foodplan" element={<Create_foodplan setSid={setSid} setIs_nutritionist={setIs_nutritionist}/>} />
        <Route path="/Search_recipes" element={<Search_recipes />} />
        <Route path="/Appointments" element={<Appointment />} />
        <Route path="/MyProgress" element={<Progress />} />
        <Route path="/see_progress" element={<See_progress />} />
        <Route path="/reviews" element={<Review />} />
      </Routes>
      
    </>
    
    
  )
}

export default App;
