import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sidenav.css"

function SideNav(props) {
    
    let navigate = useNavigate()

    return(
        <div className={`sidenav ${props.open?"sidenavOpen":""}`}>
            {/* <button onClick={()=>{
                props.setOpen(false)
                navigate("/configure")
                
            }} className="btn--sidenav">Configuration</button> */}
            
            <button onClick={()=>{
                props.setOpen(false)
                navigate("/devices")
            }} className="btn--sidenav">Devices</button>
            <button onClick={()=>{
                props.setOpen(false)
                navigate("/scan")
            }} className="btn--sidenav">Measurements</button>
        </div>
    )
}

export default SideNav