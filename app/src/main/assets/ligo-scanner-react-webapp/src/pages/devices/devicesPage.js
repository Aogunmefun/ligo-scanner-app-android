import React, { useState, useContext, useEffect } from "react";
import "./devicesPage.css"
import BLEScan from "../../components/bleScan/bleScan";
import VelocityDevice from "../../components/velocityDevice/velocityDevice";
import OrientationDevice from "../../components/orientationDevice/orientationDevice";
import { Session } from "../../app";
import RoughnessDevice from "../../components/roughnessDevice/roughnessDevice";
import Loader from "../../components/loader/loader";
import axios from "axios";
import Modal from "../../components/modal/modal";

function DevicesPage() {
    const app = useContext(Session)

    const [modal, setModal] = useState({state:false, text:""})
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        let temp = app.app
        temp.navbar = true
        app.setApp({...temp})
    },[])

    const upload = (temp)=>{
        setLoading(true)
        console.log(temp)
        axios({
            url:"https://api.alphaspringsedu.com/ligo-upload",
            method:"POST",
            headers:{"Content-Type":"application/json"},
            data:{
                email:temp.email,
                data:temp
            }
        }).then((res)=>{
            setLoading(false)
            console.log(res.data.user)
            app.setApp(res.data.user)
        }).catch((e)=>setModal({state:true, text:e.message}))
    }
    

    const changeDevice = (dev)=>{
        let temp = app.app
        temp.device.active = dev
        app.setApp({...temp})
        upload(temp)
    }

    return(
        <div className="devicesPage">
        {
                modal.state?
                <Modal
                    text={modal.text}
                    setModal={setModal}
                />  
                :""
            }
            {/* <h1>Devices</h1> */}
            {loading?<Loader text="..." />:""}
            <div className="devicesContainer">
                <div className="device">
                    <BLEScan paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
                    <div className="deviceInfo">
                    <h3>Scan core samples for color data</h3>
                    <h4>Use the button above to pair a device. Colorimeter devices are used for this and can speed up color aqusition for core samples</h4>
                    </div>
                    <i className="material-icons-outlined">pan_tool_alt</i>
                    <h4>Swipe to explore More...</h4>
                </div>
                <div className="device">
                    <VelocityDevice paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
                    <div className="deviceInfo">
                    <h3>Take strength measurements</h3>
                    <h4>Use the button above to pair a device. Ligo's Strength sensors can help you acquire strength characteristics of your device using sound propagation</h4>
                    </div>
                    <i className="material-icons-outlined">pan_tool_alt</i>
                    <h4>Swipe to explore More...</h4>
                </div>
                <div className="device">
                    <OrientationDevice paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
                    <div className="deviceInfo">
                    <h3>Determine Structure angles</h3>
                    <h4>Use the button above to pair a device. Using an IMU, characterize orientation for each of your samples</h4>
                    </div>
                    <i className="material-icons-outlined">pan_tool_alt</i>
                    <h4>Swipe to explore More...</h4>
                </div>
                <div className="device">
                    <RoughnessDevice paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
                    <div className="deviceInfo">
                    <h3>Characterize Roughness of core samples</h3>
                    <h4>Use the button above to pair a device. Simply using your phone and the power of AI, Ligo offers you the ability to cahracterize roughness of your samples in real time</h4>
                    </div>
                    
                </div>
            </div>
            <button>Find out more</button>
            
            
            
            
            
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