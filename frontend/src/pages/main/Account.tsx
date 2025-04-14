import React,{useState,useEffect} from "react";
import {hashString} from "../../utils/hash";
import {createSession,getSession,logoutSession} from "../../utils/session";
import "./Account.css";

export const Account: React.FC=() => {
    const[loading,setLoading]=useState(true);
    const[isLoggedIn,setIsLoggedIn]=useState(false);
    const[username,setUsername]=useState('');
    const[registerErrorType,setRegisterErrorType]=useState('');
    const[loginErrorType,setLoginErrorType]=useState('');

    useEffect(() => {
        const checkSession=async() => {
            try{
                const session=await getSession();
                if(session){
                    setUsername(session.username);
                    setIsLoggedIn(true);
                }else{
                    throw new Error("No session found");
                }
            }catch{
                setIsLoggedIn(false);
            }finally{
                setLoading(false);
            }
        };

        checkSession();
    });

    const register=async() => {
        const username=(document.getElementById("register_username") as HTMLInputElement).value;
        const password=(document.getElementById("register_password") as HTMLInputElement).value;

        try{
            if (username==="" || password==="") {
                setRegisterErrorType('emptyFields');
                throw new Error("Please fill in all fields");
            }if(username.length<4){
                setRegisterErrorType('usernameShort');
                throw new Error("Username must be at least 4 characters long");
            }if(password.length<8){
                setRegisterErrorType('passwordShort');
                throw new Error("Password must be at least 8 characters long");
            }if(password.length>20){
                setRegisterErrorType('passwordLong');
                throw new Error("Password must be at most 20 characters long");
            }if(!/^[a-zA-Z0-9]+$/.test(username)){
                setRegisterErrorType('usernameAlphanumeric');
                throw new Error("Username must only contain alphanumeric characters");
            }if(!/^[a-zA-Z0-9]+$/.test(password)){
                setRegisterErrorType('passwordAlphanumeric');
                throw new Error("Password must only contain alphanumeric characters");
            }else{
                setRegisterErrorType('')
            }

            const response=await fetch("/api/Account/register",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username,
                    password: hashString(password)
                })
            });

            if(!response.ok){
                setRegisterErrorType('accountRegister')
            }

            createSession({username});
            return;
        }catch(error){
            console.error("Error creating account: ",error);
        }
    }

    const login=async() => {
        const usernameInput=(document.getElementById("login_username") as HTMLInputElement).value;
        const passwordInput=(document.getElementById("login_password") as HTMLInputElement).value;

        try{
            if (usernameInput==="" || passwordInput==="") {
                setLoginErrorType('emptyFields');
                throw new Error("Please fill in all fields");
            }else{
                setLoginErrorType('');
            }

            const response=await fetch("/api/Account/get_account",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    username: usernameInput,
                    password: hashString(passwordInput)
                })
            });

            if(!response.ok){
                setLoginErrorType('userNotFound');
                throw new Error(`Error: ${response.statusText}`);
            }

            await createSession({username: usernameInput})
            const session=await getSession();
            setUsername(session.Username);
            setIsLoggedIn(true);
        }catch(error){
            console.error("Error logging in: ",error);
        }
    }

    const logout=async() => {
        try{
            await logoutSession();
            setIsLoggedIn(false);
            setUsername('');
        }catch(error){
            console.error("Error logging out: ",error);
        }
    }

    return(
        <>
            {loading ? (
                <div className="loader"></div>
            ): isLoggedIn ? (
                <>
                    <button className="submit_button" onClick={() => logout()}>Logout</button>
                </>
            ): (
                <div className="row">
                    <div className="col info_panel">
                        <div className="title">
                            Login
                        </div>
                        <label className="textbox">
                            Username: <input type="text" id="login_username" name="login_username" placeholder="Enter your username"/>
                        </label>
                        <label className="textbox">
                            Password: <input type="password" id="login_password" name="login_password" placeholder="Enter your password"/>
                        </label>
                        <button className="submit_button" onClick={() => login()}>Login</button>
                        {loginErrorType=='emptyFields' ? (
                            <div className="error_message">
                                Please fill in all fields
                            </div>
                        ): loginErrorType=='userNotFound' ? (
                            <div className="error_message">
                                Account with this username or password doesn't exist
                            </div>
                        ): (
                            <>
                            </>
                        )}
                    </div>
                    <div className="col info_panel">
                        <div className="title">
                            Register
                        </div>
                        <label className="textbox">
                            Username: <input type="text" id="register_username" name="register_username" placeholder="Enter your username"/>
                        </label>
                        <label className="textbox">
                            Password: <input type="password" id="register_password" name="register_password" placeholder="Enter your password"/>
                        </label>
                        <button className="submit_button" onClick={() => register()}>Register</button>
                        {registerErrorType=='emptyFields' ? (
                            <div className="error_message">
                                Please fill in all fields
                            </div>
                        ): registerErrorType=='usernameShort' ? (
                            <div className="error_message">
                                Username must be at least 4 characters long
                            </div>
                        ): registerErrorType=='passwordShort' ? (
                            <div className="error_message">
                                Password must be at least 8 characters long
                            </div>
                        ): registerErrorType=='passwordLong' ? (
                            <div className="error_message">
                                Password must be at most 20 characters long
                            </div>
                        ): registerErrorType=='usernameAlphanumeric' ? (
                            <div className="error_message">
                                Username must only contain alphanumeric characters
                            </div>
                        ): registerErrorType=='passwordAlphanumeric' ? (
                            <div className="error_message">
                                Password must only contain alphanumeric characters
                            </div>
                        ): registerErrorType=='accountRegister' ? (
                            <div className="error_message">
                                Error occured while processing to register account
                            </div>
                        ): (
                            <>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}