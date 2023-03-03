import React, { useState, useRef, useEffect } from "react";
import "./camera.css"
import Webcam from "react-webcam";
import { OpenCvProvider, useOpenCv } from 'opencv-react'


function MyComponent() {
    const data = useOpenCv()
    console.log(data)
    return <p>OpenCv React test: {data.cv ? 'loaded.' : 'loading...'}</p>
  }


function Camera(props) {
    
    const webcamRef = React.useRef(null);
    const [img, setImg] = useState(null)
    // const capture = React.useCallback(
    //     () => {
    //     const imageSrc = webcamRef.current.getScreenshot();
    //     },
    //     [webcamRef]
    // );
    const data = useOpenCv()

    useEffect(()=>{
        // webcamRef.current.style.visibility = "hidden"
        // console.log(webcamRef.current)
        const imgStream = setInterval(() => {
            // if (props.loaded) setImg(webcamRef.current.getScreenshot())
            setImg(webcamRef.current.getScreenshot())
            // if (data.cv) {
                
            // }
    
        }, 1000);

        return () => {
            clearInterval(imgStream);
          };
    }, [])

    const showOutput = ()=>{
        console.log(data.cv)
        // document.getElementById("img").src = img;
        if (document.getElementById("img").src) {
            
            // console.log("tyring", document.getElementById("img"))
            let output = data.cv.imread(document.getElementById("img"))
            
            let imghsv = new data.cv.Mat()
            data.cv.cvtColor(output,imghsv, data.cv.COLOR_BGR2HSV)
            let mask = new data.cv.Mat()
            let red_lower = new data.cv.Mat(imghsv.rows, imghsv.cols, imghsv.type(),[0,100,20,0])
            let red_upper = new data.cv.Mat(imghsv.rows, imghsv.cols, imghsv.type(),[255, 255, 255,255])
            data.cv.inRange(imghsv, red_lower, red_upper, mask)
            let masked_img = new data.cv.Mat()
            data.cv.bitwise_and(output, output, masked_img, mask)
            data.cv.imshow("imageRender",masked_img)
        }
        
    }

    return(
        <div className="camera">
            return <p>OpenCv React test: {data.cv ? 'loaded.' : 'loading...'}</p>
            <Webcam 
                videoConstraints={
                    {facingMode: { exact: "environment" }}
                }
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/png"

            />
            
            <button onClick={()=>console.log(data.cv)}></button>
            <img id="img" src={img} alt="" />
            <canvas id="imageRender"></canvas>
            {data.cv?showOutput():""}
        </div>
        
    )
}

export default Camera