import React, { useState, useEffect, useContext } from "react";
import "./scanPage.css"
import Loader from "../../components/loader/loader";
import DrillHoleConfig from "../../components/drillholeConfig/drillholeConfig";
import DrillHole from "../../components/drillhole/drillhole";
import DrillHoles from "../../components/drillholes/drillholes";

import { Session } from "../../app";

function ScanPage(props) {

    const [scanning, setScanning] = useState(false)
    const [color, setColor] = useState(null)
    const [create, setCreate] = useState(false)
    const [scanpageTab, setScanPageTab] = useState(1)
    const [timeStamp, setTimeStamp] = useState(0)
    const [rescan, setReScan] = useState(false)
    const [rescanindex, setReScanIndex] = useState(null)
    const [remove, setRemove] = useState(true)
    const app = useContext(Session)
    
    useEffect(()=>{
        window.addEventListener("scanComplete", handleScanComplete)
        window.addEventListener("scanning", handleScanning)
        
        console.log("re-REndering")
        return () => {
            console.log("resolving")
            window.removeEventListener("scanning", handleScanning);
            window.removeEventListener("scanComplete", handleScanComplete);
        }
    },[scanning])

    const scanColor = ()=>{
        Android.scanColor()
        setScanning(true)
    }

    const handleScanning = ()=>{
        setScanning(true)
    }

    const handleScanComplete = (sensor)=>{
        console.log(sensor.timeStamp)
        if (scanning === true ) {
            console.log(scanning)
            let int
            if (app.rescan) {
                app.drillholes[app.active].data[app.rescanindex].color = {
                    r:sensor.detail.r, 
                    g:sensor.detail.g, 
                    b:sensor.detail.b
                }
                setReScan(false)
                app.rescan = false
                console.log("ReScan", sensor.detail.r,sensor.detail.g,sensor.detail.b)
            }
            else {
                console.log(app.drillholes[app.active])
                if (app.drillholes[app.active].data.length!==0) {
                    int = app.drillholes[app.active].config.interval + app.drillholes[app.active].data[app.drillholes[app.active].data.length-1].depth
                }
                
                app.drillholes[app.active].data.push({
                    depth:app.drillholes[app.active].data.length===0? app.drillholes[app.active].config.start:Math.floor(int),
                    // app.drillholes[app.drillholes.length-1].data[app.drillholes[app.drillholes.length-1].data.lenght-1].depth + app.drillholes[app.drillholes.length-1].config.interval,
                    color:{
                        r:sensor.detail.r, 
                        g:sensor.detail.g, 
                        b:sensor.detail.b
                    }
                    
                })
            }
            
            setScanning(false)
            setScanPageTab(1)
            app.timeStamp = sensor.timeStamp
            console.log("color", sensor.detail.r,sensor.detail.g,sensor.detail.b)
        }
        
        
    }

    const createDrillHole = (name, interval, start)=>{
        app.drillholes.push({
            config: {
                name: name,
                interval: interval,
                start: start,
                expanded: true
            },
            data: [

            ],
            custom: [

            ]
        })
        app.active = app.drillholes.length - 1
        console.log("Active", app.active)
        setCreate(false)
        setScanPageTab(1)
        
    }

    const handleCloseNewDrillhole = ()=>{
        setCreate(false)
        console.log("close")
    }

    const handleSetActiveHole = (index)=>{
        app.active = index
        console.log(typeof index)
        setScanPageTab(1)
    }

    const handleEditHole = (name, interval)=>{
        app.drillholes[app.active].config = {
            ...app.drillholes[app.active].config,
            name:name,
            interval:interval
        }
        setScanning(true)
        setScanning(false)
    }


    const changeDepth = (depth, index)=>{
        console.log(depth, index)
        app.drillholes[app.active].data[index].depth = depth
    }

    const handleReScan = (index)=>{
        app.rescan = true
        setReScan(true)
        console.log("set to true")
        setReScanIndex(index)
        app.rescanindex = index
    }

    const deleteHole = ()=>{
        console.log("delete")
        app.drillholes = app.drillholes.filter((hole,index)=>index!=app.active)
        app.active = 0
        console.log(app.drillholes.length-1)
        setRemove(!remove)
    }

    const handleManualDepth = ()=>{
        console.log("here")
        setScanning(true)
        app.drillholes[app.active].data.push({
            depth:0,
            color: {
                r: 100,
                g:100,
                b:100
            }
        })
        setRemove(!remove)
        console.log(scanning)
        console.log(app.drillholes[app.active].data)
        setScanning(false)
    }

    return(
        <div style={{backgroundColor:`${create?"var(--lightGray)":""}`}} className="scanPage">
            {
                <div className="scanPageTabs">
                    <button onClick={()=>setScanPageTab(1)} className={`btn--scanPageTabs ${scanpageTab===1?"scanPageTabsActive":""}`}>Active Hole</button>
                    <button onClick={()=>setScanPageTab(2)} className={`btn--scanPageTabs ${scanpageTab===2?"scanPageTabsActive":""}`}>All Drillholes</button>
                </div>
            }
            {scanning?<Loader text="Scanning..." />:""}
            <button onClick={()=>{
                setCreate(true)
                window.scroll(0,0)
            }}>New Drilhole <i className="material-icons">add_circle_outline</i></button>
            {
                scanpageTab===1?
                <DrillHole handleManualDepth={handleManualDepth} deleteHole={deleteHole} rescan={handleReScan} changeDepth={changeDepth} handleEditHole = {handleEditHole}  hole={app.drillholes[app.active]} />
                :<DrillHoles handleSetActiveHole={handleSetActiveHole} drillholes={app.drillholes} />
            }
            {create?<DrillHoleConfig handleCloseNewDrillhole={handleCloseNewDrillhole} createDrillHole = {createDrillHole} />:""}
            {rescan?
                <div className="reScan">
                    <h5>Waiting for Rescan...</h5>
                    <button onClick={()=>setReScan(false)} className="btn--cancelReScan">Cancel</button>
                </div>
            :""}

            {/* <div className="lastScan">
            <h5>Last Scan:</h5>
                <div style={{backgroundColor:`${color?"rgb("+color.r+","+color.g+","+color.b+")":""}`}} className="lastScanColor">
                    <p>{color?"R:"+color.r+" G:"+color.g+" B:"+color.b:""}</p>
                </div>
                
            </div> */}
        </div>
    )
}

export default ScanPage