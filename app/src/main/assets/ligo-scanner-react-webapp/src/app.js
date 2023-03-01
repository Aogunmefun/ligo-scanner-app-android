import React, {useEffect, createContext, useState} from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/homePage";
import ConfigurePage from "./pages/configure/configurePage";
import Navbar from "./components/navbar/navbar";
import ScanPage from "./pages/scan/scanPage";
import DevicesPage from "./pages/devices/devicesPage";

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
                    {
                        depth: 70,
                        color: {
                            r: 123,
                            g: 50,
                            b:2
                        },
                        velocity: 4821
                    },
                    
                    
                ],
                custom:[
    
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
                custom:[
    
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
                ]
            }
        ]
    })
    
    useEffect(()=>{
        console.log("App re-Rendering")
    })



    
    

    return (
        <HashRouter>
            <Navbar />
            <Session.Provider value={{app:app, setApp:setApp}}>
                <Routes>
                
                    <Route path="/" element={<DevicesPage />} />
                    <Route path="/configure" element={<ConfigurePage/>} />
                    <Route path="/devices" element={<DevicesPage />} />
                    <Route path="/scan" element={<ScanPage />} />
                    
                </Routes>
            </Session.Provider>
            
        </HashRouter>
    )
}

export default App