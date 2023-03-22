import { useEffect, useState, useContext } from "react";
import NewPost from "../newPost/NewPost";
import Post from "../post/Post";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";


export default function Feed({user}) {
    const [posts, setPosts] = useState([]);
    const [updatedUser, setUser] = useState(user);
    const { user:currentUser } = useContext(AuthContext);


    //Effect to update user and save to UpdatedUser
    useEffect(() => {
        const fetchUser = async () => {
          const res = await axios.get(`/users/${user._id}`);
          setUser(res.data);
        };
        fetchUser();
      }, [user]);


    //Effect to get all posts from a user
    useEffect(()=>{
        const fetchPosts = async () => {
            const response = updatedUser
            ? await axios.get(`posts/${updatedUser._id}`)
            : await axios.get(`posts/${user._id}`);
            setPosts(
                response.data.sort((p1, p2) => {
                    return new Date(p2.createdAt) - new Date(p1.createdAt);
                })
            );
        }
        fetchPosts();
    }, [user, updatedUser])

    return (
        <div className="postFeed">
            <h2>{user.username}'s Wall</h2>
                
            {(updatedUser.friends.includes(currentUser._id) || updatedUser._id === currentUser._id) && <NewPost profileOwner={updatedUser} updatePosts={setUser}/>}
            
            {posts.map((p) => (
                <Post key={p._id} post={p}/>))}
        </div>
    )
}