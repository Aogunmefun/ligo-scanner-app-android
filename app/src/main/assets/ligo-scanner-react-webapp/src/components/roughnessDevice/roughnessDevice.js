import React, { useState, useContext, useEffect } from "react";
import "./roughnessDevice.css"
import { Session } from "../../app";
import logo from "./roughness.png"


function RoughnessDevice(props) {
    const [active, setActive] = useState()
    const [loaded, setLoaded] = useState(false)
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
            {/* <img src={logo} width="50%" alt="" /> */}
            <p className="devicePageTitle">Roughness</p>
            <button onClick={changeDevice} className="btn--roughnessDeviceConnect btn--disabled">{active?"Disconnect":"Make Active"}<i className="material-icons">lock</i></button>
            
                
            

                
            
            {/* {active?<button onClick={}>Do it</button>:""} */}
        </div>
    )
}

export default RoughnessDevice