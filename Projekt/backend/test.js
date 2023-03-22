const express = require("express");
const assert = require("assert");
const request = require("supertest");

const User = require("./models/User");
const Post = require("./models/Post");

const app = require("./index");

//Generated test user id:s
let user1ID;
let user2ID;
let user3ID;


//Clearing of test objects from DB before tests
describe("GET /auth/testclear", function() {
    it("should return 200", function(done) {
        request(app)
        .post("/api/auth/testclear")
        .end ((err, res) => {
            if (err) {
                throw err;
            }
            assert(res.statusCode == 200);
            done();
          });
    });
});


//AUTH routes

describe("POST /auth/register", function() {
    const userBody1 = {
        username: "TEST_USER_1",
        email: "test1@test.com",
        password: "test_password"
    };
    const userBody2 = {
        username: "TEST_USER_2",
        email: "test2@test.com",
        password: "test_password"
    };
    const userBody3 = {
        username: "TEST_USER_3",
        email: "test3@test.com",
        password: "test_password"
    };

    it("should register user and return 200 OK", function() {
        return request(app)
        .post("/api/auth/register")
        .send(userBody1)
        .expect(200)
    });
    it("should register user and return 200 OK", function() {
        return request(app)
        .post("/api/auth/register")
        .send(userBody2)
        .expect(200)
    });
    it("should register user and return 200 OK", function() {
        return request(app)
        .post("/api/auth/register")
        .send(userBody3)
        .expect(200)
    });
});

describe("POST /auth/login", function() {
    const correctLoginBody = {
        email: "test1@test.com",
        password: "test_password"
    };
    const wrongPasswordLoginBody = {
        email: "test1@test.com",
        password: "incorrect_password"
    };
    const nonExistantUserLoginBody = {
        email: "impossible_email",
        password: "test_password"
    };

    it("responds with user information", function(done) {
        request(app)
        .post("/api/auth/login")
        .send(correctLoginBody)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then( response => {
            assert.equal(response.body.email, 'test1@test.com');
            assert.equal(response.body.username, 'TEST_USER_1');
            done();
        }).catch(err => done(err))
    });
    it("responds with 400 on wrong password", function(done) {
        request(app)
        .post("/api/auth/login")
        .send(wrongPasswordLoginBody)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(400)
        .then( () => {
            done();
        }).catch(err => done(err))
    });
    it("responds with 404 on nonexistant user", function(done) {
        request(app)
        .post("/api/auth/login")
        .send(nonExistantUserLoginBody)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404)
        .then( () => {
            done();
        }).catch(err => done(err))
    });
});


//USERS routes

describe("GET /api/users/search/:query", () => {
    it("should find all test users", (done) => {
        request(app)
            .get("/api/users/search/TEST_USER")
            .set('Accept', 'application/json')
            .expect(200)
            .then( (response)=>{
                user1ID = response.body[0]._id.toString();
                user2ID = response.body[1]._id.toString();
                user3ID = response.body[2]._id.toString();
                assert.equal(response.body[0].username, 'TEST_USER_1');
                assert.equal(response.body[1].username, 'TEST_USER_2');
                assert.equal(response.body[2].username, 'TEST_USER_3');
                done();
            })
    });
    it("should return list of all users on * query", (done) => {
        request(app)
            .get("/api/users/search/*")
            .set('Accept', 'application/json')
            .expect(200)
            .then( (response)=>{
                assert(response.body.length >= 3);
                done();
            })
    });
    it("should return empty list if user doesn't exist", (done) => {
        request(app)
            .get("/api/users/search/19834923692174308237498274591283742983749827398292837")
            .set('Accept', 'application/json')
            .expect(200)
            .then( (response)=>{
                assert.equal(response.body.length, 0);
                done();
            })
    });
});

