import { Link, useMatch, useResolvedPath } from "react-router-dom"
import Logo from "../assets/logo-removebg-preview.png"
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import "../pages/css/Sidebar.css"
export default function Navbar({ sid, setSid, is_nutritionist }) {
    function CustomLink({ to, children, ...props }) {
        const resolvedPath = useResolvedPath(to)
        const isActive = useMatch({ path: resolvedPath.pathname, end: true })
        return (
            <li className={isActive ? "active" : ""} >
                <Link to={to} {...props}>
                    {children}
                </Link>
            </li>
        )


    }
    const history = useNavigate();
    const [selected_sidebar, setSelected] = useState(false)
    const show_sidebar = () => {
        document.getElementById("hamburger_nutriverse").style.width = "250px";
    }

    const closeNav = () => {
        document.getElementById("hamburger_nutriverse").style.width = "0px";

    }

    async function logout() {
        const configuration = {
            method: "post",
            url: "http://localhost:4000/logout",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "http://localhost:4000",
            }
        };

        try {
            await axios(configuration)
                .then(res => {
                    if (res.data == "Ok.") {
                        window.location.reload()
                    }
                })
                .catch(event => {
                    alert("wrong details")
                    console.log(event);
                })

        }
        catch (event) {
            console.log(event);

        }

    }
    return <><nav className="nav_nutriverse">
        <Link to="/" >
            <img src={Logo} className="Logo" alt="Nutriverse" ></img>
        </Link>
        <ul>
            {(sid != "") && <CustomLink to="/Search_recipes">Recipes</CustomLink>}
            {!is_nutritionist && <CustomLink to="/Nutritionists">Nutritionists</CustomLink>}
            <CustomLink to="/Appointments">Appointments</CustomLink>
            {(sid != "" && !is_nutritionist) && <CustomLink to="/MyFoodPlan">MyFoodPlan</CustomLink>}
            {(sid != "" && is_nutritionist) && <CustomLink to="/MyPatients">MyPatients</CustomLink>}

            {(sid != "") && <CustomLink to="/MyProfile">
                <FaRegUser /> {sid}
            </CustomLink>}
            {(sid != "") && <CustomLink to="/" onClick={logout}>
                <CiLogout /> Logout
            </CustomLink>}
            {(sid == "" && window.location.pathname != "/Login") && <CustomLink to="/Login" className="Login" >
                <FaRegUser /> Login
            </CustomLink>}
            <div onClick={() => show_sidebar()} className="logo"><RxHamburgerMenu /></div>
        </ul>
    </nav>
        <div id="hamburger_nutriverse">

            <div id="sidebar" >
                <ul>
                    <div className="closebtn" onClick={() => closeNav()}><MdClose /></div>
                    {(sid != "") && <CustomLink onClick={() => closeNav()} to="/MyProfile">
                        <FaRegUser /> {sid}
                    </CustomLink>}
                    {!is_nutritionist && <CustomLink to="/Nutritionists">Nutritionists</CustomLink>}
                    <CustomLink to="/Appointments">Appointments</CustomLink>
                    {(sid != "" && !is_nutritionist) && <CustomLink onClick={() => closeNav()} to="/MyFoodPlan">MyFoodPlan</CustomLink>}
                    {(sid != "" && is_nutritionist) && <CustomLink onClick={() => closeNav()} to="/MyPatients">MyPatients</CustomLink>}
                    {(sid != "") && <CustomLink to="/" id="logout" onClick={logout}>
                        <CiLogout /> Logout
                    </CustomLink>}
                    {(sid == "" && window.location.pathname != "/Login") && <CustomLink onClick={() => closeNav()} to="/Login" className="Login" >
                        <FaRegUser /> Login
                    </CustomLink>}
                </ul>
            </div>
        </div>
    </>
}

