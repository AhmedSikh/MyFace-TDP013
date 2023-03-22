//Express server
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
module.exports = app;

app.use(require("sanitize").middleware);
app.use(express.json());

app.use(cors());

app.listen(port, () => {
  console.log(`Labb3 app listening at http://localhost:${port}`);
});

//CONSTANTS
const MAX_LENGTH = 140;
const MIN_LENGTH = 1;

//Database
const database = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1/database";

//Spara meddelanden
app.post("/messages", (req, res) => {
  database.connect(url, (err, db) => {
    if (err) {
      res.sendStatus(500);
      throw err;
    }
    let dbo = db.db("database");
    let newPost = {
      id: Date.now(),
      readstatus: false,
      message: req.body.message,
    };
    if (
      newPost.message.toString().length > MAX_LENGTH ||
      newPost.message.toString().length < MIN_LENGTH
    ) {
      res.sendStatus(400);
    } else {
      dbo.collection("posts").insertOne(newPost, (err, result) => {
        if (err) {
          res.sendStatus(500);
          throw err;
        }
        db.close();
        res.sendStatus(200);
      });
    }
  });
});

//Markera som läst
app.patch("/messages/:id", (req, res) => {
  const id = parseInt(req.params.id);
  database.connect(url, function (err, db) {
    if (err) {
      res.sendStatus(500);
      throw err;
    }
    let dbo = db.db("database");
    const msgQuery = { id: id };
    if (req.body.readstatus !== true && req.body.readstatus !== false) {
      res.sendStatus(400);
    } else {
      const newvalues = { $set: { readstatus: req.body.readstatus } };
      dbo
        .collection("posts")
        .updateOne(msgQuery, newvalues, function (err, result) {
          if (err) {
            res.sendStatus(500);
            throw err;
          }
          db.close();
          if (result.matchedCount == 0) {
            res.sendStatus(400);
          } else {
            res.sendStatus(200);
          }
        });
    }
  });
});

//Hämta alla meddelanden
app.get("/messages", (req, res) => {
  database.connect(url, (err, db) => {
    let dbo = db.db("database");
    dbo
      .collection("posts")
      .find({})
      .toArray((err, result) => {
        if (err) {
          res.sendStatus(500);
          throw err;
        }
        db.close();
        res.send(result);
      });
  });
});

//Hämta meddelande
app.get("/messages/:id", (req, res) => {
  const id = parseInt(req.params.id);
  database.connect(url, (err, db) => {
    let dbo = db.db("database");
    dbo.collection("posts").findOne({ id: id }, (err, result) => {
      if (err) {
        res.sendStatus(500);
        throw err;
      }
      db.close();
      if (result == null) {
        res.sendStatus(400);
      } else {
        res.send(result);
      }
    });
  });
});

//Hantera felaktiga metodanrop
app.use(["/messages", "/messages/:id"], (req, res) => {
  res.sendStatus(405);
});

//Hantera felaktiga routes
app.use((req, res) => {
  res.sendStatus(404);
});
