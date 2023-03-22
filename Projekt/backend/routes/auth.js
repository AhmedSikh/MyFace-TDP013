// Handle user creation and authorization

const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

// Create a new user route
router.post("/register", async (req, res) => {
    try {
        // Hash the password from cleartext.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Define a new user using the User Schema.
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        })

        // Save the user to the database, return 200 and the user data.
        try {
            const user = await newUser.save();
            res.status(200).json(user)
        }
        catch(err){
            res.status(403).json("User already exists")
        }
    }catch(err){
        console.log(err);
    }
});

// Login Route
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if(!user){ return res.status(404).json("user not found");}

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){ return res.status(400).json("Wrong password");}

        else { return res.status(200).json(user);}
    } catch (err) {
        res.status(500).json(err);
    }
})

router.post("/testclear", async (req, res) =>{
    try{
        await User.deleteMany( { username: { $regex: 'TEST_USER' } } );
        await Post.deleteMany( { username: { $regex: 'TEST_USER' } } );
        res.sendStatus(200);
    }
    catch(err){
        res.sendStatus(500);
    }
})

module.exports = router;