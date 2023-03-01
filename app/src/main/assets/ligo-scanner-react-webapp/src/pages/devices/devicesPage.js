import React, { useState, useContext } from "react";
import "./devicesPage.css"
import BLEScan from "../../components/bleScan/bleScan";
import VelocityDevice from "../../components/velocityDevice/velocityDevice";
import OrientationDevice from "../../components/orientationDevice/orientationDevice";
import { Session } from "../../app";

function DevicesPage() {
    
    const [device, setDevice] = useState(null)

    const app = useContext(Session)

    const changeDevice = (dev)=>{
        
    }

    return(
        <div className="devicesPage">
            <h1>Devices</h1>
            <BLEScan />
            <VelocityDevice />
            <OrientationDevice />
            <div className="application-info">
                <p>Application Name: Ligo Scanner</p>
                <p>Company name: Ligo.ai</p>
                <p>Application Version: 1.0.0</p>
                <p>Release Type: Alpha</p>
            </div>
        </div>
    )
}

export default DevicesPage