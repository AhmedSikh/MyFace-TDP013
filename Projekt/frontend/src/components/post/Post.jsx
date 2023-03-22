import "./post.css";
import {Link} from "react-router-dom";

export default function Post({post}) {
    return (
        <div className="post">
            <div className="postWrapper">
                <Link to={`/${post.posterId}`} style={{textDecoration:"none"}}>
                    <span className="postUsername">{post.username}</span>
                </Link>
                <span className="postText">{post.text}</span>
            </div>
        </div>
    )
}
