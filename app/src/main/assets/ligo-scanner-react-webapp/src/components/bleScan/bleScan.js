import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import "./bleScan.css"
import sensorimg from "./colorimeter.png"
import logo from "./colors.png"
import Loader from "../../components/loader/loader";
import { Session } from "../../app";
import axios from "axios";
import Modal from "../modal/modal";
import DrillHoles from "../drillholes/drillholes";

function BLEScan(props) {
    
    const [scannedDevices, setScannedDevices] = useState([])
    const [paired, setPaired] = useState(false)
    const [scanning, setScanning] = useState(false)
    const [connecteddevice, setConnectedDevice] = useState()
    const [connecting, setConnecting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [viewdata, setViewData] = useState(false)
    const app = useContext(Session)
    const [modal, setModal] = useState({state:false, text:""})

    const upload = (temp)=>{
        setLoading(true)
        axios({
            url:"http://api.alphaspringsedu.com/ligo-upload",
            method:"POST",
            headers:{"Content-Type":"application/json"},
            data:{
                email:app.app.email,
                data:temp
            }
        }).then((res)=>{
            setLoading(false)
            app.setApp(res.data.user)
        }).catch((e)=>setModal({state:true, text:e.message}))
    }

    useEffect(()=>{
        
        // window.deviceFound = new CustomEvent('deviceFound', {name: elem})
        window.addEventListener('colorimeterDeviceFound', handleDeviceFound)
        window.addEventListener('colorimeterConnecting', handleConnecting)
        window.addEventListener('colorimeterConnected', handleConnected)
        window.addEventListener('colorimeterDisconnected', handleDisconnected)
        
        if (Android.pairedDevices() === 1) {
            // setModal({state: true, text: "You're not connected to any devices"})
            let temp = app.app
            temp.device.name = null
            temp.device.address = null
            temp.device.active = null
            temp.device.paired = false
            app.setApp({...temp})
        }

    }, [])

    

    

    const handleDeviceFound = (device)=>{
        if (scannedDevices.filter((item, index)=>item.address===device.detail.address).length === 0) {
            console.log("deviceFound", device.detail.name, "Address", device.detail.address)
            setScannedDevices([...scannedDevices,{name:device.detail.name, address:device.detail.address}])
            console.log("matched", scannedDevices.length, "list", JSON.stringify(scannedDevices))
        }

        
        
    }

    const handleConnecting = (device)=>{
        console.log("Setting connecting to true")
        setConnecting(true)
    }

    const handleConnected = (device)=>{
        let temp = app.app
        console.log("blescan", device.detail.type)
        temp.device.name = device.detail.name
        temp.device.address = device.detail.address
        temp.device.active = "colorimeter"
        temp.device.paired = true
        app.setApp(temp)
        setConnecting(false)
        setScanning(false)
        
    }

    const handleDisconnected = ()=>{
        let temp = app.app
        temp.device.name = null
        temp.device.address = null
        // app.device.type = null
        temp.device.active = null
        temp.device.paired = false
        app.setApp({...temp})
        // upload(temp)
        setConnecting(false)
    }

    const disconnect = ()=>{
        setConnecting(true)
        Android.disconnect()
        setScannedDevices([])
    }


    const scan = ()=>{
        console.log("Get Pairedd Devices", Android.pairedDevices())
        if ((Android.pairedDevices() === 0)) {
            setModal({state: true, text: "Bluetooth not enabled"})
        }
        else if (Android.pairedDevices() === 1) {
            console.log("About to scan")
            // Android.orientationDisconnect()
            Android.scan()
            setScanning(true)
            setTimeout(() => {
                setScanning(false)
            }, 20000);
        }
        else {
            if (Android.pairedDevices()===2) {
                setModal({state:true, text:"Already connected to Colorimeter. Please disconnect first"})
            }
            else if (Android.pairedDevices()===3) {
                setModal({state:true, text:"Already connected to IMU. Please disconnect first"})
            }
            else {
                setModal({state:true, text:"Unexpected error. Try again"})
            }
        }
        
        
    }

    return(
        <div className="bleScanPage" style={{pointerEvents:`${connecting?"none":""}`}}>
            {
                modal.state?
                <Modal
                    text={modal.text}
                    setModal={setModal}
                />  
                :""
            }
            {connecting?<Loader loading={connecting} text={app.app.device.paired?"Disconnecting...":"Connecting..."} />:""}
            {loading?<Loader text="hold on..." />:""}
            {/* <img width="30%" src={logo} alt="" /> */}
            <p className="devicePageTitle">Colors</p>
            {/* <h1>{!app.app.device.paired?"Pair Device":"Device Paired"}</h1> */}
            {/* <h1>{"Count: " + scannedDevices.length}</h1> */}
            {!app.app.device.paired?<button disabled={scanning} onClick={()=>scan()} id="scan">{scanning?"Scanning...":"Scan for devices"}</button>:""}
            {viewdata?"":<button onClick={()=>setViewData(true)}>View Colorimeter data</button>}
            {!app.app.device.paired?<h5>Click on a device to connect</h5>:""}
            {
                scanning?
                <div className="found-devices">
                    <h5 className="device-found-title">Devices Found:</h5>
                    <div className="found-deviceList">
                        {
                            scannedDevices.map((device,index)=>{
                                return(
                                    <div onClick={()=>Android.connect(device.address)} key={device.address + index} id={device.address} className="found-device ">
                                        <img className="found-device-img" src={sensorimg} alt="" />
                                        <div className="found-device-info">
                                            <p>{`Name: ${device.name}`}</p>
                                            <p>{`Address: ${device.address}`}</p>
                                            {/* <p>{`Type: ${device.type}`}</p> */}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                :""
            }
            {
                app.app.device.paired&&app.app.device.active==="colorimeter"?
                <div className="paired-device">
                    <h5 className="paired-device-title">Paired Device:</h5>
                    <div className="paired-device">
                        {
                            <div style={{backgroundColor:"#1DA0A5",borderRadius:"1rem"}} className="found-device">
                                <img className="found-device-img" src={sensorimg} alt="" />
                                <div className="found-device-info" >
                                    <p style={{color:"white"}}>{`Name: ${app.app.device.name}`}</p>
                                    <p style={{color:"white"}}>{`Address: ${app.app.device.address}`}</p>
                                    {/* <p>{`Type: ${app.device.type}`}</p> */}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                :""
            }
            {
                app.app.device.paired?
                <button onClick={disconnect} className="btn--disconnectDevice">Disconnect</button>
                :""
            }
            {
                viewdata?
                <div className="dataView">
                    <button onClick={()=>setViewData(false)} className="btn--flat"><i className="material-icons">close</i></button>
                    <p>Colorimeter Data:</p>
                    {
                        app.app.user.drillholes?.map((drillhole,index)=>{
                        return(
                            <DrillHoles 
                                key={"drillhole:"+drillhole+index}
                                // archiveHole={archiveHole} 
                                // handleSetActiveHole={handleSetActiveHole} 
                                hole={drillhole} 
                                index = {index}
                                expanded={true}
                                // handleEditHole = {handleEditHole}
                                device = {"colorimeter"}
                            />
                        )
                        })
                    }
                </div>
                
                :""
            }
            
            
        </div>
    )
}

export default BLEScan