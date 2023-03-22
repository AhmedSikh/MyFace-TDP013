import { useContext, useRef } from "react";
import "./newPost.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Button from "react-bootstrap/Button";

export default function NewPost({profileOwner, updatePosts}) {
  const { user:currentUser } = useContext(AuthContext);
  const text = useRef();

  const ownWall = profileOwner._id === currentUser._id;

  const submitHandler = async (e) => {
    e.preventDefault();

    if(text.current.value === "")
    {
      return;
    }

    const newPost = {
      posterId: currentUser._id,
      hostId: profileOwner._id,
      username: profileOwner.username,
      text: text.current.value,
    };

    try {
      await axios.post("/posts", newPost);
      text.current.value = "";

      const res = await axios.get(`/users/${profileOwner._id}`);
      updatePosts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="newPostContainer">
      <div className="newPostMain">
        <form className="newPostBottom" onSubmit={submitHandler}>
          <textarea
            placeholder={
              ownWall
                ? "What's on your face " + currentUser.username + "?"
                : "Write something to " + currentUser.username + "!"
            }
            className="postTextInput"
            ref={text}
            rows={4}
          />
          <Button className="postButton" type="submit">
            Submit Post
          </Button>
        </form>
      </div>
    </div>
  );
}
