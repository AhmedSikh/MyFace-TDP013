import "./searchObject.css";
import {Link} from "react-router-dom";

export default function SidebarFriend({ user }) {
    return (
        <li className="result">
                <Link to={`/${user._id}`} style={{textDecoration:"none"}}>
                    <span className="resultUsername">{user.username}</span>
                </Link>
        </li>
    )
}