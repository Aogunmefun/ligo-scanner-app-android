import React, { useState, useRef, useEffect } from "react";
import "./camera.css"
import Webcam from "react-webcam";

function Camera(props) {
    
    const webcamRef = React.useRef(null);
    const [img, setImg] = useState(null)
    // const capture = React.useCallback(
    //     () => {
    //     const imageSrc = webcamRef.current.getScreenshot();
    //     },
    //     [webcamRef]
    // );

    useEffect(()=>{
        // webcamRef.current.style.visibility = "hidden"
        // console.log(webcamRef.current)
        const imgStream = setInterval(() => {
            setImg(webcamRef.current.getScreenshot())
    
        }, 100);

        return () => {
            clearInterval(imgStream);
          };
    }, [])

    return(
        <div className="camera">
            <Webcam 
                videoConstraints={
                    {facingMode: { exact: "user" }}
                }
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"

            />
            {img?<img src={img} alt="" />:""}
        </div>
    )
}

export default Camera