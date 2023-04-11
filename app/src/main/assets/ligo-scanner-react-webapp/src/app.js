import React, {useEffect, createContext, useState} from "react";
import { BrowserRouter, HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import HomePage from "./pages/home/homePage";
import ConfigurePage from "./pages/configure/configurePage";
import Navbar from "./components/navbar/navbar";
import ScanPage from "./pages/scan/scanPage";
import DevicesPage from "./pages/devices/devicesPage";
import ImuPage from "./pages/imu/imuPage";
import Splash from "./components/splash/splash";
import LoginPage from "./pages/login/loginPage";
import Modal from "./components/modal/modal";
import CoreScan from "./pages/coreScan/coreScan";

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
        connected:true,
        endpoint:"",
        navbar:false,
        cv:null,
        active: 0,
        sidenavOpen: false,
        timeStamp:0,
        rescan:false,
        rescanindex:null,
        user:null
    })
    const [modal, setModal] = useState({state:false, text:""})
    const [refresh, setRefresh] = useState(false)


    // const [app, setApp] = useState({
    //     device: {
    //         active: "coreScan",
    //         name: null,
    //         address: null,
    //         // type: null,
    //         paired: true
    //     },
    //     connected:true,
    //     endpoint:"",
    //     navbar:false,
    //     cv:null,
    //     active: 0,
    //     sidenavOpen: false,
    //     timeStamp:0,
    //     rescan:false,
    //     rescanindex:null,
    //     user: {
    //         email: "deoluutah@yahoo.com",
    //         drillholes: [],
    //         drillcores: [
    //             {
    //                 name:"AA45",
    //                 startDepth: "12",
    //                 endDepth: "32",
    //                 type: "UG",
    //                 fileName: "asdfadsf"
    //             }

    //         ]
    //     }
        
    // })
    
    useEffect(()=>{
        const script = document.createElement('script');
        script.src = "opencv/opencv.js";
        script.async = true;
        script.onload = ()=>{
            // console.log("finished", cv)
            let temp = app
            temp.cv = cv
            setApp(temp)
        }
        document.body.appendChild(script);
        window.addEventListener('noDevices', noDevices)
        

        return ()=>{
            document.body.removeChild(script);
        }
        
    },[])
    
    useEffect(()=>{
        // console.log("refresh", app.user.drillholes)
        window.addEventListener('InternetConnected', connected)
        window.addEventListener('InternetDisconnected', disconnected)
        console.log(app.device)
        return ()=>{
            window.removeEventListener('InternetConnected', connected)
            window.removeEventListener('InternetDisconnected', disconnected)
        }
        
    })


    const connected = ()=>{
        // console.log("CONNECTED", app.user.drillholes)
        setApp({
            ...app,
            connected:true
        })
        setModal({state:true, text:"Connection re-established. All features available"})
    }

    const disconnected = ()=>{
        // console.log("DISCONNECTED", app.user.drillholes)
        setApp({
            ...app,
            connected:false
        })
        setModal({state:true, text:"No connection detected. Please re-connect to keep data up to date and utilize full app capabilities"})
    }



    const noDevices = ()=>{
        setModal({state: true, text:"No devices connected. Please select a device on the devices page"})
        let temp = app.app
        temp.device.name = null
        temp.device.address = null
        temp.device.active = null
        temp.device.paired = false
        app.setApp({...temp})
    }
    

    return (
        // <BrowserRouter>
        <HashRouter>
            <Session.Provider value={{app:app, setApp:setApp}}>
            {app.navbar?<Navbar />:""}
            {
                modal.state?
                <Modal
                    text={modal.text}
                    setModal={setModal}
                />  
                :""
            }
            
                <Routes>
                
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path="/configure" element={<ConfigurePage/>} />
                    <Route path="/devices" element={<DevicesPage />} />
                    <Route path="/scan" element={<ScanPage />} />
                    <Route path="/orientation" element={<ImuPage />} />
                    <Route path="/coreScan" element={<CoreScan />} />
                </Routes>
            </Session.Provider>
            {/* <button onClick={()=>Android.isPaired()}>Get Paired Devices</button> */}
        </HashRouter>
        // {/* </BrowserRouter> */}
    )
}

export default App