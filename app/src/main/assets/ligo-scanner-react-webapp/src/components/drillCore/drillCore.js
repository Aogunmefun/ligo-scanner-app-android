import React, { useState, useEffect, useContext } from "react";
import "./drillCore.css"
import { Session } from "../../app";
import Modal from "../modal/modal";


function DrillCore(props) {

    const [modal, setModal] = useState({state:false, text:""})

    const [edit, setEdit] = useState(false)
    const [name, setName] = useState(props.name)
    const [startDepth, setStartDepth] = useState(props.startDepth)
    const [endDepth, setEndDepth] = useState(props.endDepth)
    const [type, setType] = useState(props.type)
    const [fileName, setFileName] = useState(props.fileName)
    const app = useContext(Session)
    
    useEffect(()=>{
        // console.log(props.name)
    })
    
    const changeName = (ev)=>{
        setName(ev.target.value.toUpperCase())
    }

    const changeStartDepth = (ev)=>{
        setStartDepth(ev.target.value)
    }

    const changeEndDepth = (ev)=>{
        setEndDepth(ev.target.value)
    }

    const changeType = (ev)=>{
        console.log("type", ev.target.value)
        setType(ev.target.value)
    }

    const handleConfirm = ()=>{
        console.log(parseInt(startDepth))
        if (!name) {
            setModal({state:true, text:"Please enter a valid name"})
            return
        }
        if (parseInt(startDepth) > parseInt(endDepth)) {
            setModal({state:true, text:"Make sure end depth is greater than start depth"})
            return
        }
        if (!startDepth || !endDepth) {
            setModal({state: true, text: "Please enter a value for start depth and end depth"})
            return
        }
        if (type === "UG") {
            if (!(parseInt(startDepth) >= 0.1) || !(parseInt(endDepth) >= 0.1) || !(parseInt(startDepth) <= 5) || !(parseInt(endDepth) <= 5)) {
                setModal({state: true, text: "UG drill depths need to be between 0.1 and 5 feet"})
                return
            }
        }
        if (type === "Surface") {
            if (!(parseInt(startDepth) >= 0.1) || !(parseInt(endDepth) >= 0.1) || !(parseInt(startDepth) <= 10) || !(parseInt(endDepth) <= 10)) {
                setModal({state: true, text: "Surface drill depths need to be between 0.1 and 10 feet"})
                return
            }
        }
        if (!type) {
            setModal({state: true, text:"Please enter drill type"})
            return
        }
        let temp = app.app
        temp.user.drillcores[props.index] = {
            name: name,
            startDepth: startDepth,
            endDepth: endDepth,
            type: type,
            fileName: fileName
        }
        app.setApp({...temp})
        setEdit(false)
    }

    const getFile = ()=>{
        let file = Android.getFile()
        if (file) {
            console.log("File name: ", file)
            setFileName(file)
            let temp = app.app
            temp.user.drillcores[props.index] = {
            name: name,
            startDepth: startDepth,
            endDepth: endDepth,
            type: type,
            fileName: fileName
            }
            app.setApp({...temp})
        }
        else {

        }
    }

    return(
        <div className="drillCore">
            {
                modal.state?
                <Modal
                    text={modal.text}
                    setModal={setModal}
                />  
                :""
            }
            {
                edit?
                <input type="text" placeholder={props.name} onChange={changeName} value={name} />
                :<p onClick={()=>setEdit(true)}>{"Core Name: "} <span>{props.name}</span></p>
            }
            <div className="drillCoreDepth">
                {
                    <>
                        <p>{"Start Depth: "}
                            {
                                edit?
                                <input type="number" 
                                    placeholder={props.startDepth?props.startDepth:"StartDepth"} 
                                    value = {startDepth} onChange={changeStartDepth} 
                                />
                                :<span>{props.startDepth}</span>
                            }
                        </p>
                        <p>{"End Depth: "}
                            {
                                edit?
                                <input type="number" 
                                    placeholder={props.endDepth?props.endDepth:"endDepth"} 
                                    value = {endDepth} onChange={changeEndDepth} 
                                />
                                :<span>{props.endDepth}</span>
                            }
                        </p>
                    </>
                }
            </div>
            {
                <p>
                    {"Drill Type: "}
                    {
                        edit?
                        <select placeholder={props.type} onChange={changeType}>
                            <option value=""></option>
                            <option value="UG">UG</option>
                            <option value="Surface">Surface</option>
                        </select>
                        :<span>{props.type}</span>
                    }
                </p>
            }
            <p>{"File Name: "}<span>{fileName}</span></p>
            <div className="drillCoreButtons">
                {
                    edit?<button onClick={handleConfirm}><i className="material-icons"></i>done</button>:
                    <button onClick={()=>setEdit(true)}>Edit</button>
                }
                <button onClick={getFile}>Get Latest File</button>
                <button onClick={()=>Android.startCamera()}>Open Camera</button>
            </div>
            
        </div>
    )
}

export default DrillCore