const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");

//update user
router.put("/:id", async (req,res) =>{
  //check if user id matches to one that is being updated and if user is an admin
  if(req.body.userId === req.params.id || req.body.isAdmin){
    //check if passwordi s being updated, if so update
    if(req.body.password){
      try{
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }catch(err){
        return res.status(500).json(err)
      }
    }
    //find and update user
    try{
      const user = await User.findByIdAndUpdate(req.params.id,{
        //automatically set all inputs in the body
         $set: req.body,
        })
        res.status(200).json("Account has been updated.")
    }catch(err){
      return res.status(500).json(err)
    }
  }else{
    res.status(403).json("You can only update your own account.")
  }
})

//get all users
router.get("/all", async (req,res) => {
  try{
    const users = await User.find();
    res.status(200).json(users)
  }catch(err){
    res.status(500).json(err)
  }
})

//delete user
router.delete("/:id", async (req,res) =>{
  //check if user id matches to one that is being updated and if user is an admin
  if(req.body.userId === req.params.id || req.body.isAdmin){
    //find an delete user
    try{
      const user = await User.findByIdAndDelete(req.params.id,{
        //automatically set all inputs in the body
         $set: req.body,
        })
        res.status(200).json("Account has been deleted.")
    }catch(err){
      return res.status(500).json(err)
    }
  }else{
    res.status(403).json("You can only delete your own account.")
  }
})

//get user
router.get("/", async (req,res) => {
  //create query
  //localhost:8800/users?userId=2342345 or username=john
  const userId = req.query.userId;
  const username = req.query.username;
  // console.log(userId, username)
  try{
    const user = userId ?  await User.findById(userId) : await User.findOne({username:username});
    //choose certain properties with getting user
    const {password,updatedAt, ...other} = user._doc
    res.status(200).json(other)
  }catch(err){
    res.status(500).json(err)
  }
})

//follow a user
router.put("/:id/follow", async (req,res) => {
  //prevent from following yourself
  if(req.body.userId !== req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //check if userId already included in params.id follower list
      if(!user.followers.includes(req.body.userId)){
        //push the following user into the followers array
        await user.updateOne({$push:{followers:req.body.userId}});
        await currentUser.updateOne({$push: {following: req.params.id}});
        res.status(200).json("user has been followed")
      }else{
        res.status(403).json("you follow this person already")
      }
    }catch(err){

    }
  }else{
    res.status(403).json("you cant follow yourself")
  }
})

//unfollow a user
router.put("/:id/unfollow", async (req,res) => {
  //prevent from following yourself
  if(req.body.userId !== req.params.id){
    try{
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      //check if userId already included in params.id follower list
      if(user.followers.includes(req.body.userId)){
        //push the following user into the followers array
        await user.updateOne({$pull:{followers:req.body.userId}});
        await currentUser.updateOne({$pull: {following: req.params.id}});
        res.status(200).json("user has been unfollowed")
      }else{
        res.status(403).json("you unfollow this person already")
      }
    }catch(err){

    }
  }else{
    res.status(403).json("you cant unfollow yourself")
  }
})

//get friends
router.get("/friends/:userId", async (req,res) => {
  try{
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.following.map(friendId => {
        return User.findById(friendId)
      })
    );
    let friendList = [];
    friends.map(friend => {
      const {_id, username, profilePicture} = friend;
      friendList.push({_id, username, profilePicture});
      res.status(200).json(friendList)
    })
  }catch(err){
    res.status(500).json(err)
  }
})

module.exports = router