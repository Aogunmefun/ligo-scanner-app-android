import React, { useState, useEffect, useContext } from "react"
import "./orientationDevice.css"
import logo from "./structures.png"
import Loader from "../loader/loader"
import { Session } from "../../app"
import ThreeScene from "../threeScene/threeScene"

function OrientationDevice(props) {
    
    const [scanning, setScanning] = useState(false)
    const [scannedDevices, setScannedDevices] = useState([])
    const [connecting, setConnecting] = useState(false)
    

    const app = useContext(Session)

    useEffect(()=>{
        window.addEventListener('orientationDeviceFound', handleDeviceFound)
        window.addEventListener('orientationConnecting', handleConnecting)
        window.addEventListener('orientationConnected', handleConnected)
        window.addEventListener('orientationDisconnect', handleDisconnected)
        window.addEventListener('orientationFailedConnect', handleFailedConnect)
    }, [])

    const startScan = ()=>{
        setScanning(true)
        Android.orientationScan()
    }

    const stopScanning = ()=>{
        setScanning(false)
        Android.stopBLEScan()
    }

    const handleConnecting = (device)=>{
        if (device.detail.type!=="orientation") return
        setConnecting(true)
    }

    const handleFailedConnect = (device)=>{
        setConnecting(false)
    }

    const handleConnected = (device)=>{
        if (device.detail.type!=="orientation") return
        let temp = app.app
        console.log("Scanned Devices", JSON.stringify(scannedDevices[0]))
        // console.log("Remaining element", JSON.stringify(scannedDevices.filter((storedDevice,index)=>{
        //     console.log("Connected Device Address", device.detail.address, "stored address", storedDevice.address)
        //     return storedDevice.address===device.detail.address
        // })))
        let connectedDevice = scannedDevices.filter((storedDevice,index)=>storedDevice.address===device.detail.address)
        temp.device.name = "Orientation Sensor"
        temp.device.address = device.detail.address
        temp.device.active = "orientation"
        // app.device.type = connectedDevice[0].type
        temp.device.paired = true
        app.setApp({...temp})
        setConnecting(false)
        setScanning(false)
        
    }

    const handleDisconnected = ()=>{
        let temp = app.app
        temp.device.name = null
        temp.device.address = null
        temp.device.active = null
        temp.device.paired = false
        app.setApp({...temp})
    }

    const disconnect = ()=>{
        Android.orientationDisconnect()
    }

    const handleDeviceFound = (device)=>{
        // if (device.detail.type !== "colorimeter") return
        // if (scannedDevices.filter((item, index)=>item.address===device.detail.address).length === 0) {
        //     console.log("deviceFound", device.detail.name, "Address", device.detail.address)
        //     setScannedDevices([...scannedDevices,{name:device.detail.name, address:device.detail.address}])
        //     console.log("matched", scannedDevices.length, "list", JSON.stringify(scannedDevices))
        // }
        console.log("Works here too", device.detail.name)
        if (device.detail.type !== "orientation") {
            return
        }
        if (scannedDevices.filter((item, index)=>item.address===device.detail.address).length === 0) {
            console.log("deviceFound", device.detail.name, "Address", device.detail.address)
            setScannedDevices([...scannedDevices,{name:device.detail.name, address:device.detail.address}])
            console.log("matched", scannedDevices.length, "list", JSON.stringify(scannedDevices))
        }
        
    }

    

    return(
        <div className="orientationDevice">
            {connecting?<Loader text={props.paired?"Disconnecting...":"Connecting..."} />:""}
            
                <img width="50%" src={logo} alt="" />
                                        
            <button onClick={startScan} className="btn--velocityDeviceConnect">{scanning?"Scanning...":"Scan for devices"}</button>
            {
                scanning?
                <div className="found-devices">
                    <h5 className="device-found-title">Devices Found:</h5>
                    <div className="found-deviceList">
                        {
                            scannedDevices.map((device,index)=>{
                                return(
                                    <div onClick={()=>Android.orientationConnect(device.address)} key={device.address + index} id={device.address} className="found-device ">
                                        
                                        <div class="found-device-info">
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
                app.app.device.paired&&app.app.device.active==="orientation"?
                <div className="paired-device">
                    <h5 className="paired-device-title">Paired Device:</h5>
                    <div className="paired-device">
                        {
                            <div class="found-device">
                                <div class="found-device-img">
                                    <img width="100%" src={logo} alt="" />
                                </div>
                                <div class="found-device-info">
                                    <p>{`Name: ${app.app.device.name}`}</p>
                                    <p>{`Address: ${app.app.device.address}`}</p>
                                    {/* <p>{`Type: ${app.device.type}`}</p> */}
                                </div>
                            </div>
                        }
                    </div>
                </div>
                :""
            }
            {
                props.paired&&props.device==="orientation"?
                <>
                    <button onClick={disconnect} className="btn--disconnectDevice">Disconnect</button>
                    
                </>
                
                :""
            }
            {scanning?<button onClick={()=>stopScanning()}>Stop Scanning</button>:""}

        </div>
    )
}

export default OrientationDevice