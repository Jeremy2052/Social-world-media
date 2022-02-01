import axios from "axios";
import { axiosInstance } from "./config";


export const loginCall = async (userCredential, dispatch) => {
  //dispatchfirst action
  dispatch({type:"LOGIN_START"});
  try{
    const res = await axiosInstance.post("/auth/login", userCredential);
    // console.log(res.data)
    dispatch({type:"LOGIN_SUCCESS", payload:res.data})
  }catch(err){
    dispatch({type:"LOGIN_FAILURE", payload:err})
  }
}