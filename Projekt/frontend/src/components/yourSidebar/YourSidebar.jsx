import "./yourSidebar.css";
import SidebarFriend from "../sidebarFriend/SidebarFriend";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function YourSidebar() {
  const { user } = useContext(AuthContext);

  const [updatedUser, setUser] = useState(user);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users/${user._id}`);
      setUser(res.data);
    };
    fetchUser();
  }, [user._id]);

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">

        <span className="sidebarTitle">Your friends</span>
        <hr className="sidebarHr" />
        <ul className="sidebarList">
          {updatedUser.friends !== undefined ? updatedUser.friends.map((u) => (
            <SidebarFriend key={u} userId={u} />
          )): ""}
        </ul>

        <span className="sidebarTitle">Requests</span>
        <hr className="sidebarHr" />
        <ul className="sidebarList">
          {updatedUser.friendRequests !== undefined 
          ? updatedUser.friendRequests.map((u) => (
            <SidebarFriend key={u} userId={u} isRequest={true} />
          ))
          : ""}
        </ul>

        <span className="sidebarTitle">Pending</span>
        <hr className="sidebarHr" />
        <ul className="sidebarList">
          {updatedUser.pendingFriendRequests !== undefined 
          ? updatedUser.pendingFriendRequests.map((u) => (
            <SidebarFriend key={u} userId={u} />
          ))
          : ""}
        </ul>
      </div>
    </div>
  );
}