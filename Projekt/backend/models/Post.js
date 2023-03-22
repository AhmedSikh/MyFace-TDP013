// Post schema for mongoose.

const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    posterId:{
        type:String,
        required:true
    },
    hostId:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true
    }
},
{timestamps:true}
);

module.exports = mongoose.model("Post", PostSchema);