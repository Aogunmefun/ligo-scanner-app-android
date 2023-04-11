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
import DrillcoreDevice from "../../components/drillcoreDevice/drillcoreDevice";

function DevicesPage() {
    const app = useContext(Session)

    const [modal, setModal] = useState({state:false, text:""})
    const [loading, setLoading] = useState(false)

    useEffect(()=>{
        let temp = app.app
        temp.navbar = true
        app.setApp({...temp})
        console.log(app.app)
        window.scroll({
            top:0,
            left:0,
            behavior: "smooth"
        })
    },[])

    const upload = (temp)=>{
        setLoading(true)
        console.log(temp)
        axios({
            url:"http://api.alphaspringsedu.com/ligo-upload",
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
        console.log("changing", dev)
        let temp = app.app
        temp.device.active = dev
        app.setApp({...temp})
        // upload(temp)
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
                    <DrillcoreDevice paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
                    <div className="deviceInfo">
                    <h3>Scan entire drill cores</h3>
                    <h4>Using image stitching, create a picture representative of an entire drill core by recording a video along it's length</h4>
                    </div>
                    <i className="material-icons-outlined">pan_tool_alt</i>
                    <h4>Swipe to explore More...</h4>
                </div>
                <div className="device">
                    <BLEScan paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
                    <div className="deviceInfo">
                    <h3>Scan core samples for color data</h3>
                    <h4>Capture the calibrated color of the drill core by using either the volume up button or the capture button on the device.</h4>
                    </div>
                    <i className="material-icons-outlined">pan_tool_alt</i>
                    <h4>Swipe to explore More...</h4>
                </div>
                <div className="device">
                    <VelocityDevice paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
                    <div className="deviceInfo">
                    <h3>Take strength measurements</h3>
                    <h4>Use our strength sensor to measure the ultrasonic velocity of the drill core sample, which correlates with its uniaxial compression strength.</h4>
                    </div>
                    <i className="material-icons-outlined">pan_tool_alt</i>
                    <h4>Swipe to explore More...</h4>
                </div>
                <div className="device">
                    <OrientationDevice paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
                    <div className="deviceInfo">
                    <h3>Determine Structure angles</h3>
                    <h4>Digitally measure and store the alpha and beta angles of a structure using our structural characterization sensor.</h4>
                    </div>
                    <i className="material-icons-outlined">pan_tool_alt</i>
                    <h4>Swipe to explore More...</h4>
                </div>
                <div className="device">
                    <RoughnessDevice paired={app.app.device.paired} device={app.app.device.active} changeDevice={changeDevice} />
                    <div className="deviceInfo">
                    <h3>Characterize Roughness of core samples</h3>
                    <h4>Measure fracture roughness consistently with our roughness characterization sensor.</h4>
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