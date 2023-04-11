import React, { useState, useContext, useEffect } from "react";
import "./coreScan.css"
import { Session } from "../../app";
import DrillHoleConfig from "../../components/drillholeConfig/drillholeConfig";
import Modal from "../../components/modal/modal";
import DrillCore from "../../components/drillCore/drillCore";
import axios from "axios";
import Loader from "../../components/loader/loader";

function CoreScan() {
    
    const [create, setCreate] = useState(false)
    const [modal, setModal] = useState({state:false, text:""})
    const app = useContext(Session)
    const [loading, setLoading] = useState(false)
    

    useEffect(()=>{
        let temp = app.app
        temp.navbar = true
        app.setApp({...temp})
        // console.log(app.app.user.drillcores)
    },[])

    const newDrillcore = ()=>{
        let temp = app.app
        

        // console.log("bool", lastCore ,!lastCore.name, temp.user.drillcores.length)
        
        if (!app.app.user.drillcores) {
            temp.user = {
                ...temp.user,
                drillcores: [

                ]
            }
        }
        let lastCore = temp.user.drillcores[0]
        if (lastCore && (!lastCore.name || !lastCore.startDepth || !lastCore.endDepth || !lastCore.fileName)) {
            setModal({state:true, text:"Please make sure every field of previous measurement is filled"})
            return
        }
        temp.user.drillcores.unshift({
            name: "",
            startDepth: "",
            endDepth: "",
            type: "",
            fileName: "",
        })
        app.setApp({...temp})
    }

    const upload = ()=>{
        setLoading(true)
        axios({
            url:"http://api.alphaspringsedu.com/core-upload",
            method:"POST",
            headers:{"Content-Type":"application/json"},
            data:{
                email:app.app.user.email,
                drillcores: app.app.user.drillcores
            }
        }).then((res)=>{
            console.log(res.data)
            app.setApp({
                ...app.app,
                user: {
                    email: res.data.user.email,
                    drillholes: res.data.user.drillholes,
                    drillcores: res.data.user.drillcores
                }
            })
            setLoading(false)
            
        }).catch((e)=>{
            console.log(e.message)
        })
    }
    

    return(
        <div className="coreScan">
        {loading?<Loader text="Uploading..." />:""}
            {
                modal.state?
                <Modal
                    text={modal.text}
                    setModal={setModal}
                />  
                :""
            }
            <p>Drillcore Scans:</p>
            <button onClick={upload}>Upload</button>
            <button onClick={newDrillcore}><i className="material-icons">add</i></button>
            {
                app.app.user.drillcores?.map((core, index)=>{
                    return(
                        <DrillCore 
                            key={core.name+index}
                            name={core.name}
                            startDepth = {core.startDepth}
                            endDepth = {core.endDepth}
                            type = {core.type}
                            fileName = {core.fileName}
                            index = {index}
                        />
                    )
                })
            }
            
        </div>
    )
}

export default CoreScan