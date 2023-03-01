import React, {useState} from "react"
import "./orientationDevice.css"


function OrientationDevice(props) {
    

    return(
        <div className="orientationDevice">
            <h2>Orientation</h2>
            <button className="btn--velocityDeviceConnect">Scan for devices</button>
        </div>
    )
}

export default OrientationDevice