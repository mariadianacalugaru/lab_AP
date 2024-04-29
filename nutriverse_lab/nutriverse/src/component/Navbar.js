import { Link, useMatch, useResolvedPath } from "react-router-dom"
import Logo from "../assets/logo-removebg-preview.png"
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useState,useEffect } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom"


export default function Navbar({ sid, setSid, is_nutritionist }) {

    const history = useNavigate();

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
            <CustomLink to="/Nutritionists">Nutritionists</CustomLink>
            
            {(sid != "" && !is_nutritionist) && <CustomLink to="/MyFoodPlan">MyFoodPlan</CustomLink>}
            {(sid != "" && is_nutritionist) && <CustomLink to="/MyProfile#myfoodplan">MyPatients</CustomLink>}
            
            {(sid != "") && <CustomLink to="/MyProfile">
                <FaRegUser /> {sid}
            </CustomLink>}
            {(sid != "") && <CustomLink className="Login" to="/" onClick={logout}>
                <CiLogout /> Logout
            </CustomLink>}
            {(sid == "" && window.location.pathname != "/Login") && <CustomLink to="/Login" className="Login" >
                <FaRegUser /> Login
            </CustomLink>}
        </ul>
    </nav></>
}

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