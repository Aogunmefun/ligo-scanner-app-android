import React, { useState, useEffect } from "react";
import "./code.css"

function Code(props) {

    const [code, setCode] = useState([])

    useEffect(()=>{
        let temp = []
        for (let i = 0; i < props.length; i++) {
            temp.push("")
            console.log("print")
        }
        setCode(temp)
        props.setCode(temp)
    },[])

    useEffect(()=>{
        
    })

    const handleInput = (ev, index)=>{
        console.log(ev.target.value.split(""))
        if (ev.target.value.split("").length > 2) {

            console.log("yo know", ev.target.value.slice(0,4))
            setCode(ev.target.value.slice(0,4).split(""))
            props.setCode(ev.target.value.slice(0,4).split(""))
            document.querySelectorAll(".codeBox")[props.length-1].focus()
        }
        else {
            setCode(chars=>chars.map((char,innerIndex)=>{
                if (index===innerIndex) {
                    if (!ev.target.value.split("").pop()) {
                        return ""
                    } 
                    else {
                        return ev.target.value.split("").pop()
                    }
                }
                else {
                    return char
                }
            }))
            props.setCode(chars=>chars.map((char,innerIndex)=>{
                if (index===innerIndex) {
                    if (!ev.target.value.split("").pop()) {
                        return ""
                    } 
                    else {
                        return ev.target.value.split("").pop()
                    }
                }
                else {
                    return char
                }
            }))
            if ((index !== props.length-1) && (ev.target.value!=="")) {
                document.querySelectorAll(".codeBox")[index+1].focus()
            }
            if ((index !== 0) && (ev.target.value==="")) {
                document.querySelectorAll(".codeBox")[index-1].focus()
            }
        }
        
    }

    
    return(
        <div className="code">
            {
                code.map((char,index)=>{
                    return(
                        <input value={char} 
                            onChange={(ev)=>handleInput(ev,index)} 
                            key={"code"+index} 
                            className="codeBox" 
                        />
                    )
                })
            }

        </div>
    )
}

export default Code