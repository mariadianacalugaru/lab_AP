import {Link,useMatch,useResolvedPath} from "react-router-dom"
import Logo from "../assets/logo-removebg-preview.png"
import { FaRegUser } from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { useState } from "react";
import Logout from "./Logout";



export default function Navbar({sid}) {
    
    const [logged, setLogged] = useState(false);

    function login() {
        setLogged((logged) => !logged);
    }
    return <><nav className="nav">
        <Link to="/" >
            <img src={Logo} className="Logo" alt="Nutriverse" ></img>
        </Link>
        <ul>
           <Logout sid={sid}></Logout>
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