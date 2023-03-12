import React, { useState, useEffect, useContext } from "react";
import "./drillhole.css"
import ScanComponent from "../scanComponent/scanComponent";
// import ImuPage from "../../pages/imu/imuPage";
import Camera from "../camera/camera";
import { OpenCvProvider } from "opencv-react";
import { Session } from "../../app";
import Loader from "../../components/loader/loader";
import Modal from "../../components/modal/modal";


function DrillHole(props) {

    const [editinfo, setEditInfo] = useState(false)
    const [editdepth, setEditDepth] = useState(false)
    
    const [startdepth, setStartDepth] = useState("")
    const [interval, setInterval] = useState("")
    
    const [expanded, setExpanded] = useState(true)
    const [page, setPage] = useState(true)

    const [angleScan, setAngleScan] = useState(false)
    const [imuindex, setImuIndex] = useState(null)

    const [roughScan, setRoughScan] = useState(false)
    const [roughindex, setRoughIndex] = useState(null)

    const [modal, setModal] = useState({state:false, text:""})
    const [loading, setLoading] = useState(false)

    const app = useContext(Session)


    
    useEffect(()=>{
        // console.log(document.querySelector(".drillhole").scrollHeight)
        
        if (!editinfo) {
            window.scroll({
                top: document.querySelector(".drillhole").scrollHeight,
                left:0,
                behavior: 'smooth'
            })
        }
        
    }, [props.scanning])

    const upload = (temp)=>{
        setLoading(true)
        axios({
            url:"https://api.alphaspringsedu.com/ligo-upload",
            method:"POST",
            headers:{"Content-Type":"application/json"},
            data:{
                email:app.app.email,
                data:temp
            }
        }).then((res)=>{
            setLoading(false)
            app.setApp(res.data.user)
        }).catch((e)=>setModal({state:true, text:e.message}))
    }

    
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
        console.log(props.hole.velocity, myindex)

        if ((parseInt(mydepth) === props.hole.velocity[myindex].depth)||!mydepth) {
            return
        }
        props.changeVelocity(
            parseInt(mydepth),
            parseInt(myvelocity),
            myindex
        )

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

    const getAngles = (angles)=>{
        setAngleScan(false)
        let temp = app.app
        temp.drillholes[app.app.active].orientation[imuindex].angle = {
            x: angles.x,
            // y:angles.y,
            // z:angles.z
        }
        console.log(temp)
        app.setApp({...temp})
        upload(temp)
    }

    const changeRoughness = (index, roughness)=>{
        let temp = app.app
        temp.drillholes[app.app.active].roughness[index].roughness = roughness
        app.setApp({...temp})
        upload(temp)
    }

    const enableCamera = ()=>{
        setRoughScan(true)
        props.setHide(true)
    }

    const render = ()=>{
        // console.log(props.device)
        if(props.device==="colorimeter"){
            return(
                <>
                    <h5>Colors</h5>
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
                                        device={props.device}    
                                    />
                                )
                            })
                            :<h5 style={{border:"none", textAlign:"center"}}>
                                Create new scan by pressing the scan button on the device...
                            </h5>
                           

                        }
                        <button onClick={props.handleManualDepth} className="btn--manualDepth">New manual depth</button>
                </>
            )
        }

        else if (props.device==="velocity") {
            return(
                <>
                    <h5>Velocity</h5>
                        {
                            
                            props.hole.velocity?.length > 0?
                            props.hole?.velocity?.map((vel,index)=>{
                                return(
                                    <ScanComponent 
                                        changeVelocity={props.changeVelocity}
                                        device={props.device}
                                        changeDepth={changeDepth} 
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
                                Click below to enter new velocity readings...
                            </h5>
                            
                        }
                        <button onClick={props.newVelocity} className="btn--manualDepth">New Velocity</button>
                </>
            )
        }

        else if (props.device==="orientation") {
            return(
                <>
                    <h5>Structures</h5>
                        {
                            
                            props.hole.orientation?.length > 0?
                            props.hole?.orientation?.map((angle,index)=>{
                                return(
                                    <ScanComponent 
                                        changeVelocity={props.changeVelocity}
                                        device={props.device}
                                        changeDepth={changeDepth} 
                                        key={props.hole.config.name+"orientation"+angle.depth} 
                                        scan={angle} 
                                        index={index} 
                                        edit={props.editScan}
                                        setEdit={props.setEditScan}   
                                        angle = {angle.angle}
                                        setAngleScan = {setAngleScan} 
                                        setHide = {props.setHide}
                                        setImuIndex = {setImuIndex}
                                    />
                                    
                                )
                            })
                            :<h5 style={{border:"none", textAlign:"center"}}>
                                Click below to enter new structure readings...
                            </h5>
                            
                        }
                        <button onClick={props.newOrientation} className="btn--manualDepth">New Structure</button>
                </>
            )
        }

        else if (props.device==="laser") {
            return(
                <>
                    <h5>Roughness</h5>
                        {
                            
                            props.hole.roughness?.length > 0?
                            props.hole?.roughness?.map((scan,index)=>{
                                return(
                                    <ScanComponent 
                                        changeVelocity={props.changeVelocity}
                                        device={props.device}
                                        changeDepth={changeDepth} 
                                        key={props.hole.config.name+"roughness"+scan.depth} 
                                        scan={scan} 
                                        roughness={scan.roughness}
                                        index={index} 
                                        edit={props.editScan}
                                        setEdit={props.setEditScan}   
                                        setHide = {props.setHide}
                                        setRoughIndex = {setRoughIndex}
                                        setRoughScan = {setRoughScan}
                                        changeRoughness = {changeRoughness}
                                    />
                                    
                                )
                            })
                            :<h5 style={{border:"none", textAlign:"center"}}>
                                Click below to enter new Roughness readings...
                            </h5>
                            
                        }
                        <button onClick={props.newRoughness} className="btn--manualDepth">New Structure</button>
                        <button onClick={enableCamera}>Enable Camera</button>
                </>
            )
        }
        
    }

    return(
        <div className="drillhole">
        {loading?<Loader text="..." />:""}
        {
                modal.state?
                <Modal
                    text={modal.text}
                    setModal={setModal}
                />  
                :""
            }
            {
                props.hole&&!angleScan&&!roughScan?
                
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
                                :<h6 onClick={handleEdit}>{"Interval: " + props.hole?.config.interval + "ft..."}</h6>
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
                                    {"Start Depth: " + props.hole?.config.start + "ft..."}</h6>
                            }
                        </div>
                        <div className="holebuttons">
                            {/* <button onClick={handleEdit} className="btn--flat">{editinfo?"Confirm":"Edit"} <i className="material-icons">{editinfo?"done":"edit"}</i></button> */}
                            {/* <button onClick={props.deleteHole} className="btn--deleteHole">Delete</button> */}
                        </div>
                        
                    </div>
                    {render()}
                    
                </div>
                : ""
                
            }
            {angleScan?<ImuPage setAngleScan={setAngleScan} getAngles={getAngles} />:""}
            {/* {
              
                <OpenCvProvider 
                    // openCvPath={
                    // 'opencv/opencv.js'
                    // }
                >
                    
                </OpenCvProvider>
                
                
            } */}
            {roughScan?<Camera  roughScan={roughScan} setRoughScan={setRoughScan}  />:""}
            <div className="drillhole-end"></div>
        </div>
    )
}

export default DrillHole