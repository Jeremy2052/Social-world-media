import { Person, Search, Chat, Notifications } from "@material-ui/icons"
import "./topbar.css"
import {Link, useNavigate} from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../context/AuthContext"

export default function Topbar() {
  const {user} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const navigate = useNavigate();
  
  // console.log(user)

  const logout = () => {
    localStorage.removeItem("user");
    console.log('removing item')
    window.location.href = '/login'
    // navigate("/login")
    // console.log('login page')
  }

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
      <Link to="/" style={{textDecoration:"none"}}>
        <span className="logo">Social World</span>
      </Link>
        
      </div>
      <div className="topbarCenter">
        <div className="searchBar">
          <Search className="searchIcon"/>
          <input placeholder='Search...' className="searchInput" />
        </div>
      </div>
      <div className="topbarRight">
        {/* <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div> */}
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person/>
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat/>
            <span className="topbarIconBadge">3</span>
          </div>
          <div className="topbarIconItem">
            <Notifications/>
            <span className="topbarIconBadge">12</span>
          </div>
      </div>
      <Link to={`/profile/${user.username}`}>
        <img src={user.profilePicture ? PF + user.profilePicture : `${PF}person/noAvatar.png`} alt="" className="topbarImage" />
      </Link>
      <button onClick={logout} className="logout">logout</button>
      
      </div>
      
    </div>
  )
}
