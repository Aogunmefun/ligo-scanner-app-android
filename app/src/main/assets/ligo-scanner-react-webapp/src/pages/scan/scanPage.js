import React, { useState, useEffect, useContext } from "react";
import "./scanPage.css"
import Loader from "../../components/loader/loader";
import DrillHoleConfig from "../../components/drillholeConfig/drillholeConfig";
import DrillHole from "../../components/drillhole/drillhole";

import { Session } from "../../app";

function ScanPage(props) {

    const [scanning, setScanning] = useState(false)
    const [color, setColor] = useState(null)
    const [create, setCreate] = useState(false)
    const app = useContext(Session)
    
    useEffect(()=>{
        window.addEventListener("scanning", handleScanning)
        window.addEventListener("scanComplete", handleScanComplete)
        
    }, [])

    const scanColor = ()=>{
        Android.scanColor()
        setScanning(true)
    }

    const handleScanning = ()=>{
        setScanning(true)
    }

    const handleScanComplete = (sensor)=>{
        let int
        if (app.drillholes[app.drillholes.length-1].data.length!==0) {
            int = app.drillholes[app.drillholes.length-1].config.interval + app.drillholes[app.drillholes.length-1].data[app.drillholes[app.drillholes.length-1].data.length-1].depth
        }
        
        app.drillholes[app.drillholes.length-1].data.push({
            depth:app.drillholes[app.drillholes.length-1].data.length===0? app.drillholes[app.drillholes.length-1].config.start:int,
            // app.drillholes[app.drillholes.length-1].data[app.drillholes[app.drillholes.length-1].data.lenght-1].depth + app.drillholes[app.drillholes.length-1].config.interval,
            color:{
                r:sensor.detail.r, 
                g:sensor.detail.g, 
                b:sensor.detail.b
            }
        })
        setScanning(false)
        console.log("color", sensor.detail.r,sensor.detail.g,sensor.detail.b)
        
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
        console.log(app)
        setCreate(false)
    }

    return(
        <div style={{backgroundColor:`${create?"var(--lightGray)":""}`}} className="scanPage">
            {scanning?<Loader text="Scanning..." />:""}
            <DrillHole drillholes={app.drillholes} />
            <button onClick={()=>setCreate(true)}>New Drilhole <i className="material-icons">add_circle_outline</i></button>
            {create?<DrillHoleConfig createDrillHole = {createDrillHole} />:""}

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