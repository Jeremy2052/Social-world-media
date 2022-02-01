const Post = require("../models/Post");
const User = require("../models/User");
const router = require("express").Router();


//create a post
router.post("/", async (req,res)=>{
  const newPost = new Post(req.body)
  try{
    const savedPost = await newPost.save();
    res.status(200).json(savedPost)
  }catch(err){
    res.status(500).json(err)
  }
})

//update a post
router.put("/:id", async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    //check if users id and the post users id are the same
    console.log(post.userId, req.body.userId)
    if(post.userId === req.body.userId){
      await post.updateOne({$set:req.body});
      res.status(200).json("Post has been updated.")
    }else{
      res.status(500).json("You can update only your posts")
    }
  }catch(err){
    res.status(500).json(err)
  }
  
})

//delete a post
router.delete("/:id", async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    //check if users id and the post users id are the same
    console.log(post.userId, req.body.userId)
    if(post.userId === req.body.userId){
      await post.deleteOne();
      res.status(200).json("Post has been deleted.")
    }else{
      res.status(500).json("You can delete only your posts")
    }
  }catch(err){
    res.status(500).json(err)
  }
  
})

//like a post
router.put("/:id/like", async (req,res) => {
  try{
    const post = await Post.findById(req.params.id);
    //if post has not been liked by user id, like it
    if(!post.likes.includes(req.body.userId)){
      await post.updateOne({$push:{likes:req.body.userId}})
      res.status(200).json("The post has been liked")
    }else{
      //if user has already liked it, unlike it
      await post.updateOne({$pull:{likes:req.body.userId}})
      res.status(200).json("The post has been disliked")
    }
  }catch(err){
    res.status(500).json(err)
  }

})

//get a post
router.get("/:id", async(req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    res.status(200).json(post)
  }catch(err){
    res.status(500).json(err)
  }
})

//get all timeline posts
router.get("/timeline/:userId", async (req,res)=>{
  try{
    const currentUser = await User.findById(req.params.userId);
    //find all post with the current users id
    const userPosts = await Post.find({userId: currentUser._id});
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => { return Post.find({userId: friendId});})
    );

    //concat all of friends posts into users post after
    res.status(200).json(userPosts.concat(...friendPosts))
  }catch(err){
    res.status(500).json(err)
  }
})

//get users all post
router.get("/profile/:username", async (req,res)=>{
  try{
    const user = await User.findOne({username:req.params.username})
    const posts = await Post.find({userId:user._id});
    res.status(200).json(posts)
  }catch(err){
    res.status(500).json(err)
  }
})

module.exports = router;