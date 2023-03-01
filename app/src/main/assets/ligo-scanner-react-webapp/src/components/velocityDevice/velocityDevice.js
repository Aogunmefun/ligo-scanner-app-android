import React, { useState } from "react";
import "./velocityDevice.css"


function VelocityDevice(props) {
    

    return(
        <div className="velocityDevice">
            <h2>Ultrasonic</h2>
            <button className="btn--velocityDeviceConnect">Make Active</button>
        </div>
    )
}

export default VelocityDevice