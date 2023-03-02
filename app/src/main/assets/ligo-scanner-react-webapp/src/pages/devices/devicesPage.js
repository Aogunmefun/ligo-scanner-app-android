import React, { useState, useContext } from "react";
import "./devicesPage.css"
import BLEScan from "../../components/bleScan/bleScan";
import VelocityDevice from "../../components/velocityDevice/velocityDevice";
import OrientationDevice from "../../components/orientationDevice/orientationDevice";
import { Session } from "../../app";

function DevicesPage() {
    const app = useContext(Session)


    

    const changeDevice = (dev)=>{
        let temp = app.app
        temp.device.active = dev
        app.setApp({...temp})
    }

    return(
        <div className="devicesPage">
            <h1>Devices</h1>
            <BLEScan paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
            <VelocityDevice paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
            <OrientationDevice paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
            
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