describe("GET /api/users/:id", () => {
    it("should return the first test user", (done) => {
        request(app)
            .get("/api/users/"+user1ID)
            .expect(200)
            .then( (response)=>{
                assert.equal(response.statusCode,200);
                assert.equal(response.body.email, "test1@test.com");
                done();
            })
    });
    it("should return 404 if user not found", (done) => {
        request(app)
            .get("/api/users/404")
            .expect(404)
            .then( (response)=>{
                assert.equal(response.statusCode,404);
                done();
            })
    });
});

describe("PUT /api/users/:id/friendRequest", () => {
    it("should send friend request and return 200", (done) => {
        const friendRequestBody = {
            _id: user1ID
        };
        request(app)
            .put("/api/users/"+user2ID+"/friendRequest")
            .send(friendRequestBody)
            .expect(200)
            .then( (response)=>{
                assert.equal(response.statusCode,200);
                done();
            })
    });
    it("should return 403 if trying to friend yourself", (done) => {
        const friendRequestBody = {
            _id: user1ID
        };
        request(app)
            .put("/api/users/"+user1ID+"/friendRequest")
            .send(friendRequestBody)
            .expect(403)
            .then( (response)=>{
                assert.equal(response.statusCode,403);
                done();
            })
    });
    it("should return 403 if trying to resend unanswered friendrequest", (done) => {
        const friendRequestBody = {
            _id: user1ID
        };
        request(app)
            .put("/api/users/"+user2ID+"/friendRequest")
            .send(friendRequestBody)
            .expect(403)
            .then( (response)=>{
                assert.equal(response.statusCode,403);
                done();
            })
    });
    it("should send friend request and return 200 when answering request", (done) => {
        const friendRequestBody = {
            _id: user2ID
        };
        request(app)
            .put("/api/users/"+user1ID+"/friendRequest")
            .send(friendRequestBody)
            .expect(200)
            .then( (response)=>{
                assert.equal(response.statusCode,200);
                done();
            })
    });
    it("should return 403 when sending request to friend", (done) => {
        const friendRequestBody = {
            _id: user2ID
        };
        request(app)
            .put("/api/users/"+user1ID+"/friendRequest")
            .send(friendRequestBody)
            .expect(403)
            .then( (response)=>{
                assert.equal(response.statusCode,403);
                done();
            })
    });
});


//POSTS routes

describe("POST /posts/", function() {
    it("creates a post and returns 200", function(done) {
        const testPost = {
            posterId: user1ID,
            hostId: user2ID,
            username: "TEST_USER_1",
            text: "TEST POST TEXT",
        };
        request(app)
        .post("/api/posts/")
        .send(testPost)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then( response => {
            assert.equal(response.statusCode,200);
            assert.equal(response.body.text, "TEST POST TEXT")
            done();
        }).catch(err => done(err))
    });
    it("returns 403 when trying to post to non-friend", function(done) {
        const testPost = {
            posterId: user1ID,
            hostId: user3ID,
            username: "TEST_USER_1",
            text: "TEST POST TEXT",
        };
        request(app)
        .post("/api/posts/")
        .send(testPost)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(403)
        .then( response => {
            assert.equal(response.statusCode,403);
            done();
        }).catch(err => done(err))
    });
});

describe("GET /api/posts/:id", () => {
    it("should return the test post", (done) => {
        request(app)
            .get("/api/posts/"+user2ID)
            .expect(200)
            .then( response => {
                assert.equal(response.statusCode,200);
                assert.equal(response.body[0].text, "TEST POST TEXT")
                done();
            }).catch(err => done(err))
    });
});

//General tests

describe("Calling non-existant route", () => {
    it("should return status 404", () => {
        return request(app)
            .get("/non-existant")
            .expect(404)
    });
});


//Clearing of test objects from DB efter tests
describe("GET /auth/testclear", function() {
    it("should return 200", function(done) {
        request(app)
        .post("/api/auth/testclear")
        .end ((err, res) => {
            if (err) {
                throw err;
            }
            assert(res.statusCode == 200);
            done();
          });
    });
});
