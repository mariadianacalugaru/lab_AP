import {Link,useMatch,useResolvedPath} from "react-router-dom"
import Logo from "../assets/logo-removebg-preview.png"
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useState } from "react";



export default function Navbar() {
    const [logged, setLogged] = useState(false);

    function login() {
        setLogged((logged) => !logged);
    }
    return <><nav className="nav">
        <Link to="/" >
            <img src={Logo} className="Logo" alt="Nutriverse" ></img>
        </Link>
        <ul>
            {logged && <CustomLink to="/MyProfile">MyProfile</CustomLink>}
            {logged && <CustomLink to="/MyFoodPlan">MyFoodPlan</CustomLink>}
            {logged && <CustomLink to="/" className="Login" onClick={login}>
                <CiLogout /> Logout
            </CustomLink>}
            {!logged && <CustomLink to="/Login" className="Login" onClick={login}>
                <FaRegUser /> Login
            </CustomLink>}
        </ul>
    </nav></>
}

function CustomLink({ to, children,...props }) {
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })
    return (
        <li className={isActive ? "active":""} >
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )

    
}