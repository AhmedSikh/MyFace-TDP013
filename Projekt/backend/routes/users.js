//Handle users, like friend requests, getting data on other users.
const router = require("express").Router();
const User = require("../models/User");

//get a user
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        //Don't get these parts of the user
        const {password, updatedAt, createdAt, ...other} = user._doc;
        res.status(200).json(other);
    } catch (err) {
        res.status(404).json(err);
    }
});

//friend request
router.put("/:id/friendRequest", async (req, res) => {
    //Check so the user isn't trying to friend themselves
    if (req.body._id !== req.params.id) {
        try {
            //Find the user we are trying to friend
            const user = await User.findById(req.params.id);

            //Find ourselves
            const currentUser = await User.findById(req.body._id);
            
            //Accept request if already pending
            if (user.pendingFriendRequests.includes(req.body._id))
            {
                //Add users to friendlist
                await user.updateOne({$push: { friends: req.body._id}});
                await currentUser.updateOne({$push: { friends: req.params.id}});

                //Remove from pending and requests
                await user.updateOne({$pull: { pendingFriendRequests: req.body._id}});
                await currentUser.updateOne({$pull: { friendRequests: req.params.id}});

                res.status(200).json("You are now friends");
                return;
            }

            //Send new request
            //Check so we are not already friends
            if (!user.friends.includes(req.body._id)) {
                if (!user.friendRequests.includes(req.body._id)){
                    await user.updateOne({$push: { friendRequests: req.body._id}});
                    await currentUser.updateOne({$push: { pendingFriendRequests: req.params.id}});
                    res.status(200).json("Friend request sent");
                } else {
                    res.status(403).json("Friend request already sent");
                }
            } else {
                res.status(403).json("You are already friends");
            }
        }catch(err) {
            res.status(500).json(err);
        }
    }else
    {
        res.status(403).json("You can't friend yourself");
    }
});

//search for users
router.get("/search/:query", async (req, res) => {
    try {
        let results = [];
        if(req.params.query == "*") {
            results = await User.find({});
        } else {
            results = await User.find({ username: { $regex: `${req.params.query}`, $options: 'i' }});
        }
        //Don't get these parts of the user
        responseList = [];
        results.forEach( (user) => {
            const {password, updatedAt, createdAt, email, friends, friendRequests, pendingFriendRequests, __v, ...other} = user._doc;
            responseList.push(other);
        });
        res.status(200).json(responseList);
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;