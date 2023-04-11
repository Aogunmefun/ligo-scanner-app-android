import React, { useState, useContext, useEffect } from "react";
import "./velocityDevice.css"
import { Session } from "../../app";
import logo from "./strength.png"

function VelocityDevice(props) {

    const [active, setActive] = useState()
    const [available, setAvailable] = useState(true)
    const app = useContext(Session)

    useEffect(()=>{
        setActive(props.device==="velocity")
    })

    const changeDevice = ()=>{
        let temp = app.app
        if (!active) {
            setActive(true)
            
            // temp.device.active = "ultrasonic"
            props.changeDevice("velocity")
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
            {/* <img src={logo} width="40%" alt="" /> */}
            <p className="devicePageTitle">Strength</p>
            {
                available?
                <button onClick={changeDevice} className="btn--velocityDeviceConnect">{active?"Disconnect":"Make Active"}</button>
                :<button onClick={changeDevice} className="btn--velocityDeviceConnect btn--disabled">{active?"Disconnect":"Make Active"} <i className="material-icons">lock</i></button>
            }
        </div>
    )
}

export default VelocityDevice