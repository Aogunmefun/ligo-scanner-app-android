import React, { useState, useEffect, useContext } from "react";
import "./imuPage.css"
import ThreeScene from "../../components/threeScene/threeScene";
import { useNavigate } from "react-router-dom";
import { Session } from "../../app";


function ImuPage() {
    
    const [angles, setAngles] = useState({x:0, y: 0, z:0})
    const [tracking, setTracking] = useState(false)
    const app = useContext(Session)

    let navigate = useNavigate()

    useEffect(()=>{
        if (app.app.device.active !== "orientation") navigate("/scan") 
            
        
        window.addEventListener('angles', handleAngles)

    }, [])

    const handleAngles = (ev)=>{
        console.log("angles: w:", ev.detail.w, "x:", ev.detail.x, "y:", ev.detail.y, "z:", ev.detail.z)
        setAngles({x:ev.detail.x, y:ev.detail.y, z:ev.detail.z})
    }

    

    return(
        <div className="imuPage">
            <h1>IMU</h1>
            <button onClick={()=>{
                if (!tracking){
                    Android.getangles()
                    setTracking(true)
                }
                else {
                    setTracking(false)
                }
            
            }}>{!tracking?"Track Orientation":"Tracking..."}</button>
            <ThreeScene angles={angles} />
            <h2>Angles:</h2>
        </div>
    )
}

export default ImuPage
