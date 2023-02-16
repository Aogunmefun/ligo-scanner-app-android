import React, { useState, useEffect } from "react";
import "./scanPage.css"
import Loader from "../../components/loader/loader";

function ScanPage(props) {

    const [scanning, setScanning] = useState(false)
    const [color, setColor] = useState(null)
    
    useEffect(()=>{
        window.addEventListener("scanning", handleScanning)
        window.addEventListener("scanComplete", handleScanComplete)
    })

    const scanColor = ()=>{
        Android.scanColor()
        setScanning(true)
    }

    const handleScanning = ()=>{
        
    }

    const handleScanComplete = (sensor)=>{
        setScanning(false)
        console.log("color", sensor.detail.r,sensor.detail.g,sensor.detail.b)
        setColor({r:sensor.detail.r, g:sensor.detail.g, b:sensor.detail.b})
    }

    return(
        <div className="scanPage">
            {scanning?<Loader text="Scanning..." />:""}
            <button onClick={scanColor}>Scan</button>

            <div className="lastScan">
            <h5>Last Scan:</h5>
                <div style={{backgroundColor:`${color?"rgb("+color.r+","+color.g+","+color.b+")":""}`}} className="lastScanColor">
                    {/* <p>{color?color:""}</p> */}
                </div>
                
            </div>
        </div>
    )
}

export default ScanPage