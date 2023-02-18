import React, { useState } from "react";
import "./editScan.css"

function EditScan(props) {
    
    const [edit, setEdit] = useState(false)
    const [depth, setDepth] = useState("")

    // const handleEdit = ()=>{
    //     if (!editinfo) setEditInfo(true)
    //     else{
    //         setEditInfo(false)
    //         props.handleEditHole(name===""?props.hole.config.name:name)
            
            
    //     }
    // }

    return(
        <div className="editScan">
            <div className="scanRender">
                <h5>Color:</h5>
                <div style={{backgroundColor:`${props.scan.color?"rgb("+props.scan.color.r+","+props.scan.color.g+","+props.scan.color.b+")":""}`}} className="scanRenderColor"></div>
                <div className="scanRenderInfo">
                    <h5>Depth:</h5>
                    <h5>{props.scan.depth + "ft"}</h5>
                </div>
                <div className="scanRenderButtons">
                    <button className="btn--retakeScan">Retake Scan</button>
                    <button className="btn--renameScan">Rename Depth</button>
                </div>
                
            </div>
        </div>
    )
}

export default EditScan