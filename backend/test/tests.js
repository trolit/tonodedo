chai = require('chai');
chaiHttp = require('chai-http');

chai.use(chaiHttp);

var expect  = chai.expect;
var request = require("request");

/*
  Before running up tests, create testing purposes account and fill in token below.
  Also make sure that "testingAccountEmail" has at least one task!
*/

var testingAccountEmail = "iAmOnlyForTestingPurposes@iAmOnlyForTestingPurposes.RR.pl";
var testingAccountPassword = "strongPassword1234";
var testingAccountToken = "token";

var baseUrl = "http://localhost:8080/api";
var taskUrl = `${baseUrl}/task`;
var authUrl = `${baseUrl}/auth`;
var signInUrl = `${authUrl}/signin`;

var inValidToken = "inVALID";

var emailNotCarriedByToken = "myEmail@test.domain"

var invalidEmail = "iDontExistBecauseImOnlyForUnitTestingPurposes@exception.arw";
var invalidPassword = "nooneHasPasswordLikeThat";

var createdTaskId;

describe("\n-----------------------------\nto-node-do API unit tests\n-----------------------------\n", function() {

    describe("<!> Sign up tests", function() {

      var newAccountEmail = "newAccount@email.com";
      var newAccountPassword = "newAccount.password";

      it("returns message on successful registration", function() {
        request.post(`${authUrl}/signup`, { 
          json: { 
            email: newAccountEmail, 
            password: newAccountPassword 
          } 
        }, function(error, response, body) {
  
          expect(body.message).to.equal("User was registered successfully!");
          expect(response.statusCode).to.equal(201);
  
        });
      });

      it("returns bad request on trying to register with already used address", function() {
        request.post(`${authUrl}/signup`, { 
          json: { 
            email: testingAccountEmail, 
            password: newAccountPassword 
          } 
        }, function(error, response, body) {
  
          expect(body.message).to.equal("Failed! Email is already in use!");
          expect(response.statusCode).to.equal(400);
  
        });
      });

      it("returns bad request on no password provided", function() {
        request.post(`${authUrl}/signup`, { 
          json: { 
            email: testingAccountEmail
          } 
        }, function(error, response, body) {
  
          expect(body.message).to.equal("Email and/or password is missing!");
          expect(response.statusCode).to.equal(400);
  
        });
      });

      it("returns bad request on no email provided", function() {
        request.post(`${authUrl}/signup`, { 
          json: { 
            password: newAccountPassword
          } 
        }, function(error, response, body) {
  
          expect(body.message).to.equal("Email and/or password is missing!");
          expect(response.statusCode).to.equal(400);
  
        });
      });

      it("returns bad request on no data provided", function() {
        request.post(`${authUrl}/signup`, function(error, response, body) {

          expect(JSON.parse(body).message).to.equal("Email and/or password is missing!");
          expect(response.statusCode).to.equal(400);
  
        });
      });

    });

    describe("<!> Sign in tests", function() {

      var minimalTokenLength = 50;
      
      it("return token and email on valid credentials", function() {
        request.post(`${signInUrl}`, { 
          json: { 
            email: testingAccountEmail, 
            password: testingAccountPassword 
          } 
        }, function(error, response, body) {

          expect(body.email).to.equal(testingAccountEmail);
          expect(body.accessToken).to.length.greaterThan(minimalTokenLength);
          expect(response.statusCode).to.equal(200);

        });
      });

      it("returns bad request on invalid credentials", function() {
        request.post(`${signInUrl}`, { 
          json: { 
            email: invalidEmail, 
            password: invalidPassword 
          } 
        }, function(error, response, body) {

          expect(body.message).to.equal("Given credentials are invalid!");
          expect(response.statusCode).to.equal(400);

        });
      });

      it("returns bad request on missing password", function() {
        request.post(`${signInUrl}`, { 
          json: { 
            email: invalidEmail 
          } 
        }, function(error, response, body) {

          expect(body.message).to.equal("Email and/or password is missing!");
          expect(response.statusCode).to.equal(400);
          
        });
      });

      it("returns bad request on missing email", function() {
        request.post(`${signInUrl}`, { 
          json: { 
            password: invalidPassword 
          } 
        }, function(error, response, body) {

          expect(body.message).to.equal("Email and/or password is missing!");
          expect(response.statusCode).to.equal(400);

        });
      });

      it("returns bad request on missing body", function() {
        request.post(`${signInUrl}`, function(error, response, body) {

          expect(JSON.parse(body).message).to.equal("Email and/or password is missing!");
          expect(response.statusCode).to.equal(400);

        });
      });

    });

    describe("<!> Create task tests", function() {

      it("returns task on successful creation request", function() {
        request.post(`${taskUrl}`, { 
          json: { 
            email: testingAccountEmail, 
            description: "test descriptionf afafaf" 
          } 
        }, function(error, response, body) {    

          expect(body.task);
          expect(response.statusCode).to.equal(201);
        }).setHeader("x-access-token", testingAccountToken);
      });

      it("returns bad request on empty description", function() {
        request.post(`${taskUrl}`, { 
          json: { 
            email: testingAccountEmail, 
            description: "" 
          } 
        }, function(error, response, body) {    

          expect(body.message).to.equal("No description provided.");
          expect(response.statusCode).to.equal(400);
          
        }).setHeader("x-access-token", testingAccountToken);
      });

      it("returns unauthorized when adding task to unowned email", function() {
        request.post(`${taskUrl}`, { 
          json: { 
            email: invalidEmail, 
            description: "test123" 
          } 
        }, function(error, response, body) {    

          expect(body.message).to.equal(`Not authorized to manipulate ${invalidEmail} tasks.`);
          expect(response.statusCode).to.equal(401);
          
        }).setHeader("x-access-token", testingAccountToken);
      });
    });

    describe("<!> Get tasks by email tests", function() {

      it("returns tasks on valid token", function() {
        request.get(`${taskUrl}/${testingAccountEmail}`, function(error, response, body) {

          expect(JSON.parse(body))
            .to.be.an.instanceof(Array)
            .and.to.have.property(0)
            .that.includes.all.keys([ 'id', 'description', 'createdAt', 'updatedAt', 'userEmail' ]);
          expect(response.statusCode).to.equal(200);

        }).setHeader("x-access-token", testingAccountToken);
      });

      it("returns unauthorized on invalid token", function() {
        request.get(`${taskUrl}/${testingAccountEmail}`, function(error, response, body) {

          expect(JSON.parse(body).message).to.equal("Unauthorized!");
          expect(response.statusCode).to.equal(401);

        }).setHeader("x-access-token", inValidToken);
      });

      it("returns forbidden on missing token", function() {
        request.get(`${taskUrl}/${testingAccountEmail}`, function(error, response, body) {

          expect(JSON.parse(body).message).to.equal("No token provided!");
          expect(response.statusCode).to.equal(403);

        });
      });

      it("returns unauthorized on requesting tasks assigned to other account", function() {
        request.get(`${taskUrl}/${emailNotCarriedByToken}`, function(error, response, body) {

          expect(JSON.parse(body).message).to.equal(`Not authorized to manipulate ${emailNotCarriedByToken} tasks.`);
          expect(response.statusCode).to.equal(401);
          
        }).setHeader("x-access-token", testingAccountToken);
      });

      it("returns not found on not passing email param", function() {
        request.get(`${taskUrl}/`, function(error, response, body) {

          expect(response.statusCode).to.equal(404);

        }).setHeader("x-access-token", testingAccountToken);
      });

    });

    describe("<!> Clean temporary data", function() {
          console.log(createdTaskId
          );
          // remove from Db after test
    });
    
});