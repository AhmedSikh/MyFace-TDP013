import "./sidebar.css";
import SidebarFriend from "../sidebarFriend/SidebarFriend";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Button from "react-bootstrap/Button"

export default function Sidebar({owner}) {
  const {user} = useContext(AuthContext);
  const [updatedUser, setUser] = useState(user);
  const [isFriend, setFriend] = useState(0);
  

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${user._id}`);
      setUser(res.data);
    };
    fetchUser();
  }, [user._id]);

  useEffect(() => {
    if(updatedUser.friends.includes(owner._id))
    {
      setFriend(1);
      return;
    }
    else if(updatedUser.pendingFriendRequests.includes(owner._id))
    {
      setFriend(2);
      return;
    }
    else
    {
      setFriend(0);
    }
  },[updatedUser, owner._id]);

  const addFriend = async (event) => {
    event.preventDefault();
    if(isFriend === 0)
    {
      await axios.put(`users/${owner._id}/friendRequest`, user);
      setFriend(2);
    }
}


  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        {isFriend === 1
        ? ""
        : isFriend === 2 ? <span className="pendingRequest">Friend Request Pending!</span> 
        : <Button className="friendRequest" onClick={addFriend}>Send friend request</Button>}

        <span className="sidebarTitle">{owner.username}'s friends</span>
        <hr className="sidebarHr" />
        <ul className="sidebarList">
          {owner.friends.map((u) => (
            <SidebarFriend key={u} userId={u} />
          ))}
        </ul>

      </div>
    </div>
  );
}