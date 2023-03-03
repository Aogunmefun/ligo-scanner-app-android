import React, { useState, useContext, useEffect } from "react";
import "./velocityDevice.css"
import { Session } from "../../app";
import logo from "./strength.png"

function VelocityDevice(props) {

    const [active, setActive] = useState()
    const app = useContext(Session)

    useEffect(()=>{
        setActive(props.device==="ultrasonic")
    })

    const changeDevice = ()=>{
        let temp = app.app
        if (!active) {
            setActive(true)
            
            // temp.device.active = "ultrasonic"
            props.changeDevice("ultrasonic")
            // app.setApp({...temp})
            return
        }
        setActive(false)
        props.changeDevice(null)
        // temp.device.active = null
        // app.setApp({...temp})
        
    }
    

    return(
        <div className="velocityDevice">
            <img src={logo} width="40%" alt="" />
            <button onClick={changeDevice} className="btn--velocityDeviceConnect">{active?"Disconnect":"Make Active"}</button>
        </div>
    )
}

export default VelocityDevice