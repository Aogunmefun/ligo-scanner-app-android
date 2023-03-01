import React, { useState } from "react";
import "./modal.css"


function Modal(props) {
    
    return(
        <div className="modal">
            <h5>{props.text}</h5>
            <button onClick={()=>{props.setModal({state:false, text:""})}}>Close</button>
        </div>
    )
}

export default Modal