import React, {useEffect, createContext, useState} from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/homePage";
import ConfigurePage from "./pages/configure/configurePage";
import Navbar from "./components/navbar/navbar";
import ScanPage from "./pages/scan/scanPage";
import DevicesPage from "./pages/devices/devicesPage";
import ImuPage from "./pages/imu/imuPage";

export const Session = createContext()



function App(props) {

    const [app, setApp] = useState({
        device: {
            active: null,
            name: null,
            address: null,
            // type: null,
            paired: false
        },
        cv:null,
        active: 0,
        sidenavOpen: false,
        timeStamp:0,
        rescan:false,
        rescanindex:null,
        drillholes: [
            {
                config:{
                    name: "AA10",
                    interval: 10,
                    start: 50,
                    expanded: true,
                    
                },
                data:[
                    {
                        depth: 50,
                        color: {
                            r: 123,
                            g: 5,
                            b:150
                        },
                        velocity: 2302
                    },
                    {
                        depth: 60,
                        color: {
                            r: 2,
                            g: 5,
                            b:150
                        },
                        velocity: 3232
                    },
                
                    
                    
                ],
                velocity: [
                    {
                        depth: 50,
                        velocity: 2302
                    },
                    {
                        depth: 60,
                        velocity: 3232
                    },
                    {
                        depth: 70,
                        velocity: 4821
                    },
                 
                ],
                orientation: [
                    {
                        depth: 50,
                        angle: {
                            x: 0.35,
                            y: 0.25,
                            z:0.55
                        }
                    },
                ],
                roughness: [
                    
                ]
            },
            {
                config:{
                    name: "328",
                    interval: 10,
                    start: 50,
                    expanded: true,
                    
                },
                data:[
                    {
                        depth: 50,
                        color: {
                            r: 123,
                            g: 5,
                            b:150
                        },
                        velocity: 20405
                    },
                    {
                        depth: 60,
                        color: {
                            r: 2,
                            g: 5,
                            b:150
                        },
                        velocity: 6853
                    },
                    {
                        depth: 70,
                        color: {
                            r: 123,
                            g: 50,
                            b:2
                        },
                        velocity: 4521
                    },
                    
                ],
                velocity: [
                    {
                        depth: 50,
                        velocity: 20405
                    },
                    {
                        depth: 60,
                        velocity: 6853
                    },
                    {
                        depth: 70,
                        velocity: 4521
                    },
                ],
                orientation: [

                ],
                roughness: [
                    
                ]
            }
        ]
    })
    
    useEffect(()=>{
        const script = document.createElement('script');
        script.src = "opencv/opencv.js";
        script.async = true;
        script.onload = ()=>{
            console.log("finished", cv)
            let temp = app
            temp.cv = cv
            setApp(temp)
        }
        document.body.appendChild(script);
        return ()=>{
            document.body.removeChild(script);
        }
        
    },[])



    
    

    return (
        <HashRouter>
            <Navbar />
            <Session.Provider value={{app:app, setApp:setApp}}>
                <Routes>
                
                    <Route path="/" element={<DevicesPage />} />
                    <Route path="/configure" element={<ConfigurePage/>} />
                    <Route path="/devices" element={<DevicesPage />} />
                    <Route path="/scan" element={<ScanPage />} />
                    <Route path="/orientation" element={<ImuPage />} />
                    
                </Routes>
            </Session.Provider>
            
        </HashRouter>
    )
}

export default App