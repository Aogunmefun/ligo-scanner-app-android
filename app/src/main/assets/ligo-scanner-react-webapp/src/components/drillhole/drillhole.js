import React, { useState, useEffect } from "react";
import "./drillhole.css"
import ScanComponent from "../scanComponent/scanComponent";


function DrillHole(props) {

    const [editinfo, setEditInfo] = useState(false)
    const [editdepth, setEditDepth] = useState(false)
    
    const [startdepth, setStartDepth] = useState("")
    const [interval, setInterval] = useState("")
    
    const [expanded, setExpanded] = useState(true)
    const [page, setPage] = useState(true)
    
    useEffect(()=>{
        console.log(props.hole)
        
        if (!editinfo) {
            window.scroll({
                top: document.querySelector(".drillhole").scrollHeight,
                left:0,
                behavior: 'smooth'
            })
        }
        
    }, [props.scanning, props.hole])

    
    const changeInterval = (ev)=>{
        setInterval(ev.target.value)
    }

    const handleEdit = ()=>{
        if (!editinfo) setEditInfo(true)
        else{
            setEditInfo(false)
            props.handleEditHole(
                props.hole.config.name, 
                !interval?props.hole.config.interval:parseInt(interval),
                props.index
            )
            setInterval("")
            
        }
    }

    const handleChangeStartDepth = ()=>{
        if (!editdepth) setEditDepth(true)
        else{
            setEditDepth(false)
            props.changeStartDepth(
                !startdepth?props.hole.config.start:parseInt(startdepth),
                props.index
            )
            setStartDepth("")
            
        }
    }

    const handleChangeVelocity = (mydepth, myvelocity, myindex)=>{
        setEditVelocity(false)
        if ((parseInt(velocityDepth) === props.hole.velocity[index].depth)||!velocityDepth) {
            return
        }
        props.changeVelocity(
            parseInt(velocityDepth),
            parseInt(velocity),
            index
        )
        setVelocityDepth("")
    }

    const changeDepth = (depth, index)=>{
        props.changeDepth(depth, index)
    }

    const changeStartDepth = (ev)=>{
        setStartDepth(ev.target.value)
    }

    
    
    const rescan = (index)=>{
        props.rescan(index)
    }

    return(
        <div className="drillhole">
            {
                props.hole?
                
                <div style={{height:`${!expanded?"150px":"fit-content"}`}} id={props.hole?.config.name} className="hole">
                    {
                        <h5>
                            {props.hole?.config.name}
                            
                        </h5>
                    }
                    <div className="hole-header">
                        <div  className="holeinfo--drillhole">
                            
                            {
                                editinfo?
                                <div className="drillhole-interval">
                                    <input type="number"  
                                        placeholder={props.hole?.config.interval} 
                                        value={interval} 
                                        onChange={changeInterval}  
                                    />
                                    <button onClick={handleEdit} className="btn--flat">
                                        {/* {editinfo?"Confirm":"Edit"}  */}
                                        <i className="material-icons">
                                            {editinfo?"done":"edit"}
                                        </i>
                                    </button>
                                </div>
                                :<h6 onClick={handleEdit}>{"Interval: " + props.hole?.config.interval + "ft"}</h6>
                            }
                            {
                                editdepth?
                                <div className="drillhole-interval">
                                    <input type="number"  
                                        placeholder={props.hole?.config.start} 
                                        value={startdepth} 
                                        onChange={changeStartDepth}  
                                    />
                                    <button onClick={handleChangeStartDepth} className="btn--flat">
                                        {/* {editinfo?"Confirm":"Edit"}  */}
                                        <i className="material-icons">
                                            {editdepth?"done":"edit"}
                                        </i>
                                    </button>
                                </div>
                                :<h6 onClick={()=>{props.hole?.data.length===0?setEditDepth(!editdepth):""}}>
                                    {"Start Depth: " + props.hole?.config.start + "ft"}</h6>
                            }
                        </div>
                        <div className="holebuttons">
                            {/* <button onClick={handleEdit} className="btn--flat">{editinfo?"Confirm":"Edit"} <i className="material-icons">{editinfo?"done":"edit"}</i></button> */}
                            {/* <button onClick={props.deleteHole} className="btn--deleteHole">Delete</button> */}
                        </div>
                        
                    </div>
                    
                    <h5>{props.device==="colorimeter"?"Colors:":"Velocity:"}</h5>
                    {
                        props.device==="colorimeter"?
                        <>
                            {
                                props.hole.data.length > 0?
                                props.hole?.data.map((scan,index)=>{
                                    return(
                                        <ScanComponent 
                                            rescan={rescan} 
                                            changeDepth={changeDepth} 
                                            key={props.hole.config.name+scan.depth+index} 
                                            scan={scan} 
                                            index={index} 
                                            edit={props.editScan}
                                            setEdit={props.setEditScan}    
                                        />
                                    )
                                })
                                :<h5 style={{border:"none", textAlign:"center"}}>
                                    Create new scan by pressing the scan button on the device...
                                </h5>
                            }
                        </>
                        :
                        <>
                            {
                                props.hole.velocity?.length > 0?
                                props.hole?.velocity?.map((vel,index)=>{
                                    return(
                                        <ScanComponent 
                                            changeVelocity={props.changeVelocity}
                                            velocity={true}
                                            changeDepth={handleChangeVelocity} 
                                            key={props.hole.config.name+"velocity"+vel.depth} 
                                            scan={vel} 
                                            index={index} 
                                            edit={props.editScan}
                                            setEdit={props.setEditScan}   
                                            vel = {vel} 
                                        />
                                        
                                    )
                                })
                                :<h5 style={{border:"none", textAlign:"center"}}>
                                    Click Add to enter new velocity readings...
                                </h5>
                            }
                        </>
                    }
                    {props.device==="colorimeter"?<button onClick={props.handleManualDepth} className="btn--manualDepth">New manual depth</button>:""}
                    {props.device!=="colorimeter"?<button onClick={props.newVelocity} className="btn--manualDepth">New Velocity</button>:""}
                </div>
                : ""
                
            }
            <div className="drillhole-end"></div>
        </div>
    )
}

export default DrillHole