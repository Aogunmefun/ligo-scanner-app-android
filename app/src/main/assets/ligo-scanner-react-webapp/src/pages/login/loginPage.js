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
    
    const [begin, setBegin] = useState(true)
    const [email, setEmail] = useState("")
    const [stage, setStage] = useState(1)
    const [submitEmail, setSubmitEmail] = useState(false)
    const [loading, setLoading] = useState(false)
    const [modal, setModal] = useState({state:false, text:"", close:true})
    const [code, setCode] = useState([])

    let navigate = useNavigate()
    let app = useContext(Session)

    useEffect(()=>{
        app.setApp({...app.app, navbar:false})
        
    },[])

    useEffect(()=>{
        if (!app.app.connected) {
            setModal({state:true, text:"Connection not established. Login disabled", close:false})
            console.log("No internet")
        }
        else {
            setModal({state:false, text:"Connection not established. Login disabled", close:true})
            console.log("We have internet")
        }
    }, [app.app.connected])

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
            url:"http://api.alphaspringsedu.com/ligo-find-user",
            method:"POST",
            headers:{"Content-Type":"application/json"},
            data:{
                email:email
                // email:"deoluutah@yahoo.com"
            }
        }).then((res)=>{
            console.log(res.data)
            setStage(2)
            setLoading(false)
            setSubmitEmail(false)
            if (res.data.res===null) {
                
                setModal({state:true, text:"User doesn't Exist. However, we created a new user using this email"})
            }
            if (JSON.parse(localStorage.getItem("emails")) && JSON.parse(localStorage.getItem("emails")).includes(email)) {
                app.setApp({
                    ...app.app,
                    user: {
                        email: res.data.user.email,
                        drillholes: res.data.user.drillholes
                    }
                })
                navigate("/devices")
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
            url:"http://api.alphaspringsedu.com/ligo-login",
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
                let storedEmails = JSON.parse(localStorage.getItem("emails"))
                storedEmails?localStorage.setItem("emails", JSON.stringify([...storedEmails, res.data.res.email])):localStorage.setItem("emails", JSON.stringify([res.data.res.email]))
                app.setApp({
                    ...app.app,
                    user: {
                        email: res.data.res.email,
                        drillholes: res.data.res.drillholes
                    }
                })
                navigate("/devices")
                // console.log(res.data)
                
            }
            setLoading(false)
        })
    }

    const handleEmailSelect = (ev)=>{
        if(ev.target.value !== "") {
            setEmail(ev.target.value)
            setSubmitEmail(true)
        }
    }

    

    return(
        <div  className="loginPage">
        
        {modal.state?<Modal text={modal.text} setModal={setModal} close={modal.close} />:""}
            <div className="loginDisplay">
                <Splash findUser={findUser} begin={begin} setBegin={setBegin} />
                <Loader loading={loading} />
                {   
                    <div className={`loginForm ${begin?"loginFormAppear":""}`}>
                        {
                            stage===1?
                            <form className={`loginFields ${stage===1?"loginFormAppear":"slideOutRight"}`} onSubmit={findUser}>
                                {<input type="text" 
                                    placeholder="Enter Email" 
                                    value={email} 
                                    onChange={handleEmail} 
                                    disabled={loading}
                                />}
                                <h5> <hr />  Or <hr /> </h5>
                                <select  onChange={handleEmailSelect}>
                                    <option value="">Click to select an email</option>
                                    {
                                        JSON.parse(localStorage.getItem("emails"))?.map((storedEmail,index)=>{
                                            return(
                                                <option key={"storedEmails"+storedEmail} value={storedEmail}>{storedEmail}</option>
                                            )
                                        })
                                        
                                    }
                                </select>
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
                        
                        {<button onClick={findUser} style={{display:`${submitEmail?"":"none"}`}} className="btn--flat btn--login">Next<i  className="material-icons">arrow_forward</i></button>}
                    </div>
                    
            }
            </div>
        </div>
    )
}

export default LoginPage