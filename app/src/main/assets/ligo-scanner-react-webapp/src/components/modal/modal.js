import React, { useState } from "react";
import "./modal.css"


function Modal(props) {
    
    return(
        <div className="modal">
            <h5>{props.text}</h5>
            {props.close===null||props.close===undefined||props.close===true?<button onClick={()=>{props.setModal({state:false, text:""})}}>Close</button>:""}
        </div>
    )
}

export default Modal