import React, { useState } from "react";
import "./scanComponent.css"


function ScanComponent(props) {

    const [edit, setEdit] = useState(false)
    const [depth, setDepth] = useState("")
    const [editvelocity, setEditVelocity] = useState(false)
    const [velocity, setVelocity] = useState("")
    const [editrough, setEditRough] = useState(false)
    const [roughness, setRoughness] = useState("")
    const [velocityDepth, setVelocityDepth] = useState("")

    const handleEdit = ()=>{
        if (!edit) setEdit(true)
        else {
            setEdit(false)
            if ((parseFloat(depth) != props.scan.depth) && depth) {
                console.log("different")
                props.changeDepth(parseFloat(depth), props.index)
            }
            
            setDepth("")
        }
    }

    const changeDepth = (ev)=>{
        setDepth(ev.target.value)
    }

    const changeVelocity = (ev)=>{
        setVelocity(ev.target.value)
    }

    const changeRoughness = (ev)=>{
        setRoughness(ev.target.value)
    }

    const handleChangeVelocity = ()=>{

        console.log("boo", props.index)
        console.log("yup")
        setEditVelocity(false)
        
        if (edit&&((parseInt(depth) === props.vel.depth)||!depth)) {
            setEdit(false)
            return
        }
        
        console.log("boo", props.index)
        props.changeVelocity(
            parseInt(depth?depth:props.vel.depth),
            parseInt(velocity?velocity:props.vel.velocity),
            props.index,
            edit
        )
        setEdit(false)
        setVelocityDepth("")
        setDepth("")
    }

    const handleChangeRoughness = ()=>{
        setEditRough(false)
        if (roughness) {
            props.changeRoughness(
                props.index,
                roughness
            )
        }
        
    }

    const imuScan = ()=>{
        console.log("here")
        props.setImuIndex(props.index)
        props.setAngleScan(true)
        props.setHide(true)
    }

    const renderScan = ()=>{
        if (props.device==="colorimeter") {
            return(
                
                <>
                    <div 
                        onClick={()=>props.rescan(props.index)} 
                        style={{backgroundColor:`${props.scan.color?"rgb("+props.scan.color.r+","+props.scan.color.g+","+props.scan.color.b+")":""}`}} 
                        className="holeScanColor">
                    
                    </div>
                </>
                    
            )
        }

        else if (props.device==="velocity") {
            return(

                <>
                    {
                        editvelocity?
                        <form onSubmit={handleChangeVelocity}>
                            <input type="number" 
                                placeholder={props.vel.velocity} 
                                value={velocity} 
                                onChange={changeVelocity} 

                            />
                            <button type="submit" className="btn--flat">
                            
                                <i className="material-icons">
                                    done
                                </i>
                            </button>
                            
                            {/* <input type="submit" value="Done" /> */}
                        </form>
                        
                        :<h5 onClick={()=>setEditVelocity(!editvelocity)}>{props.vel.velocity}</h5>
                    }
                </>

            )
        }

        else if (props.device==="orientation") {
            return(
                <>
                    {
                        <div className="angles" onClick={()=>imuScan()}>{props.angle.x!==undefined?"x:"+props.angle.x:"tap to measure"}</div>
                    }
                </>
            )
        }

        else if (props.device==="laser") {
            return(
                <>
                    {
                        editrough?
                        <form onSubmit={handleChangeRoughness}>
                            <select type="number" 
                                // placeholder={props.roughness} 
                                // value={roughness} 
                                onChange={changeRoughness} 

                            >
                                <option value="">--</option>
                                <option value="0-2">0-2</option>
                                <option value="2-4">2-4</option>
                                <option value="4-6">4-6</option>
                                <option value="6-8">6-8</option>
                                <option value="8-10">8-10</option>
                                <option value="10-12">10-12</option>
                                <option value="12-14">12-14</option>
                                <option value="14-16">14-16</option>
                                <option value="16-18">16-18</option>
                                <option value="18-20">18-20</option>

                            </select>
                            <button type="submit" className="btn--flat">
                            
                                <i className="material-icons">
                                    done
                                </i>
                            </button>
                            
                            {/* <input type="submit" value="Done" /> */}
                        </form>
                        
                        :<h5 onClick={()=>setEditRough(!editrough)}>{props.roughness}</h5>
                    }
                </>
            )
        }
    }
    

    return(
        <div  style={{"--animationOrder": props.index}}  className="scanComponent">
            <div className="holeScan">
                {
                    edit?
                    <form onSubmit={handleEdit}>
                        
                        <input type="number" placeholder={props.scan.depth} value={depth} onChange={changeDepth}  />
                        <button type="submit" className="btn--editDepth">Confirm</button>
                    </form>
                    
                    :<h5 onClick={handleEdit}>{props.scan.depth + "ft"}</h5>
                }
                
                {
                    edit?
                    "":
                    renderScan()
                    
                }
                {
                    edit?"": <i className="material-icons">{props.scan.synced?"done":"warning"}</i>
                }
                
                {/* <h5>{scan.color?"R:"+scan.color.r+" G:"+scan.color.g+" B:"+scan.color.b:""}</h5> */}
            </div>
        </div>
    )
}

export default ScanComponent