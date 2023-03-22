const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");


//create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try{
        const poster = await User.findById(req.body.posterId);
        newPost.username = poster.username;

        const host = await User.findById(req.body.hostId);

        if(host.id != poster.id)
        {
        if(!host.friends.includes(req.body.posterId))
        {
            res.status(403).json("You are not friends");
            return;
        }}

        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all posts on a users wall.
router.get("/:id", async(req, res) =>{
    const userId = req.params.id;
    try{
        const userWall = await Post.find({ hostId: userId});
        res.status(200).json(userWall);
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;
