import React, { useState } from "react";
import "./navbar.css"
import logo from "./Ligo-logo 2.png"
import SideNav from "../sidenav/sidenav";


function Navbar(props) {
    
    const [open, setOpen] = useState(false)

    return(
        <div className="navbar">
            <SideNav open={open} />
            <div className="navbar-top">
                <div onClick={()=>setOpen(!open)} className="navbar-burger">
                    <i className="material-icons-round">menu</i>
                </div>  
                <div className="navbar-logo">
                    <img style={{width:"100%"}} src={logo} alt="" />
                </div>
                
            </div>
        </div>
    )
}
export default Navbar