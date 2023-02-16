import React from "react";
import { useNavigate } from "react-router-dom";

function ConfigurePage(props) {
    
    let navigate = useNavigate()

    return(
        <div className="configurePage">
            configure
            <button onClick={()=>navigate("/")}>Home page</button>
        </div>
    )
}

export default ConfigurePage