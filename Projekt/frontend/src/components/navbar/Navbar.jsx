import "./navbar.css";
import { Link } from "react-router-dom";
import {useHistory} from "react-router";
import { useContext, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import Button from "react-bootstrap/Button"


export default function Navbar() {
    const history = useHistory();
    const searchInput = useRef();
    const {user} = useContext(AuthContext)
    
    const handleSearch = (event) => {
        event.preventDefault();
        history.push("/search?q="+searchInput.current.value)
    }
    const logout = () => {
        localStorage.clear();
        window.location.replace("/")
};
    return (
        <div className="navbarContainer">
                <div className="navbarLeft">
                    <Link to="/" style={{textDecoration:"none"}}>
                        <span className="logo">MyFace</span>
                    </Link>
                </div>

                <div className="navbarCenter">
                    <form className="searchbar" onSubmit={handleSearch}>
                        <input type="searchBar" placeholder="Search for users" className="searchInput" ref={searchInput}/>
                    </form>
                </div>

                <div className="navbarRight">
                    <div className="navbarLinks">
                        <Link to="/" style={{textDecoration:"none"}}>
                            <Button className="navbarLink">{user.username}'s Face</Button>
                        </Link>
                    </div>
                    <Button onClick={logout} className="navbarLink"> Log out </Button>
                </div>
        </div>
    )
}


