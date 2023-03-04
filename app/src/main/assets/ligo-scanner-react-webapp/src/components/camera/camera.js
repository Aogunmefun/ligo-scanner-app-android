import React, { useState, useRef, useEffect, useContext } from "react";
import "./camera.css"
import Webcam from "react-webcam";
import {useOpenCv } from 'opencv-react'
import { Session } from "../../app";



function MyComponent() {
    const data = useOpenCv()
    console.log(data)
    return <p>OpenCv React test: {data.cv ? 'loaded.' : 'loading...'}</p>
  }


function Camera(props) {
    
    const webcamRef = React.useRef(null);
    const [img, setImg] = useState(null)
    const [again, setAgain] = useState(false)
    const [hide, setHide] = useState(false)
    const app = useContext(Session)
    
    // const capture = React.useCallback(
    //     () => {
    //     const imageSrc = webcamRef.current.getScreenshot();
    //     },
    //     [webcamRef]
    // );
    // const data = useOpenCv()

    useEffect(()=>{
        // webcamRef.current.style.visibility = "hidden"
        // console.log(webcamRef.current)
        // const imgStream = setInterval(() => {
        //     // if (props.loaded) setImg(webcamRef.current.getScreenshot())
        //     setImg(webcamRef.current.getScreenshot())
        //     // if (data.cv) {
        //         console.log("ryting")
        //     // }
    
        // }, 100);

        // return () => {
        //     clearInterval(imgStream);
        //   };
        
        },[])

    const showOutput = ()=>{
        let cv = app.app.cv
        console.log("here")
        // console.log(data.cv)
        setImg(webcamRef.current.getScreenshot())
        // document.getElementById("img").src = webcamRef.current.getScreenshot()
        
        // document.getElementById("img").src = img;
        if (document.getElementById("img")?.src) {
            
            // console.log("tyring", document.getElementById("img"))
            let output = cv.imread(document.getElementById("img"))
            
            let imghsv = new cv.Mat()
            cv.cvtColor(output,imghsv, cv.COLOR_BGR2HSV)
            let mask = new cv.Mat()
            let red_lower = new cv.Mat(imghsv.rows, imghsv.cols, imghsv.type(),[0,100,20,0])
            let red_upper = new cv.Mat(imghsv.rows, imghsv.cols, imghsv.type(),[255, 255, 255,255])
            cv.inRange(imghsv, red_lower, red_upper, mask)
            let masked_img = new cv.Mat()
            cv.bitwise_and(output, output, masked_img, mask)
            cv.imshow("imageRender",masked_img)
            setHide(true)
        }
        
    }

    return(
        <div  className="camera">
            {/* <p>{data.cv ? 'initialized.' : 'initializing...'}</p> */}
            {!hide?<button onClick={()=>{
                showOutput()
            }}>Capture</button>:<button onClick={()=>setHide(false)}>Take Another</button>}
            {<button onClick={()=>props.setRoughScan(false)}>Back</button>}
            {!hide?<Webcam 
                videoConstraints={
                    {facingMode: { exact: "environment" }}
                }
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"

            />:""}
            {!hide?<img id="img" src={img} alt="" />:""}
            <canvas id="imageRender"></canvas>
            
        </div>
        
    )
}

export default Camera