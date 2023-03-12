import React from "react"
import DotLoader from "react-spinners/DotLoader";
import "./loader.css"

function Loader(props) {


    return(
        <div style={{display:`${props.loading||props.loading===null||props.loading===undefined?"":"none"}`}} className="loader">
            <DotLoader
                color={"#1DA0A5"}
                loading = {true}
                size = {150}

            />
            <h4>{props.text?props.text:"Connecting..."}</h4>
        </div>
    )
}

export default Loader