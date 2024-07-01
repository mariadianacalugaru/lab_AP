import { Link, useMatch, useResolvedPath } from "react-router-dom"
import Logo from "../assets/logo-removebg-preview.png"
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useState, useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";
import { GiProgression } from "react-icons/gi";
import { GiKnifeFork } from "react-icons/gi";
import { PiBowlFoodFill } from "react-icons/pi";
import { FaUserDoctor } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GiFat } from "react-icons/gi";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";

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
        CometChatUIKit.logout();
        
        const configuration = {
            method: "post",
            url: "https://nginx_reverse_proxy/api/logout",
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "https://nginx_reverse_proxy/api/",
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
            {(sid != "") && <CustomLink to="/Search_recipes"><PiBowlFoodFill className="icon" />Recipes</CustomLink>}
            {!is_nutritionist && <CustomLink to="/Nutritionists"><FaUserDoctor className="icon" />Nutritionists</CustomLink>}
            {is_nutritionist && <CustomLink to="/Appointments"><FaRegCalendarAlt className="icon" />Appointments</CustomLink>}
            {(sid != "" && !is_nutritionist) && <CustomLink to="/MyProgress"><GiProgression className="icon" /> Progress</CustomLink>}
            {(sid != "" && !is_nutritionist) && <CustomLink to="/MyFoodPlan"><GiKnifeFork className="icon" />MyFoodPlan</CustomLink>}
            {(sid != "" && is_nutritionist) && <CustomLink to="/MyPatients"><GiFat className="icon" />MyPatients</CustomLink>}
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

            <div id="sidebar" onClick={() => closeNav()}>
                <ul>
                    <div className="closebtn" onClick={() => closeNav()}><MdClose /></div>
                    {(sid != "") && <CustomLink onClick={() => closeNav()} to="/MyProfile">
                        <FaRegUser /> {sid}
                    </CustomLink>}
                    {!is_nutritionist && <CustomLink to="/Nutritionists" onClick={() => closeNav()}><FaUserDoctor className="icon" />Nutritionists</CustomLink>}
                    {is_nutritionist && <CustomLink to="/Appointments"><FaRegCalendarAlt  className="icon" />Appointments</CustomLink>}

                    {(sid != "" && !is_nutritionist) && <CustomLink onClick={() => closeNav()} to="/MyFoodPlan"><GiKnifeFork className="icon" />MyFoodPlan</CustomLink>}
                    {(sid != "" && !is_nutritionist) && <CustomLink to="/MyProgress"><GiProgression className="icon" /> Progress</CustomLink>}
                    {(sid != "") && <CustomLink to="/Search_recipes"><PiBowlFoodFill className="icon" />Recipes</CustomLink>}
                    {(sid != "" && is_nutritionist) && <CustomLink to="/MyPatients"><GiFat className="icon" />MyPatients</CustomLink>}
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

