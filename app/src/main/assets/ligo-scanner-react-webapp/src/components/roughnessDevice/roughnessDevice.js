import React, { useState, useContext, useEffect } from "react";
import "./roughnessDevice.css"
import { Session } from "../../app";
import logo from "./roughness.png"
import Camera from "../camera/camera";
import { OpenCvProvider } from "opencv-react";

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
            <img src={logo} width="50%" alt="" />
            <button onClick={changeDevice} className="btn--roughnessDeviceConnect">{active?"Disconnect":"Make Active"}</button>
            {active?
                <OpenCvProvider>
                <Camera  />
                </OpenCvProvider>
            

                
            :""}
            {/* {active?<button onClick={}>Do it</button>:""} */}
        </div>
    )
}

export default RoughnessDevice