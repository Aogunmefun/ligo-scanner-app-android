import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./sidenav.css"
import { Session } from "../../app";

function SideNav(props) {
    
    let navigate = useNavigate()
    const app = useContext(Session)


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
                console.log("sidenav", app.app.device.active)
                if (app.app.device.active === "coreScan") {
                    navigate("/coreScan")
                    return
                }
                navigate("/scan")
            }} className="btn--sidenav">Measurements</button>
            <button onClick={()=>{
                props.setOpen(false)
                app.setApp({
                    ...app.app,
                    user:{
                        email: null,
                        drillholes:[]
                    }
                })
                navigate("/")
            }} className="btn--sidenav">Logout</button>
        </div>
    )
}

export default SideNav