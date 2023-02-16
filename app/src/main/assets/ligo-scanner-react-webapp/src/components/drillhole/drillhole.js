import React from "react";
import "./drillhole.css"


function DrillHole(props) {
    

    const handleExpand = (el)=> {
        console.log(el.currentTarget.parentElement.style.height)
        el.currentTarget.parentElement.style.height = el.currentTarget.parentElement.style.height==="fit-content"?"150px":"fit-content"
        
    }

    return(
        <div className="drillhole">
            {
                props.drillholes.map((hole,index)=>{
                    return(
                        <div style={{height:"fit-content"}} key={hole.config.name+index} id={hole.config.name} className="hole">
                            <div onClick={handleExpand} className="holeinfo">
                                <h5>{hole.config.name}</h5>
                                <h6>{"Interval: " + hole.config.interval + "ft"}</h6>
                                <h6>{"Start Depth: " + hole.config.start + "ft"}</h6>
                            </div>
                            
                            <h5>Scans:</h5>
                            {
                                hole.data.map((scan,index)=>{
                                    return(
                                        <div key={scan.depth+index} className="holeScan">
                                            <h5>{"depth: " + scan.depth + "ft"}</h5>
                                            <div style={{backgroundColor:`${scan.color?"rgb("+scan.color.r+","+scan.color.g+","+scan.color.b+")":""}`}} className="holeScanColor">
                                                
                                            </div>
                                            <h5>{scan.color?"R:"+scan.color.r+" G:"+scan.color.g+" B:"+scan.color.b:""}</h5>
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

export default DrillHole