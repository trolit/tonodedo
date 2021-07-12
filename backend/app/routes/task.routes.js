const controller = require("../controllers/task.controller");
const { authJwt, helpers } = require("../middleware");

module.exports = function(app) {

    let baseRoute = "/api/task";

    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.post(
        `${baseRoute}`,
        authJwt.verifyToken,
        helpers.verifyLoggedUserEmailAsPayload,
        controller.create
    );

    app.get(
        `${baseRoute}/:email`, 
        authJwt.verifyToken,
        helpers.verifyLoggedUserEmailAsParam,
        controller.findAllByEmail
    );
  
    app.delete(
        `${baseRoute}/:email/:id`,
        authJwt.verifyToken,
        helpers.verifyLoggedUserEmailAsParam,
        controller.delete
    );

    app.put(
        `${baseRoute}/:id`,
        authJwt.verifyToken,
        helpers.verifyLoggedUserEmailAsPayload,
        controller.update
    );
    
};