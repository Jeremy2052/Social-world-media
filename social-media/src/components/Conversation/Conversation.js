import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css"
import { axiosInstance } from "../../config"

const Conversation = ({conversation, currentUser}) => {
  const [user,setUser] = useState(null)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER

  useEffect(()=>{
    //retrieve all members in the conversation that is not the current user logged in
    const friendId = conversation.members.find((m) => m !== currentUser._id)
    //fetch data using friendId
    const getUser = async () => {
      try{
        const res = await axiosInstance('/users?userId='+ friendId)
        setUser(res.data)
      }catch(err){
        console.log(err)
      }
    };
    getUser();
  },[currentUser, conversation]);

  return (
    <div className="conversation">
      <img src={user?.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"} alt="" className="conversationImg" />
      <span className="conversationName">{user?.username}</span>
    </div>
  );
}

export default Conversation;
