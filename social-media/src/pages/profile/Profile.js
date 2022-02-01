import "./profile.css"
import Sidebar from "../../components/sidebar/Sidebar"
import Topbar from "../../components/topbar/Topbar"
import Rightbar from "../../components/rightbar/Rightbar"
import Feed from "../../components/feed/Feed"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import {useParams} from "react-router"
import { AuthContext } from "../../context/AuthContext"
import { axiosInstance } from "../../config"

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  const [user,setUser] = useState({});
  //grab the username paramter from url
  const username = useParams().username
  const {user:currentUser, dispatch} = useContext(AuthContext);
  const [followed,setFollowed] = useState(currentUser.following.includes(user?.id))
  // console.log(params)
  const [updates,setUpdate] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/users?username=${username}`)
      setUser(res.data)
      // console.log(user)
    };
    fetchUser();
  }, [username]);

  const handleClick = async () => {
    try{
      if(followed){
        await axiosInstance.put(`/users/${user._id}/unfollow`, {userId:currentUser._id});
        dispatch({type:"UNFOLLOW", payload:user._id});
      }else{
        await axiosInstance.put(`/users/${user._id}/follow`, {userId:currentUser._id})
        dispatch({type:"FOLLOW", payload:user._id});
      }
    }catch(err){
      console.log(err)
    }
    setFollowed(!followed)
  };

  //set state of updating to true to aadd component
  

  return (
    <>
      <Topbar user={user}/>
      <div className="profile">
      <Sidebar/>
      <div className="profileRight">
        <div className="profileRightTop">
        <div className="profileCover">
          <img src={user.coverPicture ? PF + user.coverPicture : PF+"person/noCover2.png"} alt="" className="profileCoverImg" />
          <img src={ user.profilePicture ? PF + user.profilePicture : PF+"person/noAvatar.png"} alt="" className="profileUserImg" />
        </div>
         <div className="profileInfo">
           <h4 className="profileInfoName">{user.username}</h4>
           <span className="profileInfoDesc">{user.desc}</span>
           {/* make condition to change follow or unfollow text */}
           {user.username === currentUser.username && (<button onClick={()=>setUpdate(true)} className="profileUpdate" >Update</button>)} 
           {user.username !== currentUser.username && (<button className="profileButton" onClick={handleClick}>{followed ? "Unfollow" : "Follow"}</button>)} 
         </div> 
        </div>
        
        <div className="profileRightBottom">
          <Feed username={username}/>
          {/* profile as pass argument */}
          <Rightbar user={user}/> 
        </div>
      </div>
      </div>
    </>
  )
}
