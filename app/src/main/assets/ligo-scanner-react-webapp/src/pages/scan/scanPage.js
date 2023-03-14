import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./scanPage.css"
import Loader from "../../components/loader/loader";
import DrillHoleConfig from "../../components/drillholeConfig/drillholeConfig";
import DrillHole from "../../components/drillhole/drillhole";
import DrillHoles from "../../components/drillholes/drillholes";
import Modal from "../../components/modal/modal";
import axios from "axios";
import { CSVLink, CSVDownload } from "react-csv";
import rgbHex from 'rgb-hex';


import { Session } from "../../app";

function ScanPage(props) {

    const [scanning, setScanning] = useState(false)
    const [color, setColor] = useState(null)
    const [create, setCreate] = useState(false)
    const [scanpageTab, setScanPageTab] = useState(1)
    const [timeStamp, setTimeStamp] = useState(0)
    const [rescan, setReScan] = useState(false)
    const [manualscan, setManualScan] = useState(false)
    const [rescanindex, setReScanIndex] = useState(null)
    const [editinfo, setEditInfo] = useState(false)
    const [editScan, setEditScan] = useState(false)
    const [modal, setModal] = useState({state:false, text:""})
    const [hide, setHide] = useState(false)
    const [loading, setLoading] = useState(false)
    const app = useContext(Session)

    let navigate = useNavigate()
    
    useEffect(()=>{
        if (app.app.user === null) navigate("/")
        let temp = app.app
        temp.navbar = true
        app.setApp({...temp})
        // console.log(app.app)
        // if(app.app.device.active === "orientation") navigate("/orientation")
        window.addEventListener("scanComplete", handleScanComplete)
        window.addEventListener("scanning", handleScanning)
        window.addEventListener('csvDownloaded', handleCsvDownloaded)
        // console.log("re-REndering")

    
        
        return () => {
            // console.log("resolving")
            window.removeEventListener("scanning", handleScanning);
            window.removeEventListener("scanComplete", handleScanComplete);
            window.removeEventListener('csvDownloaded', handleCsvDownloaded)
        }

        
        
    },[scanning])

    useEffect(()=>{
        if (app.app.user===null) return
        if(app.app.connected){
            axios({
            url:"http://api.alphaspringsedu.com/ligo-get-user",
            method:"POST",
            headers:{"Content-Type":"application/json"},
            data:{
                email:app.app.user.email
            }
        }).then((res)=>{
            console.log(res.data)
            app.setApp({
                ...app.app,
                user: {
                    email: res.data.user.email,
                    drillholes: res.data.user.drillholes
                }
            })
            
        }).catch((e)=>{
            console.log(e.message)
        })
    }
        
    },[])

    useEffect(()=>{
        if (app.app.user===null) return
        console.log("drillholes local", app.app.user.drillholes)
        upload(app.app)
            
        

    },[app.app.connected])

    // useEffect(()=>{
    //     if (Android.pairedDevices() === 1) {
    //         setModal({state:true, text: "You're not connected to any devices. Please select one from the devices page"})
    //         let temp = app.app
    //         temp.device.name = null
    //         temp.device.address = null
    //         temp.device.active = null
    //         temp.device.paired = false
    //         app.setApp({...temp})
    //     }
    // })

    const upload = (temp)=>{
        // setLoading(true)
        if(!app.app.connected) return 
        console.log("uploading...", temp)
        axios({
            url:"http://api.alphaspringsedu.com/ligo-upload",
            method:"POST",
            headers:{"Content-Type":"application/json"},
            data:{
                email:app.app.user.email,
                data:temp.user.drillholes
            }
        }).then((res)=>{
            if (temp.user.drillholes.length > 0) {
                console.log("Time to compare")
                let online = res.data.user.drillholes[temp.active]?.data
                let comp = temp.user.drillholes[temp.active]?.data.map((scan,index)=>{
                    // console.log("why", index, scan.depth)
                    if ((scan.depth === online[index]?.depth) && (scan.color.r === online[index]?.color.r) && (scan.color.g === online[index]?.color.g) && (scan.color.b === online[index]?.color.b)) {
                        return {
                            ...scan,
                            synced: true
                        }
                    }
                    else {
                        return scan
                    }
                }) 
                temp.user.drillholes[temp.active].data = comp
                return axios({
                    url:"http://api.alphaspringsedu.com/ligo-upload",
                    method:"POST",
                    headers:{"Content-Type":"application/json"},
                    data:{
                        email:app.app.user.email,
                        data:temp.user.drillholes
                    }
                })
            }
            else {
                return null
            }
            
        }).then((res)=>{
            console.log("successful")
            if (res!==null) {
                app.setApp({
                    ...app.app,
                    user: {
                        email: res.data.user.email,
                        drillholes: res.data.user.drillholes
                    }
                })
            }
        })
        .catch((e)=>{
            setModal({state:true, text:e.message})
            console.log("Error to server", e.message)
        })
    }

    // const upload = (temp)=>{
    //     console.log("uploading")
    //     setLoading(true)
    //     axios({
    //         url:"http://api.alphaspringsedu.com/ligo-upload",
    //         method:"POST",
    //         headers:{"Content-Type":"application/json"},
    //         data:{
    //             email:app.app.user.email,
    //             data:temp.drillholes
    //         }
    //     }).then((res)=>{
    //         setLoading(false)
    //         app.setApp({
    //             ...app.app,
    //             user:res.data.user
    //         })
    //     }).catch((e)=>setModal({state:true, text:e.message}))
    // }

    const scanColor = ()=>{
        Android.scanColor()
        setScanning(true)
    }

    const handleScanning = ()=>{
        setScanning(true)
    }

    const handleScanComplete = (sensor)=>{
        console.log(sensor.timeStamp)
        let temp
        if (scanning === true ) {
            
            console.log(scanning)
            let int
            if (rescan) {
                temp = app.app
                temp.user.drillholes[temp.active].data[temp.rescanindex].color = {
                    r:sensor.detail.r, 
                    g:sensor.detail.g, 
                    b:sensor.detail.b
                }
                temp.user.drillholes[temp.active].data[temp.rescanindex].synced = false
                // temp.drillholes[temp.active].data.sort((a,b)=>a.depth-b.depth)
                app.setApp(temp)
                setReScan(false)

                // app.app.rescan = false
                console.log("ReScan", sensor.detail.r,sensor.detail.g,sensor.detail.b)
            }
            else {
                if (app.app.user.drillholes[app.app.active].data.some((scan,index)=>scan.depth==="--")) {
                    console.log("same")
                    setReScan(false)
                    setScanning(false)
                    setModal({state:true, text:"Please first enter a depth for your previous manual scan"})
                    return
                }
                temp = app.app
                console.log(app.app.user.drillholes[app.app.active])
                if (app.app.user.drillholes[app.app.active].data.length!==0) {
                    int = app.app.user.drillholes[app.app.active].config.interval + app.app.user.drillholes[app.app.active].data[app.app.user.drillholes[app.app.active].data.length-1].depth
                    int = Math.floor(int)
                    if (temp.user.drillholes[app.app.active].data.some((scan,index)=>scan.depth===int)) {
                        console.log("same")
                        setModal({state:true, text:"Multiple scans with the same depth"})
                        return
                    }
                }
                else {
                    int = app.app.user.drillholes[app.app.active].config.start
                }
                
                temp.user.drillholes[temp.active].data.push({
                    depth:int,
                    // app.drillholes[app.drillholes.length-1].data[app.drillholes[app.drillholes.length-1].data.lenght-1].depth + app.drillholes[app.drillholes.length-1].config.interval,
                    color:{
                        r:sensor.detail.r, 
                        g:sensor.detail.g, 
                        b:sensor.detail.b
                    },
                    synced: false
                    
                })
                temp.user.drillholes[temp.active].data.sort((a,b)=>a.depth-b.depth)
                app.setApp(temp)
            }
            
            setScanning(false)
            setScanPageTab(1)
            upload(temp)
            // app.app.timeStamp = sensor.timeStamp
            console.log("color", sensor.detail.r,sensor.detail.g,sensor.detail.b)
        }
        
        
    }

    const createDrillHole = (name, interval, start)=>{
        
        let temp = app.app
        
        if (temp.user.drillholes.some((hole,index)=>hole.config.name===name)) {
            setModal({state:true, text:"Conflicting drillhole names"})
            return
        } 
            
        
        temp.user.drillholes.push({
            config: {
                name: name,
                interval: interval,
                start: start,
                expanded: true
            },
            data: [

            ],
            velocity: [

            ],
            orientation: [

            ],
            roughness: [
                
            ]
        })
        temp.active = app.app.user.drillholes.length - 1
        console.log("Active", app.app.active)
        app.setApp(temp)
        upload(temp)
        setCreate(false)
        setScanPageTab(1)
        
    }

    const handleCloseNewDrillhole = ()=>{
        setCreate(false)
        console.log("close")
    }

    const handleSetActiveHole = (index)=>{
        let temp = app.app
        temp.active = index
        console.log(typeof index)
        app.setApp(temp)
        upload(temp)
        setScanPageTab(1)
    }

    const handleEditHole = (name, interval, index)=>{
        let temp = app.app
        temp.user.drillholes[index].config = {
            ...app.app.user.drillholes[index].config,
            name:name.toUpperCase(),
            interval:interval
        }
        app.setApp(temp)
        upload(temp)
    }


    const changeDepth = (depth, index)=>{
        let temp = app.app
        console.log(depth, index)
        if (temp.device.active==="colorimeter") {
            if (temp.user.drillholes[app.app.active].data.some((scan,index)=>scan.depth===depth)) {
                console.log("same")
                setModal({state:true, text:"Multiple scans with the same depth"})
                return
            }
            // console.log("sorting")
            temp.user.drillholes[app.app.active].data[index].depth = depth
            temp.user.drillholes[app.app.active].data.sort((a,b)=>a.depth-b.depth)
            // console.log(temp)
        }
        else if (temp.device.active==="velocity") {
            if (temp.user.drillholes[app.app.active].velocity.some((scan,index)=>scan.depth===depth)) {
                console.log("same")
                setModal({state:true, text:"Multiple scans with the same depth"})
                return
            }
            console.log("sorting")
            temp.user.drillholes[app.app.active].velocity[index].depth = depth
            if (!app.app.user.drillholes[app.app.active].velocity.some((vel,index)=>vel.velocity==="--")) {
                temp.user.drillholes[app.app.active].velocity.sort((a,b)=>a.depth-b.depth)
            }
            
            console.log(temp)
        }
        else if (temp.device.active==="orientation") {
            if (temp.user.drillholes[app.app.active].orientation.some((scan,index)=>scan.depth===depth)) {
                console.log("same")
                setModal({state:true, text:"Multiple scans with the same depth"})
                return
            }
            console.log("sorting")
            temp.user.drillholes[app.app.active].orientation[index].depth = depth
            if (!app.app.user.drillholes[app.app.active].orientation.some((imu,index)=>imu.angle==="--")) {
                temp.user.drillholes[app.app.active].orientation.sort((a,b)=>a.depth-b.depth)
            }
        }
        else if (temp.device.active==="laser") {
            if (temp.user.drillholes[app.app.active].roughness.some((scan,index)=>scan.depth===depth)) {
                console.log("same")
                setModal({state:true, text:"Multiple scans with the same depth"})
                return
            }
            console.log("sorting")
            temp.user.drillholes[app.app.active].roughness[index].depth = depth
            if (!app.app.user.drillholes[app.app.active].roughness.some((rough,index)=>rough.roughness==="--")) {
                temp.user.drillholes[app.app.active].roughness.sort((a,b)=>a.depth-b.depth)
            }
        }
        
        // setScanning(!false)
        app.setApp({...temp})
        upload(temp)
        
    }

    const handleChangeStartDepth = (startdepth, index)=>{
        let temp = app.app
        temp.user.drillholes[index].config = {
            ...app.app.user.drillholes[index].config,
            start:startdepth
        }
        app.setApp(temp)
        upload(temp)
    }

    const handleReScan = (index)=>{
        let temp = app.app
        temp.rescan = true
        
        console.log("set to true", temp.rescan)
        
        temp.rescanindex = index
        console.log("the fuck", temp)
        app.setApp(temp)
        setReScan(true)
        setReScanIndex(index)
        upload(temp)
    }

    const archiveHole = (archiveIndex)=>{
        let temp = app.app
        console.log("delete")
        temp.user.drillholes = app.app.user.drillholes.filter((hole,index)=>index!=archiveIndex)
        temp.active = 0
        console.log(app.app.user.drillholes.length-1)
        app.setApp({...temp})
        upload(temp)
    }

    const handleManualDepth = ()=>{
        let temp = app.app
        if (temp.user.drillholes[app.app.active].data.some((scan,index)=>scan.depth==="--")) {
            console.log("same")
            setModal({state:true, text:"Please first enter a depth for your previous manual scan"})
            return
        }
        temp.user.drillholes[app.app.active].data.push({
            depth:"--",
            color: {
                r: 100,
                g:100,
                b:100
            },
            synced: false
        })
        
        console.log(scanning)
        console.log(app.app.user.drillholes[app.app.active].data)
        app.setApp(temp)
        upload(temp)
        setManualScan(true)
        handleReScan( temp.user.drillholes[app.app.active].data.length-1)
    }

    const cancelManualScan = ()=>{
        let temp = app.app
        temp.user.drillholes[app.app.active].data.pop()
        app.setApp(temp)
        upload(temp)
        setManualScan(false)
    }

    const newVelocity = ()=>{
        let temp = app.app
        if (app.app.user.drillholes[app.app.active].velocity.some((vel,index)=>vel.depth==="--")) {
            setModal({state:true, text:"Please first enter a depth for your previous measurement"})
            return
        }
        temp.user.drillholes[app.app.active].velocity.push({
            depth:"--",
            velocity: "--",
            synced: false
        })
        console.log("new velocity")
        app.setApp({...temp})
        upload(temp)
    }

    const handleChangeVelocity = (depth, velocity, index, changedepth)=>{
        let temp = app.app
        console.log("yooo", depth)
        if ((app.app.user.drillholes[app.app.active].velocity.some((vel,index)=>vel.depth===depth))&&changedepth) {
            setModal({state:true, text:"Can't change depth. This depth already exists"})
            return
        }
        if ((velocity<1000)||(velocity>8000)) {
            setModal({state:true, text:"Velocity measurment should be between 1000 and 8000"})
            return
        }
        temp.user.drillholes[app.app.active].velocity[index] = {
            depth:depth?depth:"--",
            velocity:velocity
        }
        temp.user.drillholes[app.app.active].velocity.sort((a,b)=>a.depth-b.depth)
        app.setApp({...temp})
        upload(temp)

    }

    const newOrientation = ()=>{
        let temp = app.app
        if (app.app.user.drillholes[app.app.active].orientation.some((angle,index)=>angle.depth==="--")) {
            setModal({state:true, text:"Please first enter a depth for your previous measurement"})
            return
        }
        temp.user.drillholes[app.app.active].orientation.push({
            depth:"--",
            angle: "--",
            synced: false
        })
        console.log("new orientation")
        app.setApp({...temp})
        upload(temp)
    }

    const changeOrientation = ()=>{

    }

    const newRoughness = ()=>{
        let temp = app.app
        if (app.app.user.drillholes[app.app.active].roughness.some((scan,index)=>scan.depth==="--")) {
            setModal({state:true, text:"Please first enter a depth for your previous measurement"})
            return
        }
        temp.user.drillholes[app.app.active].roughness.push({
            depth:"--",
            roughness: "--",
            synced: false
        })
        console.log("new orientation")
        app.setApp({...temp})
        upload(temp)
    }

    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    const getCSV = ()=>{
        
        let drillholes = app.app.user.drillholes
        let csv = []
        let scan

        for (let i = 0; i < drillholes.length; i++) {
            for (let j = 0; j < drillholes[i].data.length; j++) {
                scan = drillholes[i].data[j]
                console.log(scan.color.r,scan.color.g,scan.color.b)
                csv.push(
                    {
                        drillholeName:drillholes[i].config.name,
                        depth:scan.depth,
                        color_R:scan.color.r,
                        color_g:scan.color.g,
                        color_b:scan.color.b,
                        hex:"#"+componentToHex(parseInt(scan.color.r)) + componentToHex(parseInt(scan.color.g)) + componentToHex(parseInt(scan.color.b))
                        // hex:"#"+componentToHex(scan.color.r)+componentToHex(scan.color.g)+componentToHex(scan.color.b)
                    }
                )
                
            }
            
        }
        console.log(csv)
        return csv
    }

    const handleCsvDownloaded = ()=>{
        setModal({state:true, text:"drillholes csv downloaded. Check your downloads folder"})
    }

    return(
        <div style={{
            backgroundColor:`${create||scanning?"var(--lightGray)":""}`,
            // overflow:`${rescan||manualscan?"hidden":""}`
        }} className="scanPage">
            
            {
                app.app.device.active?
                <>
                {
                <div className="scanPageTabs">
                    <button onClick={()=>setScanPageTab(1)} className={`btn--scanPageTabs ${scanpageTab===1?"scanPageTabsActive":""}`}>Active Hole</button>
                    <button onClick={()=>setScanPageTab(2)} className={`btn--scanPageTabs ${scanpageTab===2?"scanPageTabsActive":""}`}>All Drillholes</button>
                </div>
            }
            {scanning?<Loader text="Scanning..." />:""}
            {loading?<Loader text="hold on..." />:""}
            {!hide?<button onClick={()=>{
                setCreate(true)
                window.scroll(0,0)
            }}>New Drilhole <i className="material-icons">add_circle_outline</i></button>:""}
            {
                scanpageTab===1?
                <DrillHole 
                    handleManualDepth={handleManualDepth} 
                    rescan={handleReScan} 
                    changeDepth={changeDepth} 
                    handleEditHole = {handleEditHole}  
                    hole={app.app.user.drillholes[app.app.active]} 
                    editinfo = {editinfo}
                    setEditInfo = {setEditInfo}
                    editScan = {editScan}
                    setEditScan = {setEditScan}
                    scanning={scanning}
                    index = {app.app.active}
                    changeStartDepth = {handleChangeStartDepth}
                    newVelocity = {newVelocity}
                    changeVelocity = {handleChangeVelocity}
                    newOrientation = {newOrientation}
                    changeOrientation={changeOrientation}
                    device = {app.app.device.active}
                    setHide={setHide}
                    newRoughness = {newRoughness}
                />
                :<>
                    <CSVLink filename={"drillholes.csv"} data={getCSV()}>Download csv</CSVLink>
                    {
                        app.app.user.drillholes?.map((drillhole,index)=>{
                            return(
                                <DrillHoles 
                                    key={"drillhole:"+drillhole+index}
                                    archiveHole={archiveHole} 
                                    handleSetActiveHole={handleSetActiveHole} 
                                    hole={drillhole} 
                                    index = {index}
                                    handleEditHole = {handleEditHole}
                                    device = {app.app.device.active}
                                />
                            )
                        })
                    }
                </>
                
            }
            {create?<DrillHoleConfig handleCloseNewDrillhole={handleCloseNewDrillhole} createDrillHole = {createDrillHole} />:""}
            {rescan?
                <div className="reScan">
                    <h3>{app.app.user.drillholes[app.app.active].data[rescanindex].depth+"ft"}</h3>
                    <h5>{manualscan?"Waiting for manual scan":"Waiting for re-scan..."}</h5>
                    <button onClick={()=>{
                        if (manualscan) cancelManualScan()
                        setReScan(false)}} className="btn--cancelReScan">Cancel</button>
                </div>
            :""}
            {
                modal.state?
                <Modal
                    text={modal.text}
                    setModal={setModal}
                />  
                :""
            }

            {/* <div className="lastScan">
            <h5>Last Scan:</h5>
                <div style={{backgroundColor:`${color?"rgb("+color.r+","+color.g+","+color.b+")":""}`}} className="lastScanColor">
                    <p>{color?"R:"+color.r+" G:"+color.g+" B:"+color.b:""}</p>
                </div>
                
            </div> */}
                </>
                :<>
                    <h2>No Devices currently connected</h2>
                    <button onClick={()=>navigate("/devices")}>Connect a device</button>
                </>
            }
        </div>
    )
}

export default ScanPage