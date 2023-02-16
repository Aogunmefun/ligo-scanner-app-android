import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./sidenav.css"

function SideNav(props) {
    
    let navigate = useNavigate()

    return(
        <div className={`sidenav ${props.open?"sidenavOpen":""}`}>
            <button onClick={()=>navigate("/configure")} className="btn--sidenav">Configuration</button>
            <button onClick={()=>navigate("/scan")} className="btn--sidenav">Scan</button>
            <button onClick={()=>navigate("/blescan")} className="btn--sidenav">Pair Device</button>
        </div>
    )
}

export default SideNav