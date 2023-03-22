import "./login.css";
import { useRef, useContext } from "react";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";


export default function Login() {

    
    const email = useRef();
    const password = useRef();

    //Logincall hook
    const {isFetching, dispatch} = useContext(AuthContext);

    const handleClick = (event) =>{
        event.preventDefault();
        loginCall({ email:email.current.value, password:password.current.value }, dispatch);
    }

    const history = useHistory();
    const registerClick = (event) => {
        event.preventDefault();
        history.push("/register");
    }

    return (
        <>
            <div className="login">
                <div className="loginWrapper">
                    <div className="loginLeft">
                        <h3 className="loginLogo">MyFace</h3>
                    </div>

                    <form className="loginRight" onSubmit={handleClick}>
                        <div className="loginBox">
                            <input placeholder="E-Mail" 
                            type="email" 
                            className="loginInput" 
                            ref={email} 
                            required/>
                            
                            <input placeholder="Password" 
                            type="password" 
                            className="loginInput" 
                            ref={password} 
                            minLength="6"
                            required/>

                            <Button className="loginButton"
                            disabled={isFetching}
                            type="submit"
                            >{isFetching ? "Loading..." : "Log in"}</Button>
                            

                            <Button className="loginRegisterButton" 
                            disabled={isFetching}
                            onClick={registerClick}
                            >Register new user</Button>
        
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}