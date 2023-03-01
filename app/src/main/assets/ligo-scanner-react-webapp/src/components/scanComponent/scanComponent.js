import React, { useState } from "react";
import "./scanComponent.css"


function ScanComponent(props) {

    const [edit, setEdit] = useState(false)
    const [depth, setDepth] = useState("")
    const [editvelocity, setEditVelocity] = useState(false)
    const [velocity, setVelocity] = useState("")
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

    const handleChangeVelocity = ()=>{
        console.log("yup")
        setEditVelocity(false)
        
        if (edit&&((parseInt(depth) === props.vel.depth)||!depth)) {
            setEdit(false)
            return
        }
        
        console.log("boo")
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
    

    return(
        <div  className="scanComponent">
            <div className="holeScan">
                {
                    edit?
                    <form onSubmit={props.velocity?handleChangeVelocity:handleEdit}>
                        
                        <input type="number" placeholder={props.scan.depth} value={depth} onChange={changeDepth}  />
                        <button type="submit" className="btn--editDepth">Confirm</button>
                    </form>
                    
                    :<h5 onClick={handleEdit}>{props.scan.depth + "ft"}</h5>
                }
                
                {
                    edit?
                    "":
                    !props.velocity?
                    <>
                        <div 
                            onClick={()=>props.rescan(props.index)} 
                            style={{backgroundColor:`${props.scan.color?"rgb("+props.scan.color.r+","+props.scan.color.g+","+props.scan.color.b+")":""}`}} 
                            className="holeScanColor">
                        
                        </div>
                    </>
                    :<>
                        {
                            <>
                                {/* {
                                editvelocity?
                                    
                                    :<h5 onClick={()=>setEditVelocity(!editvelocity)}>{props.vel.velocity}</h5>
                                } */}
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
 
                        }
                    </>
                    
                }
                
                {/* <h5>{scan.color?"R:"+scan.color.r+" G:"+scan.color.g+" B:"+scan.color.b:""}</h5> */}
            </div>
        </div>
    )
}

export default ScanComponent