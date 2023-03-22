const assert = require("assert");
const request = require("supertest");
const express = require("express");

const app = require("../index.js");

//Database
const database = require("mongodb").MongoClient;
const { response } = require("express");
const url = "mongodb://127.0.0.1/database";

describe("Save messages", function () {
  testMessage = Date.now().toString();
  it("should return status 200 after saving message", function (done) {
    request(app)
      .post("/messages")
      .send({ message: testMessage })
      .end((err, res) => {
        if (err) {
          throw err;
        }
        assert.equal(res.statusCode,200);
        done();
      });
  });
  it("should have saved the message from previous test", function (done) {
    database.connect(url, (err, db) => {
      let dbo = db.db("database");
      dbo
        .collection("posts")
        .findOne({ message: testMessage }, (err, result) => {
          if (err) throw err;
          db.close();
          assert.equal(testMessage, result.message);
          return done();
        });
    });
  });

  it("should not save a message that is too long and return 400", function (done) {
    const TOO_LONG =
      "TenLettersTenLettersTenLettersTenLettersTenLettersTenLettersTenLettersTenLettersTenLettersTenLettersTenLettersTenLettersTenLettersTenLettersAndSix"; //146 chars
    request(app)
      .post("/messages")
      .send({ message: TOO_LONG })
      .end((err, res) => {
        if (err) {
          throw err;
        }
        assert(res.statusCode == 400);

        //check that message is not in DB
        database.connect(url, (err, db) => {
          let dbo = db.db("database");
          dbo
            .collection("posts")
            .findOne({ message: TOO_LONG }, (err, result) => {
              if (err) throw err;
              db.close();
              assert(result === null);
            });

          done();
        });
      });
  });

  it("should not save a message that is too short and return 400", function (done) {
    request(app)
      .post("/messages")
      .send({ message: "" })
      .end((err, res) => {
        if (err) {
          throw err;
        }
        assert(res.statusCode == 400);

        //check that message is not in DB
        database.connect(url, (err, db) => {
          let dbo = db.db("database");
          dbo
            .collection("posts")
            .findOne({ message: "" }, (err, result) => {
              if (err) throw err;
              db.close();
              assert(result === null);
            });

          done();
        });
      });
  });
});

describe("Mark read change request", function () {
  //Create testmessage in DB
  messageId = Date.now();
  database.connect(url, (err, db) => {
    if (err) throw err;
    let dbo = db.db("database");
    let newPost = {
      id: messageId,
      readstatus: false,
      message: "Readstatus Test " + messageId.toString(),
    };
    dbo.collection("posts").insertOne(newPost, (err, result) => {
      if (err) throw err;
      db.close();
    });
  });
  it("should return 200 and change readstatus from false to true", function (done) {
    request(app)
      .patch("/messages/" + messageId)
      .send({ readstatus: true })
      .then((err, res) => {
        if (err) {
          throw err;
        }
        assert(res.statusCode == 200);
      })
      .then(() => {
        //Check if message has updated readstatus
        database.connect(url, (err, db) => {
          let dbo = db.db("database");
          dbo.collection("posts").findOne({ id: messageId }, (err, result) => {
            if (err) throw err;
            db.close();
            assert(result.readstatus);
          });
        });
      });
    done();
  });
  it("should send code 400: Bad Request if id does not exist", function (done) {
    request(app)
      .patch("/messages/0")
      .send({ readstatus: true })
      .end((err, res) => {
        if (err) {
          throw err;
        }
        assert(res.statusCode == 400);
        done();
      });
  });
  it("should send code 400: Bad Request if readStatus value is not a bool and not change value", function (done) {
    request(app)
      .patch("/messages/" + messageId)
      .send({ readstatus: null })
      .end((err, res) => {
        if (err) {
          throw err;
        }
        assert(res.statusCode == 400);
      });
    //Check if message has updated readstatus
    database.connect(url, (err, db) => {
      let dbo = db.db("database");
      dbo.collection("posts").findOne({ id: messageId }, (err, result) => {
        if (err) throw err;
        db.close();
        assert(result.readstatus);
      });
    });
    done();
  });
});

describe("Get all messages", function () {
  it("responds with json", function (done) {
    request(app)
      .get("/messages")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        assert(res.statusCode == 200);
        done();
      });
  });

  it('should return all items of the "posts" collection', function (done) {
    testCollection = {};
    request(app)
      .get("/messages")
      .set("Accept", "application/json")
      .then((response) => {
        database.connect(url, (err, db) => {
          let dbo = db.db("database");
          dbo
            .collection("posts")
            .find({})
            .toArray((err, result) => {
              if (err) throw err;
              db.close();
              testCollection = result;
            });
        });
        assert(response, testCollection);
        done();
      })
      .catch((err) => done(err));
  });
});

describe("Get a single message", function () {
  //Create testmessage in DB
  messageId = Date.now();
  database.connect(url, (err, db) => {
    if (err) throw err;
    let dbo = db.db("database");
    let newPost = {
      id: messageId,
      readstatus: false,
      $message: '$Get test message. \'"\/$[].>',
    };
    dbo.collection("posts").insertOne(newPost, (err, result) => {
      if (err) throw err;
      db.close();
    });
  });

  it("responds with json", function (done) {
    request(app)
      .get("/messages/" + messageId)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        assert(res.statusCode == 200);
        done();
      });
  });

  it("should return the correct message content", function (done) {
    request(app)
      .get("/messages/" + messageId)
      .set("Accept", "application/json")
      .expect((result) => {
        assert(result.body.message == '$Get test message. *_/(!"');
      });
    done();
  });

  it("should send code 400: Bad Request if id does not exist", function (done) {
    request(app)
      .get("/messages/0")
      .end((err, res) => {
        if (err) {
          throw err;
        }
        assert(res.statusCode == 400);
        done();
      });
  });
});

describe("General error codes", function () {
  it("should return code 405: Invalid Method", function (done) {
    request(app)
      .delete("/messages/")
      .end((err, res) => {
        if (err) {
          throw err;
        }
        assert(res.statusCode == 405);
        done();
      });
  });

  it("should return 404: Not found", function (done) {
    request(app)
      .get("/message/")
      .end((err, res) => {
        if (err) {
          throw err;
        }
        assert(res.statusCode == 404);
        done();
      });
  });
});
