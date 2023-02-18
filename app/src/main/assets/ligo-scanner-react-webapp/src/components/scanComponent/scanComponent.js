import React, { useState } from "react";
import "./scanComponent.css"


function ScanComponent(props) {

    const [edit, setEdit] = useState(false)
    const [depth, setDepth] = useState(0)

    const handleEdit = ()=>{
        if (!edit) setEdit(true)
        else {
            setEdit(false)
            props.changeDepth(depth===""?props.scan.depth:parseFloat(depth), props.index)
            setDepth(0)
        }
    }

    const changeDepth = (ev)=>{
        setDepth(ev.target.value)
    }
    

    return(
        <div  className="scanComponent">
            <div className="holeScan">
                {
                    edit?
                    <input type="number" placeholder={props.scan.depth} value={depth} onChange={changeDepth}  />
                    :<h5 onClick={handleEdit}>{props.scan.depth + "ft"}</h5>
                }
                
                {
                    edit?
                    <button onClick={handleEdit} className="btn--editDepth">Rename</button>
                    :<div onClick={()=>props.rescan(props.index)} style={{backgroundColor:`${props.scan.color?"rgb("+props.scan.color.r+","+props.scan.color.g+","+props.scan.color.b+")":""}`}} className="holeScanColor">
                    
                    </div>
                }
                
                {/* <h5>{scan.color?"R:"+scan.color.r+" G:"+scan.color.g+" B:"+scan.color.b:""}</h5> */}
            </div>
        </div>
    )
}

export default ScanComponent