import './closeFriend.css'

export default function CloseFriend({user}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER
  // console.log(user)
  return (
    <li className="sidebarFriend">
      <div className="sidebarFriendLeft">
      <img className="sidebarFriendImg" src={user.profilePicture ? PF + user.profilePicture : PF+"person/noAvatar.png"} alt="" />
        <span className="sidebarFriendName">{user.username}</span>
      </div>
      
      <span className="sidebarFriendFollowers">{user.followers.length} followers</span>
    </li>  
  )
}
