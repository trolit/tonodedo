const controller = require("../controllers/task.controller");
const { authJwt, helpers } = require("../middleware");

module.exports = function(app) {

    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post(
        "/api/task",
        authJwt.verifyToken,
        helpers.verifyLoggedUserEmail,
        controller.create
    );

    app.get(
        "/api/task", 
        authJwt.verifyToken,
        helpers.verifyLoggedUserEmail,
        controller.findAllByEmail
    );
  
    app.delete(
        "/api/task/:id",
        authJwt.verifyToken,
        helpers.verifyLoggedUserEmail,
        controller.delete
    );

    app.put(
        "/api/task/:id",
        authJwt.verifyToken,
        helpers.verifyLoggedUserEmail,
        controller.update
    );
    
};