import Navbar from "../../components/navbar/Navbar";
import Feed from "../../components/feed/Feed";
import Sidebar from "../../components/sidebar/Sidebar";
import YourSidebar from "../../components/yourSidebar/YourSidebar";
import "./profile.css";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { useHistory } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const history = useHistory();

  const [profileOwner, setUser] = useState(user);
  const userId = useParams().id;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = userId 
        ? await axios.get(`/users/${userId}`)
        : await axios.get(`/users/${user._id}`);
        setUser(res.data);
      }
      catch {
        history.push("/404");
      }
    };
    fetchUser();
  }, [userId, user, history]);

  return (
    <>
      <Navbar />
      <div className="profileContainer">
        <Feed user={profileOwner} />

        {profileOwner._id === undefined || profileOwner._id === user._id 
        ? <YourSidebar/> 
        : <Sidebar owner={profileOwner}/>}

      </div>
    </>
  );
}
