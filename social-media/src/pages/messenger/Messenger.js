import { useContext, useEffect, useRef, useState } from 'react'
import Chatonline from '../../components/ChatOnline/ChatOnline'
import Conversation from '../../components/Conversation/Conversation'
import Message from '../../components/Message/Message'
import Topbar from '../../components/topbar/Topbar'
import './messenger.css'
import {AuthContext} from "../../context/AuthContext"
import axios from "axios"
import {io} from "socket.io-client"
import { axiosInstance } from '../../config'

export default function Messenger() {
  const [conversations,setConversations] = useState([])
  const [currentChat,setCurrentChat] = useState(null)
  const [messages,setMessages] = useState([])
  const [newMessage,setNewMessage] = useState("")
  const {user} = useContext(AuthContext);
  //useRef to auto scroll to bottom of message
  const scrollRef = useRef()
  //connection socket server
  // const socket = useRef()
  const [arrivalMessage,setArrivalMessage] = useState(null)

  // useEffect(() => {
  //   socket.current = io("ws://localhost:8900");
  //   socket.current.on("getMessage", (data) => {
  //     setArrivalMessage({
  //       sender: data.senderId,
  //       text: data.text,
  //       createdAt: Date.now(),
  //     });
  //   });
  // }, []);

  useEffect(()=>{
    //if sender is included in message update message
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && setMessages((prev)=>[...prev,arrivalMessage])
  },[arrivalMessage, currentChat])

  // useEffect(()=>{
  //   socket.current.emit("addUser", user._id);
  //   socket.current.on("getUsers", users => {
  //     console.log(users)
  //   })
  // },[user])

  useEffect(()=>{
    const getConversation = async () => {
      try{
        const res = await axiosInstance.get(`/conversations/${user._id}`)
        setConversations(res.data)
      }catch(err){
        console.log(err)
      }
    };
    getConversation();
  },[user._id])
  
  useEffect(()=>{
    const getMessages = async () => {
      try{
        const res = await axiosInstance.get("/messages/"+currentChat?._id)
        setMessages(res.data)
      }catch(err){
        console.log(err)
      }
    }
    getMessages();
  },[currentChat])

  useEffect(()=>{
    scrollRef.current?.scrollIntoView({behavior:"smooth"})
  },[messages])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    // const receiverId = currentChat.members.find(
    //   (member) => member !== user._id
    // );

    // socket.current.emit("sendMessage", {
    //   senderId: user._id,
    //   receiverId,
    //   text: newMessage,
    // });

    try {
      const res = await axiosInstance.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
    <Topbar/>
    <div className='messenger'>
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder='Search for friends' className="chatMenuInput" />
            {/* map through all friend messages */}
            {conversations.map(c => 
            <div key={c._id} className="" onClick={()=>setCurrentChat(c)}>
              <Conversation  conversation ={c} currentUser = {user}/>
            </div>)}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
          {currentChat ? (
            <>
            <div className="chatBoxTop">
              {messages.map((m)=>(
                <div key={m._id} ref={scrollRef}>
                  <Message  message={m} own={m.sender === user._id}/>
                </div>
              ))}
            </div>
            <div className="chatBoxBottom">
              <textarea onChange={(e) => setNewMessage(e.target.value)} value={newMessage} placeholder='write something' className='chatMessageInput'></textarea>
              <button className="chatSubmitButton" onClick={handleSubmit}>Send</button>
            </div>
            </> 
            ) : (<span className='noConversationText'>Open a conversation to start a chat.</span>)}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <Chatonline/>
          </div>
        </div>
    </div>
    </>
  )
}
