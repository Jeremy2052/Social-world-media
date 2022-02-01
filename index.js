const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv")
const helmet = require("helmet")
const morgan = require("morgan")
const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")
const conversationRoute = require("./routes/conversations")
const messageRoute = require("./routes/messages")
const multer = require("multer")
const path = require("path")


dotenv.config();

const port = process.env.PORT || 8800

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser:true}, ()=>{
  console.log("connected to Mongo")
})

//if use this images path, dont make any request, instead go to directory
app.use("/images", express.static(path.join(__dirname,"public/images")))
// middleware
// body parser when make body request
app.use(express.json())
app.use(helmet())
app.use(morgan("common"))

const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"public/images")
  },
  filename:(req,file,cb)=>{
    cb(null,req.body.name)
  }
})

//multer for handling file uploads
const upload = multer({storage})
app.post("/api/upload", upload.single("file"), (req,res) => {
  try{
    return res.status(200).json("File uploaded.")
  }catch(err){
    console.log(err)
  }
})

//routes
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/posts", postRoute)
app.use("/api/conversations", conversationRoute)
app.use("/api/messages", messageRoute)

//Serve static assets if in production mode
if(process.env.NODE_ENV === 'production'){
  // app.use(express.static('social-media/build'));
  // //set static folder
  // app.get('*', (req,res) => {
  //   res.sendfile(path.resolve(__dirname, 'social-media', 'build', 'index.html'));
  // })

  app.use(express.static(path.join(__dirname, "/social-media/build")));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/social-media/build', 'index.html'));
  });
}

app.listen(port,() => {
  console.log("Server is running.")
})