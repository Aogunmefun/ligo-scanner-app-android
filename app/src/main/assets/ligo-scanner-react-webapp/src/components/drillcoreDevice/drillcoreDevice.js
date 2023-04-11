import React, { useState, useContext, useEffect } from "react";
import "./drillcoreDevice.css"
import { Session } from "../../app";

function DrillcoreDevice(props) {
    
    const [active, setActive] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const app = useContext(Session)

    useEffect(()=>{
        setActive(props.device==="coreScan")
    })

    const changeDevice = ()=>{
        
        let temp = app.app
        if (!active) {
            console.log("changin")
            setActive(true)
            
            // temp.device.active = "ultrasonic"
            props.changeDevice("coreScan")
            // app.setApp({...temp})
            return
        }
        setActive(false)
        props.changeDevice(null)
        // temp.device.active = null
        // app.setApp({...temp})
        
    }

    return (
        <div className="drillcoreDevice">
            <p className="devicePageTitle">Drillcore Scan</p>
            <button onClick={changeDevice} className="btn--roughnessDeviceConnect">{active?"Disconnect":"Make Active"}</button>
            {/* <button onClick={()=>Android.startCamera()}>Open Camera</button> */}
        </div>
    )
}

export default DrillcoreDevice