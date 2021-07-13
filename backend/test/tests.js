chai = require('chai');
chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect  = chai.expect;
var request = require("request");

/*
  1. run node server.js
  2. run npm test (data will be created for test purposes and then removed)
*/

describe("To-node-Do API unit tests", function() {

    var baseUrl = "http://localhost:8080/api";
    var taskUrl = `${baseUrl}/task`;
    var authUrl = `${baseUrl}/auth`;

    var inValidToken = "inVALID";

    var existingUserEmail = "fasa@zz.pl"
    
    var emailNotAppearingInValidToken = "myEmail@poczta.nowa.pl"
    
    var validToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZhc2FAenoucGwiLCJpYXQiOjE2MjYxMzU4MTUsImV4cCI6MTYyNjIyMjIxNX0.Lep-d16N3Np7UV1DI5dPxpxa4QoctNevR2DhceIYifU";
    var wrongEmail = "fafa";
    var wrongPassword = "pass";
    var validPassword ="fasa";
    var minimalTokenLength = 50;

    // *********************************
    // TESTS
    // *********************************

    describe("<> Get tasks by email tests", function() {

      it("returns ok(200) on valid token", function() {
        request.get(`${taskUrl}/${existingUserEmail}`, function(error, response, body) {

          expect(JSON.parse(body))
            .to.be.an.instanceof(Array)
            .and.to.have.property(0)
            .that.includes.all.keys([ 'id', 'description', 'createdAt', 'updatedAt', 'userEmail' ]);
          expect(response.statusCode).to.equal(200);

        }).setHeader("x-access-token", validToken);
      });

      it("returns unauthorized(401) on invalid token", function() {
        request.get(`${taskUrl}/${existingUserEmail}`, function(error, response, body) {

          expect(JSON.parse(body).message).to.equal("Unauthorized!");
          expect(response.statusCode).to.equal(401);

        }).setHeader("x-access-token", inValidToken);
      });

      it("returns forbidden(403) on missing token", function() {
        request.get(`${taskUrl}/${existingUserEmail}`, function(error, response, body) {

          expect(JSON.parse(body).message).to.equal("No token provided!");
          expect(response.statusCode).to.equal(403);

        });
      });

      it("returns unauthorized(401) on requesting other email content than the one carried by token", function() {
        request.get(`${taskUrl}/${emailNotAppearingInValidToken}`, function(error, response, body) {

          // expect(JSON.parse(body).message).to.equal(`Not authorized to manipulate ${emailNotAppearingInValidToken} tasks.`);
          expect(response.statusCode).to.equal(401);
          
        }).setHeader("x-access-token", validToken);
      });

      it("returns not found(404) on not passing email param", function() {
        request.get(`${taskUrl}/`, function(error, response, body) {

          expect(response.statusCode).to.equal(404);

        }).setHeader("x-access-token", validToken);
      });

    });
  



    describe("<> Sign in tests", function() {

      signInUrl = `${authUrl}/signin`;

      it("returns bad request(400) on invalid credentials", function() {
        request.post(`${signInUrl}`, { json: { email: wrongEmail, password: wrongPassword } }, function(error, response, body) {

          expect(body.message).to.equal("Given credentials are invalid!");
          expect(response.statusCode).to.equal(400);

        });
      });

      it("returns bad request(400) on missing password", function() {
        request.post(`${signInUrl}`, { json: { email: wrongEmail } }, function(error, response, body) {

          expect(body.message).to.equal("Email and/or password is missing!");
          expect(response.statusCode).to.equal(400);
          
        });
      });

      it("returns bad request(400) on missing email", function() {
        request.post(`${signInUrl}`, { json: { password: wrongPassword } }, function(error, response, body) {

          expect(body.message).to.equal("Email and/or password is missing!");
          expect(response.statusCode).to.equal(400);

        });
      });

      it("returns bad request(400) on missing body", function() {
        request.post(`${signInUrl}`, function(error, response, body) {

          expect(JSON.parse(body).message).to.equal("Email and/or password is missing!");
          expect(response.statusCode).to.equal(400);

        });
      });

      it("returns token(200) on valid credentials", function() {
        request.post(`${signInUrl}`, { json: { email: existingUserEmail, password: validPassword } }, function(error, response, body) {
          
          expect(body.email).to.equal(existingUserEmail);
          expect(body.accessToken).to.length.greaterThan(minimalTokenLength);
          expect(response.statusCode).to.equal(200);

        });
      });
    });




    describe("<> Create task tests", function() {

      it("returns created(201) on successful task creation", function() {
        request.post(`${taskUrl}`, { json: { email: existingUserEmail, description: "test123" } }, function(error, response, body) {    

          expect(body.task);
          expect(response.statusCode).to.equal(201);
          
          // remove from Db after test
          request.delete(`${taskUrl}/${existingUserEmail}/${body.task.id}`).setHeader("x-access-token", validToken);
        }).setHeader("x-access-token", validToken);
      });

      it("returns bad request(400) on empty description", function() {
        request.post(`${taskUrl}`, { json: { email: existingUserEmail, description: "" } }, function(error, response, body) {    

          expect(body.message).to.equal("No description provided.");
          expect(response.statusCode).to.equal(400);
          
        }).setHeader("x-access-token", validToken);
      });

      it("returns unauthorized(401) on trying to add task to different email than the one in token", function() {
        request.post(`${taskUrl}`, { json: { email: wrongEmail, description: "test123" } }, function(error, response, body) {    

          expect(body.message).to.equal(`Not authorized to manipulate ${wrongEmail} tasks.`);
          expect(response.statusCode).to.equal(401);
          
        }).setHeader("x-access-token", validToken);
      });
    });
});