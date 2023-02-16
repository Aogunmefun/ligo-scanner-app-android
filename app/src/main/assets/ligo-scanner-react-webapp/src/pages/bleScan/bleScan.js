import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import "./bleScan.css"
import sensorimg from "./Nix_Mini2_Face_Amazon.png"
import Loader from "../../components/loader/loader";
import { Session } from "../../app";

function BLEScan(props) {
    
    const [scannedDevices, setScannedDevices] = useState([])
    const [paired, setPaired] = useState(false)
    const [scanning, setScanning] = useState(false)
    const [connecteddevice, setConnectedDevice] = useState()
    const [connecting, setConnecting] = useState(false)
    const app = useContext(Session)

    useEffect(()=>{
        
        // window.deviceFound = new CustomEvent('deviceFound', {name: elem})
        window.addEventListener('deviceFound', handleDeviceFound)
        window.addEventListener('connecting', handleConnecting)
        window.addEventListener('connected', handleConnected)
        window.addEventListener('disconnected', handleDisconnected)

    })

    

    const handleDeviceFound = (device)=>{
        // console.log("matched", scannedDevices.length, "list", JSON.stringify(scannedDevices))
        if (scannedDevices.filter((item, index)=>item.address===device.detail.address).length === 0) {
            console.log("deviceFound", device.detail.name, "Address", device.detail.address)
            setScannedDevices([...scannedDevices, {name:device.detail.name, address:device.detail.address, type:device.detail.type}])
        }
        // setScannedDevices([...scannedDevices, {name:device.detail.name, address:device.detail.address, type:device.detail.type}])
        // console.log(JSON.stringify(scannedDevices[0]))
        
        
    }

    const handleConnecting = ()=>{
        setConnecting(true)
    }

    const handleConnected = (device)=>{
        // console.log("Scanned Devices", scannedDevices[0])
        // console.log("Remaining element", JSON.stringify(scannedDevices.filter((storedDevice,index)=>{
        //     console.log("Connected Device Address", device.detail.address, "stored address", storedDevice.address)
        //     return storedDevice.address===device.detail.address
        // })))
        let connectedDevice = scannedDevices.filter((storedDevice,index)=>storedDevice.address===device.detail.address)
        app.device.name = connectedDevice[0].name
        app.device.address = connectedDevice[0].address
        app.device.type = connectedDevice[0].type
        app.device.paired = true
        setConnecting(false)
        setScanning(false)
        
    }

    const handleDisconnected = ()=>{
        app.device.name = null
        app.device.address = null
        app.device.type = null
        app.device.paired = false
        setConnecting(false)
    }

    const disconnect = ()=>{
        setConnecting(true)
        Android.disconnect()
    }


    const scan = ()=>{
        console.log("About to scan")
        Android.scan()
        setScanning(true)
    }

    return(
        <div className="bleScanPage" style={{pointerEvents:`${connecting?"none":""}`}}>
            {connecting?<Loader text={app.device.paired?"Disconnecting...":"Connecting..."} />:""}
            <h1>{!app.device.paired?"Pair Device":"Device Paired"}</h1>
            {!app.device.paired?<button disabled={scanning} onClick={()=>scan()} id="scan">{scanning?"Scanning...":"Scan for devices"}</button>:""}
            {
                scanning?
                <div className="found-devices">
                    <h5 className="device-found-title">Devices Found:</h5>
                    <div className="found-deviceList">
                        {
                            scannedDevices.map((device,index)=>{
                                return(
                                    <div onClick={()=>Android.connect(device.address)} key={device.address + index} id={device.address} class="found-device ">
                                        <div class="found-device-img">
                                            <img width="100%" src={sensorimg} alt="" />
                                        </div>
                                        <div class="found-device-info">
                                            <p>{`Name: ${device.name}`}</p>
                                            <p>{`Address: ${device.address}`}</p>
                                            <p>{`Type: ${device.type}`}</p>
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
                app.device.paired?
                <div className="paired-device">
                    <h5 className="paired-device-title">Paired Device:</h5>
                    <div className="paired-device">
                        {
                            <div class="found-device">
                                <div class="found-device-img">
                                    <img width="100%" src={sensorimg} alt="" />
                                </div>
                                <div class="found-device-info">
                                    <p>{`Name: ${app.device.name}`}</p>
                                    <p>{`Address: ${app.device.address}`}</p>
                                    <p>{`Type: ${app.device.type}`}</p>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                :""
            }
            {
                app.device.paired?
                <button onClick={disconnect} className="btn--disconnectDevice">Disconnect</button>
                :""
            }
            <div className="application-info">
                <p>Application Name: Ligo Scanner</p>
                <p>Company name: Ligo.ai</p>
                <p>Application Version: 1.0.0</p>
                <p>Release Type: Alpha</p>
            </div>
            
        </div>
    )
}

export default BLEScan