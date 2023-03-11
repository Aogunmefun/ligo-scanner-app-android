import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./splash.css"
import logo from "./logo.png"


function Splash(props) {
    
    let navigate = useNavigate()

    const begin = ()=>{
        
        props.setBegin(true)
        setTimeout(() => {
            document.querySelector(".splash").style.height = "250px"
            // document.querySelector(".splash").style.justifyContent = "center"
            document.querySelector(".splash").style.paddingTop = "90px"
            document.querySelector("#btn--splash").style.display = "none"
            
        }, 300);
        ;
    }

    return(
        <div className="splash">
            <div className="splashCircle">
                <img width="80%" src={logo} alt="" />
            </div>
            <button id="btn--splash" className={`${props.begin?"btn--splashOut":"btn--splash"}`} onClick={()=>begin()}>Tap to begin</button>
        </div>
    )
}

export default Splash