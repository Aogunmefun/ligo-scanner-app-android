import React, { useState, useContext, useEffect } from "react";
import "./roughnessDevice.css"
import { Session } from "../../app";
import logo from "./roughness.png"
import Camera from "../camera/camera";

function RoughnessDevice(props) {
    const [active, setActive] = useState()
    const app = useContext(Session)

    useEffect(()=>{
        setActive(props.device==="laser")
    })

    const changeDevice = ()=>{
        let temp = app.app
        if (!active) {
            setActive(true)
            
            // temp.device.active = "ultrasonic"
            props.changeDevice("laser")
            // app.setApp({...temp})
            return
        }
        setActive(false)
        props.changeDevice(null)
        // temp.device.active = null
        // app.setApp({...temp})
        
    }

    return(
        <div className="roughnessDevice">
            <img src={logo} width="50%" alt="" />
            <button onClick={changeDevice} className="btn--roughnessDeviceConnect">{active?"Disconnect":"Make Active"}</button>
            {active?
                <Camera />
            :""}
        </div>
    )
}

export default RoughnessDevice