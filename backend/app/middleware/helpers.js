areCredentialsEmpty = (req, res, next) => {

    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Email and/or password is missing!"
        });
        return;
    }

    next();

};

const helpers = {
    areCredentialsEmpty: areCredentialsEmpty
};

module.exports = helpers;