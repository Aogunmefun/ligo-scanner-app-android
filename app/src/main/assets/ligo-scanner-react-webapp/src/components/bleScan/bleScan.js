import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import "./bleScan.css"
// import sensorimg from "./Nix_Mini2_Face_Amazon.png"
import logo from "./Ligo-logo 2.png"
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
        window.addEventListener('colorimeterDeviceFound', handleDeviceFound)
        window.addEventListener('colorimeterConnecting', handleConnecting)
        window.addEventListener('colorimeterConnected', handleConnected)
        window.addEventListener('colorimeterDisconnected', handleDisconnected)
        

    }, [scannedDevices])

    

    const handleDeviceFound = (device)=>{
        if (scannedDevices.filter((item, index)=>item.address===device.detail.address).length === 0) {
            console.log("deviceFound", device.detail.name, "Address", device.detail.address)
            setScannedDevices([...scannedDevices,{name:device.detail.name, address:device.detail.address}])
            console.log("matched", scannedDevices.length, "list", JSON.stringify(scannedDevices))
        }

        
        
    }

    const handleConnecting = (device)=>{

        setConnecting(true)
    }

    const handleConnected = (device)=>{
        let temp = app.app
        console.log("blescan", device.detail.type)
        console.log("Scanned Devices", JSON.stringify(scannedDevices[0]))
        // console.log("Remaining element", JSON.stringify(scannedDevices.filter((storedDevice,index)=>{
        //     console.log("Connected Device Address", device.detail.address, "stored address", storedDevice.address)
        //     return storedDevice.address===device.detail.address
        // })))
        let connectedDevice = scannedDevices.filter((storedDevice,index)=>storedDevice.address===device.detail.address)
        temp.device.name = connectedDevice[0].name
        temp.device.address = connectedDevice[0].address
        temp.device.active = "colorimeter"
        // app.device.type = connectedDevice[0].type
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
            {connecting?<Loader text={app.app.device.paired?"Disconnecting...":"Connecting..."} />:""}
            <h2>Colorimeter</h2>
            {/* <h1>{!app.app.device.paired?"Pair Device":"Device Paired"}</h1> */}
            {/* <h1>{"Count: " + scannedDevices.length}</h1> */}
            {!app.app.device.paired?<button disabled={scanning} onClick={()=>scan()} id="scan">{scanning?"Scanning...":"Scan for devices"}</button>:""}
            {
                scanning?
                <div className="found-devices">
                    <h5 className="device-found-title">Devices Found:</h5>
                    <div className="found-deviceList">
                        {
                            scannedDevices.map((device,index)=>{
                                return(
                                    <div onClick={()=>Android.connect(device.address)} key={device.address + index} id={device.address} className="found-device ">
                                        <div className="found-device-img">
                                            <img width="100%" src={logo} alt="" />
                                        </div>
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
                            <div className="found-device">
                                <div className="found-device-img">
                                    <img width="100%" src={logo} alt="" />
                                </div>
                                <div className="found-device-info">
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
                app.app.device.paired?
                <button onClick={disconnect} className="btn--disconnectDevice">Disconnect</button>
                :""
            }
            
            
        </div>
    )
}

export default BLEScan