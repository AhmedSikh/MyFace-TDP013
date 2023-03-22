import "./sidebarFriend.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Button from "react-bootstrap/Button"


export default function SidebarFriend({ userId, isRequest }) {
    const { user } = useContext(AuthContext);
    const [otherUser, setUser] = useState({});
    const [updatedUser, updateUser] = useState(user);

    const [updateRequest, setRequest] = useState(isRequest);

    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users/${userId}`);
            setUser(res.data);
        };
        fetchUser();
    }, [userId]);

    useEffect(() => {
        const fetchUser = async () => {
          const res = await axios.get(`/users/${user._id}`);
          updateUser(res.data);
        };
        fetchUser();
      }, [user._id]);

    useEffect(() => {
        if(updatedUser.friendRequests.includes(userId))
        {
            setRequest(true);
        }
        else
        {
            setRequest(false);
        }
    },[updatedUser, userId])

    const addFriend = async (event) => {
        event.preventDefault();
        await axios.put(`users/${otherUser._id}/friendRequest`, user);
        setRequest(false);
    }

    return (
        <li className="friend">
            <Link to={`/${otherUser._id}`} style={{ textDecoration: "none" }}>
                <span className="friendUsername">{otherUser.username}</span>
            </Link>
            {updateRequest ? <Button className="addFriend" onClick={addFriend}>Add friend</Button> : ""}
        </li>
    );
}
