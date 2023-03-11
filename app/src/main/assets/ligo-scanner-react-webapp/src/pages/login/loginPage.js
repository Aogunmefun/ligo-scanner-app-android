import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Splash from "../../components/splash/splash";
import Loader from "../../components/loader/loader";
import "./loginPage.css"
import Code from "../../components/code/code";
import axios from "axios";
import { Session } from "../../app";
import Modal from "../../components/modal/modal";


function LoginPage() {
    
    const [begin, setBegin] = useState(false)
    const [email, setEmail] = useState("")
    const [stage, setStage] = useState(1)
    const [submitEmail, setSubmitEmail] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState({state:false, text:""})
    const [code, setCode] = useState([])

    let navigate = useNavigate()
    let app = useContext(Session)

    useEffect(()=>{
        app.setApp({...app.app, navbar:false})
    },[])

    const handleEmail = (ev)=>{
        setEmail(ev.target.value.toLowerCase())
        if (email.includes("@")) {
            setSubmitEmail(true)
        }
    }

    const findUser = (ev)=>{
        ev.preventDefault()
        setSubmitEmail(false)
        setLoading(true)
        console.log("yo")
        axios({
            url:"https://api.alphaspringsedu.com/ligo-find-user",
            method:"POST",
            headers:{"Content-Type":"application/json"},
            data:{
                email:email
            }
        }).then((res)=>{
            console.log(res.data)
            setStage(2)
            setLoading(false)
            setSubmitEmail(false)
            if (res.data.res===null) {
                setModal({state:true, text:"User doesn't Exist. However, we created a new user using this email"})

            }
            
        }).catch((e)=>{
            console.log("error")
            alert(e.message)
            // while(1){}
            setLoading(false)
            setSubmitEmail(true)
            setModal({state:true, text:"Error encountered. Please try again"})
    
            // setStage(2)
            
        })
        
    }

    const Login = (ev)=>{
        ev.preventDefault()
        setLoading(true)
        console.log(code)
        axios({
            url:"https://api.alphaspringsedu.com/ligo-login",
            method:"POST",
            headers:{"Content-Type":"application/json"},
            data:{
                email:email,
                code: code.join("")
            }
        }).then((res)=>{
            
            if (res.data.res==="badAuth") {
                setModal({state:true, text:"Incorrect Code"})
                
            }
            else {
                navigate("/devices")
                app.setApp(res.data.res)
            }
            setLoading(false)
        })
    }

    return(
        <div className="loginPage">
        {modal.state?<Modal text={modal.text} setModal={setModal} />:""}
            <div className="loginDisplay">
                
                <Splash begin={begin} setBegin={setBegin} />
                <Loader loading={loading} />
                {   
                    <div className={`loginForm ${begin?"loginFormAppear":""}`}>
                        {
                            stage===1?
                            <form className={`loginFields ${stage===1?"loginFormAppear":"slideOutRight"}`} onSubmit={findUser}>
                                <input type="text" 
                                    placeholder="Enter Email" 
                                    value={email} 
                                    onChange={handleEmail} 
                                    disabled={loading}
                                />
                            </form>
                            :""
                        }
                        {
                            stage===2?
                            <form className={`loginFields ${stage===2?"slideInright":""}`} onSubmit={Login}>
                                <h2>Enter the Code that was sent to your email</h2>
                                <Code code={code} setCode={setCode} length={4} />
                                <input type="submit" value="Log-in" />
                            </form>
                            :""
                        }
                        
                        {<button onClick={findUser} style={{opacity:`${submitEmail?1:0}`}} className="btn--flat">Next<i style={{opacity:`${submitEmail?1:0}`}} className="material-icons">arrow_forward</i></button>}
                    </div>
                    
            }
            </div>
        </div>
    )
}

export default LoginPage