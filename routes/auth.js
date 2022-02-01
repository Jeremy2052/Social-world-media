const router = require("express").Router();
const User = require("../models/User")
const bcrypt = require("bcrypt")

// Register
//because this is an async function, use async
router.post("/register", async (req,res) =>{
  //try catch block for async
  try{
    //generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    //create new user
    const newUser = new User({
      username:req.body.username,
      email:req.body.email,
      password:hashedPassword
    });
    //save user and return response
    const user = await newUser.save();
    res.status(200).json(user);
  }catch(err){
    res.status(500).json(err)
  }
});

//Login
router.post("/login", async (req,res) => {
  try{
    //find user, findOne since it is only one user with a specific email
    const user = await User.findOne({email:req.body.email});
    //if there is no user, return 404 status with error text
    !user && res.status(404).json("user not found")

    //check password with bcrypt compare function
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    !validPassword && res.status(400).json("wrong password")
    
    //if email and password are valid
    res.status(200).json(user)
    
  }catch(err){
    res.status(500).json(err)
  }
  
})

module.exports = router