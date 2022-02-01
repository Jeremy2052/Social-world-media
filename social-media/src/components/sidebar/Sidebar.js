import { Event, Group, Message, OndemandVideo, RssFeed} from "@material-ui/icons"
import "./sidebar.css"
import CloseFriend from "../closeFriend/CloseFriend"
import axios from "axios"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { axiosInstance } from "../../config"

export default function Sidebar() {
  
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    const getUsers = async () => {
      try{
        const res = await axiosInstance.get("/users/all");
        // console.log(res.data)
        setUsers(res.data)
        // console.log("users",users)
      }catch(err){
        console.log(err)
      }
    }
    getUsers();
  },[])

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <RssFeed className="sidebarIcon"/>
            <span className="sidebarListItemText">Feed</span>
          </li>
          <li className="sidebarListItem">
            <Event className="sidebarIcon"/>
            <span className="sidebarListItemText">Events</span>
          </li>
          <li className="sidebarListItem">
          <Link to='/messenger' style={{textDecoration:"none", color:'black'}}>
            <Message className="sidebarIcon"/>
            <span className="sidebarListItemText">Chat</span>
          </Link>
            
          </li>
          <li className="sidebarListItem">
            <Group className="sidebarIcon"/>
            <span className="sidebarListItemText">Groups</span>
          </li>
          <li className="sidebarListItem">
            <OndemandVideo className="sidebarIcon"/>
            <span className="sidebarListItemText">Videos</span>
          </li>
        </ul>
        {/* <button className="sidebarButton">Show More</button> */}
        <hr className="sidebarHr"/>
        <div className="sidebarTextContainer">
          <span className="sidebarText">People you may know</span>
        </div>
        
        <ul className="sidebarFriendList">
          {users.map((u)=>(<CloseFriend key={u._id} user={u}/>))}
        </ul>
      </div>
    </div>
  )
}
