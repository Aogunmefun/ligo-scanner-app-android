import React, { useState, useEffect } from "react";
import "./drillhole.css"
import ScanComponent from "../scanComponent/scanComponent";


function DrillHole(props) {

    const [editinfo, setEditInfo] = useState(false)
    const [name, setName] = useState("")
    const [interval, setInterval] = useState(0)
    
    useEffect(()=>{
        console.log(props.hole)
        
        if (name==="" && interval===0) {
            window.scroll({
                top: document.querySelector(".drillhole").scrollHeight,
                left:0,
                behavior: 'smooth'
            })
        }
        
    })

    const changeName = (ev)=>{
        setName(ev.target.value)
    }
    const changeInterval = (ev)=>{
        setInterval(ev.target.value)
    }

    const handleEdit = ()=>{
        if (!editinfo) setEditInfo(true)
        else{
            setEditInfo(false)
            props.handleEditHole(name===""?props.hole.config.name:name, interval===0?props.hole.config.interval:parseInt(interval))
            setName("")
            setInterval(0)
            
        }
    }

    const handleExpand = (el)=> {
        console.log(el.currentTarget.parentElement.style.height)
        el.currentTarget.parentElement.style.height = el.currentTarget.parentElement.style.height==="fit-content"?"150px":"fit-content"
        window.scroll({
            top: document.querySelector(".drillhole").scrollHeight,
            left:0,
            behavior: 'smooth'
        })
    }

    const changeDepth = (depth, index)=>{
        props.changeDepth(depth, index)
    }
    
    const rescan = (index)=>{
        props.rescan(index)
    }

    return(
        <div className="drillhole">
            {
                props.hole?
                
                <div style={{height:"fit-content"}} id={props.hole?.config.name} className="hole">
                    {
                        editinfo?
                        <input type="text" placeholder={props.hole?.config.name} value={name} onChange={changeName}  />
                        :<h5 onClick={handleExpand}>{props.hole?.config.name}<i className="material-icons">expand_more</i></h5>
                    }
                    <div className="hole-header">
                        <div  className="holeinfo">
                            
                            {
                                editinfo?
                                <input type="number"  placeholder={0} value={interval} onChange={changeInterval}  />
                                :<h6>{"Interval: " + props.hole?.config.interval + "ft"}</h6>
                            }
                            <h6>{"Start Depth: " + props.hole?.config.start + "ft"}</h6>
                        </div>
                        <div className="holebuttons">
                            <button onClick={handleEdit} className="btn--editHoleInfo">{editinfo?"Confirm":"Edit"}</button>
                            <button onClick={props.deleteHole} className="btn--deleteHole">Delete</button>
                        </div>
                        
                    </div>
                    
                    <h5>Scans:</h5>
                    {
                        props.hole?.data.map((scan,index)=>{
                            return(
                                <ScanComponent rescan={rescan} changeDepth={changeDepth} key={props.hole.config.name+scan.depth+index} scan={scan} index={index} />
                            )
                        })
                    }
                    <button onClick={props.handleManualDepth} className="btn--manualDepth">New manual depth</button>
                </div>
                :""
                
            }
            <div className="drillhole-end"></div>
        </div>
    )
}

export default DrillHole