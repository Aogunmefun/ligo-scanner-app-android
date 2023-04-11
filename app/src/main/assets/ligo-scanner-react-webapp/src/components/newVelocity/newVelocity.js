import React, { useState } from "react";
import "./newVelocity.css"


function NewVelocity(props) {

    const [depth, setDepth] = useState("")
    const [velocity, setVelocity] = useState("")

    const handleSubmit = (ev)=>{
        ev.preventDefault()
        props.newVelocity(parseInt(depth), parseInt(velocity))
        setDepth("")
        setVelocity("")
        console.log("submit")
    }

    const changeDepth = (ev)=>{
        setDepth(ev.target.value)
    }
    const changeVelocity = (ev)=>{
        setVelocity(ev.target.value)
    }
    const changeStart = (ev)=>{
        setStart(ev.target.value)
    }
 
    return(
        <div className="newVelocity">
            <h4>New Strength Measurment</h4>
            <div className="newVelocityConfigBox">
                <form className="newVelocityConfigForm" onSubmit={handleSubmit}>
                    <label htmlFor="start">Depth:</label>
                    <input required id="start" type="number"  placeholder={0} value={depth} onChange={changeDepth} />
                    <label htmlFor="interval">Velocity:</label>
                    <input required id="interval" type="number"  placeholder={0} value={velocity} onChange={changeVelocity}  />
                    <input type="submit" value="Create" />
                </form>
                <button onClick={()=>props.setNewVelocity(false)} className="btn--closenewDrillhole">Close</button>
            </div>
        </div>
    )
}

export default NewVelocity