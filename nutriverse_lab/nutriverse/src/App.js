import MyFoodPlan from "./pages/MyFoodPlan";
import MyProfile from "./pages/MyProfile";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom"
import Navbar from "./component/Navbar";
import SearchBarComponent from "./component/SearchBarComponent";

function App() {

  return (
    <>
      <Navbar />
    
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/MyProfile" element={<MyProfile />} />
          <Route path="/MyFoodPlan" element={<MyFoodPlan />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      
       </>
    
    
  )
}

export default App;
