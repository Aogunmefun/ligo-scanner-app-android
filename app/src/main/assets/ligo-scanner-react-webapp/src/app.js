import React, {useEffect} from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/homePage";
import ConfigurePage from "./pages/configure/configurePage";
import BLEScan from "./pages/bleScan/bleScan";
import Navbar from "./components/navbar/navbar";
import ScanPage from "./pages/scan/scanPage";

function App(props) {
    
    useEffect(()=>{
        console.log("App re-Rendering")
    })

    return (
        <HashRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/configure" element={<ConfigurePage/>} />
                <Route path="/blescan" element={<BLEScan />} />
                <Route path="/scan" element={<ScanPage />} />
            </Routes>
            
        </HashRouter>
    )
}

export default App