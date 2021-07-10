const { verifySignUp, helpers } = require("../middleware");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {

    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

    app.post(
        "/api/auth/signup",
        helpers.areCredentialsEmpty,
        verifySignUp.checkDuplicateEmail,
        controller.signup
    );
  
    app.post('/api/auth/signin',
        helpers.areCredentialsEmpty,
        controller.signin
    );

};