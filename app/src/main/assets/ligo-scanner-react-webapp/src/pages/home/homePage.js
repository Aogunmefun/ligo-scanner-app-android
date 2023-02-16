import React from "react";
import { useNavigate } from "react-router-dom";
import "./homePage.css"

function HomePage(props) {

    let navigate = useNavigate()
    
    return (
        <div className="homePage">
            sdfs
            <button onClick={()=>navigate("/blescan")}>Scan page</button>
        </div>
    )
}

export default HomePage