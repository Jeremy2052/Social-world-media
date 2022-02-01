import { MoreVert, ThumbUp } from "@material-ui/icons"
import "./post.css"
// import {Users} from "../../dummyData.js"
import { useContext, useEffect, useState } from "react"
import axios from "axios"
import {format} from "timeago.js"
import { Link } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext"
import { axiosInstance } from "../../config"

export default function Post({post}) {

  const [like,setLike] = useState(post.likes.length)
  const [isLiked,setIsLiked] = useState(false)
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user,setUser] = useState({});
  const {user:currentUser} = useContext(AuthContext)
  // console.log(user)

  useEffect(()=>{
    setIsLiked(post.likes.includes(currentUser._id));
  },[post.likes,currentUser._id])

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axiosInstance.get(`/users?userId=${post.userId}`)
      setUser(res.data)
    };
    fetchUser();

  }, [post.userId]);

  const likeHandler = async () => {
    try{
      await axios.put("/posts/" + post._id + "/like", {userId:currentUser._id})
    }catch(err){

    }
    setLike(isLiked ? like - 1: like +1);
    setIsLiked(!isLiked)
  }

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
            <img className="postProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF+"person/noavatar.png"} alt="" />
            </Link>
           
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert/>
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          <img className="postImg" src={PF+post.img} alt="" />
        </div>
        
        <div className="postBottom">
          <div className="postBottomLeft">
            <ThumbUp className="likeIcon" htmlColor="lightblue" onClick={likeHandler}/>
            {/* <Favorite className="likeIcon" htmlColor="pink" onClick={likeHandler}/> */}
            <span className="postLikeCounter">{like} people liked it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  )
}
