import React, { useState } from "react";
import "./drillholeConfig.css"


function DrillHoleConfig(props) {

    const [name, setName] = useState("")
    const [interval, setInterval] = useState(0)
    const [start, setStart] = useState(0)

    const handleSubmit = (ev)=>{
        ev.preventDefault()
        props.createDrillHole(name, parseInt(interval), parseInt(start))
        setName("")
        setInterval(0)
        setStart(0)
        console.log("submit")
    }

    const handleClose = ()=>{

    }

    const changeName = (ev)=>{
        setName(ev.target.value)
    }
    const changeInterval = (ev)=>{
        setInterval(ev.target.value)
    }
    const changeStart = (ev)=>{
        setStart(ev.target.value)
    }

    return (
        <div className="drillholeConfig">
            <h4>Hole configuration</h4>
            <div className="drillholeConfigBox">
                <form className="drillholeConfigForm" onSubmit={handleSubmit}>
                    <input required type="text" placeholder="Hole Name" value={name} onChange={changeName} />
                    <label htmlFor="interval">Inteval:</label>
                    <input required id="interval" type="number"  placeholder={0} value={interval} onChange={changeInterval}  />
                    <label htmlFor="start">Start Depth:</label>
                    <input required id="start" type="number"  placeholder={0} value={start} onChange={changeStart} />
                    <input type="submit" value="Create" />
                    
                </form>
                <button onClick={props.handleCloseNewDrillhole} className="btn--closenewDrillhole">Close</button>
            </div>
            
        </div>
    )
}

export default DrillHoleConfig