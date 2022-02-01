import { useContext, useRef } from 'react';
import './login.css'
import { loginCall } from '../../apiCalls';
import { AuthContext } from '../../context/AuthContext';
import { CircularProgress } from '@material-ui/core';
import {useNavigate } from 'react-router-dom';

export default function Login() {
  //prevent re render, instead of state use useRef
  const email = useRef();
  const password = useRef();
  const {isFetching,dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("login/")

  const handleClick = (e) => {
    e.preventDefault()
    // console.log(email.current.value, password.current.value)
    loginCall({email:email.current.value,password:password.current.value},dispatch)
  }

  const register = () => {
    navigate("/register")
  }
  // console.log(user)
  return (
    <div className='login'>
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social World</h3>
          <span className="loginDesc">Connect with your friends and people around the world!</span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleClick}>
            <input placeholder="Email" type="email" required className="loginInput"  ref={email}/>
            <input placeholder="Password" type="password" minLength="6" required className="loginInput" ref={password}/>
            <button className="loginButton">{isFetching ? <CircularProgress size="20px" color="inherit"/> : "login"}</button>
            <span className="loginForgot">Forgot Password</span>            
          </form>
          <button className={isFetching ? "loginLoading" : "loginRegister"} onClick={register}>Create a new account</button>
        </div>
      </div>
    </div>
  )
}
