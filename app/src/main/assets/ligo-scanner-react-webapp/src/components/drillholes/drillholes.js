import React, { useEffect } from "react";
import "./drillholes.css"


function DrillHoles(props) {
    

    useEffect(()=>{
       
        window.scroll({
            top: document.querySelector(".drillholes").scrollHeight,
            left:0,
            behavior: 'smooth'
        })
        
    })

    const handleExpand = (el)=> {
        console.log(el.currentTarget.style.height)
        el.currentTarget.parentElement.style.height = el.currentTarget.parentElement.style.height==="fit-content"?"150px":"fit-content"
        window.scroll({
            top: document.querySelector(".drillholes").scrollHeight,
            left:0,
            behavior: 'smooth'
        })
    }

    return(
        <div className="drillholes">
            {
                props.drillholes.map((hole,index)=>{
                    return(
                        <div style={{height:"150px"}} key={hole.config.name+index} id={hole.config.name} className="hole">
                        <h5 onClick={handleExpand}>{hole.config.name} <i className="material-icons">expand_more</i></h5>
                            <div className="hole-header">
                                <div  className="holeinfo">
                                   
                                    <h6>{"Interval: " + hole.config.interval + "ft"}</h6>
                                    <h6>{"Start Depth: " + hole.config.start + "ft"}</h6>
                                </div>
                                <button onClick={()=>props.handleSetActiveHole(index)} className="btn--setHoleActive">Set Active</button>
                            </div>
                            
                            
                            <h5>Scans:</h5>
                            {
                                hole.data.map((scan,index)=>{
                                    return(
                                        <div key={scan.depth+index} className="holeScan">
                                            <h5>{scan.depth + "ft"}</h5>
                                            <div style={{backgroundColor:`${scan.color?"rgb("+scan.color.r+","+scan.color.g+","+scan.color.b+")":""}`}} className="holeScanColor">
                                                
                                            </div>
                                            {/* <h5>{scan.color?"R:"+scan.color.r+" G:"+scan.color.g+" B:"+scan.color.b:""}</h5> */}
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default DrillHoles