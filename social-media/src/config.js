import axios from "axios"
export const axiosInstance = axios.create({
  baseURL: "https://social-world-media.herokuapp.com/api/"/6
})