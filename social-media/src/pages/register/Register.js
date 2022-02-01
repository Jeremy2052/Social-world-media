import axios from 'axios';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../config';
import './register.css'

export default function Register() {
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const username = useRef();
  const navigate = useNavigate();

  const handleClick = async (e) =>{
    e.preventDefault();
    //check if passwords match when registering
    if(passwordAgain.current.value !== password.current.value){
      //set own validation to show pop alert 
      password.current.setCustomValidity('Passwords do not match')
    }else{
      //if all fields are valid, create user to post to backend
      const user = {
        username:username.current.value,
        email:email.current.value,
        password:password.current.value,
      };
      try{
        await axiosInstance.post("/auth/register", user)
        //if register post is successful, navigate to login page to sign in
        navigate("/login")
      }catch(err){
        console.log(err)
      }
    }
  }

  const signIn = () => {
    navigate("/login")
  }

  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Logo</h3>
          <span className="loginDesc">Connect with your friends and people around the world!</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Username" required ref={username} className="loginInput" />
            <input placeholder="Email" required  type="email" ref={email}  className="loginInput" />
            <input placeholder="Password" required type="password"  ref={password}  className="loginInput" minLength='6'/>
            <input placeholder="Confirm Password" required type="password" ref={passwordAgain}  className="loginInput" />
            <button className="loginButton" type="submit">Sign Up</button>
            
          </form>
          <button className="loginRegister" onClick={signIn}>Sign in to account</button>
        </div>
      </div>
    </div>
  )
}
