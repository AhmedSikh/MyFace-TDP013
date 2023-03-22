const express = require("express");
const app = express();

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");

const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true},
() => {console.log("Connected to MongoDB database");});

app.use(express.json())
app.use(helmet());
app.use(morgan("common"));
app.use(mongoSanitize());
app.use(cors());

app.use("/api/users", userRoute);   
app.use("/api/auth", authRoute);   
app.use("/api/posts", postRoute);   


//Hantera felaktiga metodanrop
app.use(["/api/auth/register", 
         "/api/auth/login",
         "/api/posts/",  
         "/api/:id", 
         "/api/users/:id", 
         "/api/users/:id/friendRequest", 
         "/api/users/search/:query"], (req, res) => {
    res.sendStatus(405);
});

//Hantera felaktiga routes
app.use((req, res) => {
    res.sendStatus(404);
});

app.listen(3003,()=>{
    console.log("Server running");
});

module.exports = app;