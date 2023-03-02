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
    const [angles, setAngles] = useState({x:0, y: 0, z:0})

    const app = useContext(Session)

    useEffect(()=>{
        window.addEventListener('deviceFound', handleDeviceFound)
        window.addEventListener('connecting', handleConnecting)
        window.addEventListener('connected', handleConnected)
        window.addEventListener('angles', handleAngles)
        // window.addEventListener('disconnected', handleDisconnected)
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

    const disconnect = ()=>{

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

    const handleAngles = (ev)=>{
        console.log("angles: w:", ev.detail.w, "x:", ev.detail.x, "y:", ev.detail.y, "z:", ev.detail.z)
        setAngles({x:ev.detail.x, y:ev.detail.y, z:ev.detail.z})
    }

    return(
        <div className="orientationDevice">
            {connecting?<Loader text={props.paired?"Disconnecting...":"Connecting..."} />:""}
            <h2>Orientation</h2>
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
                                        <div class="found-device-img">
                                            <img width="100%" src={logo} alt="" />
                                        </div>
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
                    <button onClick={()=>Android.getangles()}>GEt values</button>
                </>
                
                :""
            }
            {scanning?<button onClick={()=>stopScanning()}>Stop Scanning</button>:""}
            {
                props.paired&&props.device==="orientation"?
                <ThreeScene angles={angles} />
                :""
            }
        </div>
    )
}

export default OrientationDevice