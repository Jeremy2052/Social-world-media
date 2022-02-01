import { Cancel, EmojiEmotions, Label, PermMedia, Room } from "@material-ui/icons"
import axios from "axios";
import { useContext, useRef, useState } from "react"
import { axiosInstance } from "../../config";
import { AuthContext } from "../../context/AuthContext"
import "./share.css"

export default function Share() {

  const {user} = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file,setFile] = useState(null)

  const submitHandler = async (e) => {
    e.preventDefault()
    const newPost = {
      userId: user._id,
      desc:desc.current.value,
    }
    if(file){
      const data = new FormData();
      const filename = Date.now() + file.name
      data.append("name", filename)
      data.append("file",file)
      
      newPost.img = filename
      // console.log(newPost)
      // console.log(data)
      try{
        await axiosInstance.post("/upload", data)
      }catch(err){
        console.log(err)
      }
    }
    try{
      await axiosInstance.post("/posts",newPost)
      window.location.reload();
    }catch(err){
      console.log(err)
    }
  }

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" src={user.profilePicture ? PF + user.profilePicture : PF+"person/noavatar.png"} alt="" />
            <textarea placeholder={`Share what is on your mind ${user.username}!`} className="shareInput" ref={desc}/>
        </div>
        <hr className="shareHr" />
        {file && (<div className="shareImgContainer">
          <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
          <Cancel className="shareCancelImg" onClick={()=>setFile(null)}/>
        </div>)}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="red" className="shareIcon"/>
              <span className="shareOptionText">Photo/Video</span>
              <input style={{display:"none"}} type="file" id="file" accept=".png, .jpg, .jpeg" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <div className="shareOption">
              <Label htmlColor="green" className="shareIcon"/>
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="purple" className="shareIcon"/>
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="pink" className="shareIcon"/>
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>

          <button className="shareButton" type="submit">Share</button>
        </form>
      </div>

    </div>
  )
}
