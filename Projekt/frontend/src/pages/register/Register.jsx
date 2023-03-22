import "./register.css";
import { useRef } from "react";
import axios from "axios";
import {useHistory} from "react-router";
import Button from "react-bootstrap/Button";


export default function Register() {

    const username = useRef(); 
    const email = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const history = useHistory();

    const handleClick = async (event) =>{
        event.preventDefault();
        if (passwordAgain.current.value !== password.current.value)
        {
            passwordAgain.current.setCustomValidity("Passwords don't match");
        }
        else{
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            }
            try {
                await axios.post("/auth/register", user);
                history.push("/login");
            } catch (err) {
                console.log(err);
            }
        }
    }

    const historyBack = useHistory();
    const backClick = (event) => {
        event.preventDefault();
        historyBack.push("/login");
    }

    return (
        <>
            <div className="login">
                <div className="loginWrapper">
                    <div className="loginLeft">
                        <h3 className="loginLogo">MyFace</h3>
                    </div>

                    <div className="loginRight">
                        <form className="registerBox" onSubmit={handleClick}>
                            <input placeholder="Username" required className="loginInput" ref={username} />
                            <input placeholder="E-Mail" required type="email" className="loginInput" ref={email}/>
                            <input placeholder="Password" required type="password" minLength="6" className="loginInput" ref={password}/>
                            <input placeholder="Password Again" required type="password" minLength="6" className="loginInput" ref={passwordAgain}/>
                            <Button className="registerButton" type="submit">Register now</Button>
                            <Button className="backToLoginButton" 
                            onClick={backClick}
                            >Back to Log in</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}