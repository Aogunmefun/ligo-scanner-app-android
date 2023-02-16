import React, {useEffect, createContext} from "react";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/homePage";
import ConfigurePage from "./pages/configure/configurePage";
import BLEScan from "./pages/bleScan/bleScan";
import Navbar from "./components/navbar/navbar";
import ScanPage from "./pages/scan/scanPage";

export const Session = createContext()

const app = {
    device: {
        name: null,
        address: null,
        type: null,
        paired: false
    },
    sidenavOpen: false,
    drillholes: [
        {
            config:{
                name: "AA10",
                interval: 10,
                start: 50,
                expanded: true
            },
            data:[
                {
                    depth: 50,
                    color: {
                        r: 123,
                        g: 5,
                        b:150
                    }
                },
                {
                    depth: 60,
                    color: {
                        r: 2,
                        g: 5,
                        b:150
                    }
                },
                {
                    depth: 70,
                    color: {
                        r: 123,
                        g: 50,
                        b:2
                    }
                }
            ],
            custom:[

            ]
        }
    ]
}

function App(props) {
    
    useEffect(()=>{
        console.log("App re-Rendering")
    })



    
    

    return (
        <HashRouter>
            <Navbar />
            <Session.Provider value={app}>
                <Routes>
                
                    <Route path="/" element={<HomePage />} />
                    <Route path="/configure" element={<ConfigurePage/>} />
                    <Route path="/blescan" element={<BLEScan />} />
                    <Route path="/scan" element={<ScanPage />} />
                    
                </Routes>
            </Session.Provider>
            
        </HashRouter>
    )
}

export default App