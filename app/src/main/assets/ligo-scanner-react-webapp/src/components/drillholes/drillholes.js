import React, { useEffect, useState } from "react";
import "./drillholes.css"


function DrillHoles(props) {
    
    const [expanded, setExpanded] = useState(false)
    const [editinfo, setEditInfo] = useState(false)
    const [name, setName] = useState("")
    const [page, setPage] = useState(true)

    useEffect(()=>{
       
        window.scroll({
            top: document.querySelector(".drillholes").scrollHeight,
            left:0,
            behavior: 'smooth'
        })
        
    }, [expanded])

    const handleExpand = (el)=> {
        console.log(el.currentTarget.style.height)
        el.currentTarget.parentElement.style.height = el.currentTarget.parentElement.style.height==="fit-content"?"150px":"fit-content"
        window.scroll({
            top: document.querySelector(".drillholes").scrollHeight,
            left:0,
            behavior: 'smooth'
        })
    }

    const changeName = (ev)=>{
        setName(ev.target.value)
    }

    const handleEdit = ()=>{
        if (!editinfo) setEditInfo(true)
        else{
            setEditInfo(false)
            props.handleEditHole(
                name===""?props.hole.config.name:name, 
                props.hole.config.interval,
                props.index
            )
            setName("")
            
        }
    }

    return(
        <div className="drillholes">
            {

                <div style={{height:`${!expanded?"160px":"fit-content"}`}} id={props.hole.config.name} className="hole">
                    <div className="archiveHoleHeader">
                        {
                            !editinfo?
                            <h5 onClick={()=>setExpanded(!expanded)}>
                                {props.hole.config.name} 
                                <i className="material-icons">
                                {!expanded?"expand_more":"expand_less"}
                                </i>
                            </h5>:
                            <input type="text" placeholder={props.hole.config.name} value={name} onChange={changeName}  />
                        }
                        <button onClick={handleEdit} className="btn--flat">
                            {/* {editinfo?"Confirm":"Edit"}  */}
                            <i className="material-icons">
                                {editinfo?"done":"edit"}
                            </i>
                        </button>
                    </div>
                    
                    <div className="hole-header">
                        <div  className="holeinfo">
                            
                            <h6>{"Interval: " + props.hole.config.interval + "ft"}</h6>
                            <h6>{"Start Depth: " + props.hole.config.start + "ft"}</h6>
                        </div>
                        <div className="drillholes--buttons">
                            <button onClick={()=>props.handleSetActiveHole(props.index)} className="btn--setHoleActive">Set Active</button>
                            <button onClick={()=>props.archiveHole(props.index)} className="btn--deleteHole">Archive</button>
                        </div>
                        
                    </div>
                    
                    
                    <h5>{props.device==="colorimeter"?"Colors:":"Velocity:"}</h5>
                    {
                        props.device==="colorimeter"?
                        props.hole.data.map((scan,index)=>{
                            return(
                                <div key={scan.depth+index} className="holeScan">
                                    <h5>{scan.depth + "ft"}</h5>
                                    <div style={{backgroundColor:`${scan.color?"rgb("+scan.color.r+","+scan.color.g+","+scan.color.b+")":""}`}} className="holeScanColor">
                                        
                                    </div>
                                    {/* <h5>{scan.color?"R:"+scan.color.r+" G:"+scan.color.g+" B:"+scan.color.b:""}</h5> */}
                                </div>
                            )
                        })
                        :
                        props.hole.velocity.map((vel,index)=>{
                            return(
                                <div key={props.hole.config.name+"velocity"+vel.depth} className="velocity-render">
                                    <h5>{vel.depth+"ft"}</h5>
                                    {
                                       <h5>{vel.velocity}</h5>
                                    }
 
                                </div>
                            )
                        })
                    }
                </div>

            }
        </div>
    )
}

export default DrillHoles