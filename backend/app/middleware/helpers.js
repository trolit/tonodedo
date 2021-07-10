areCredentialsEmpty = (req, res, next) => {

    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Email and/or password is missing!"
        });
        return;
    }

    next();

};

verifyLoggedUserEmail = (req, res, next) => {

    if (req.body.email !== req.decodedEmail) {
        return res.status(401).send({ message: `Not authorized to manipulate ${req.body.email} tasks.`});
    }

    next();

}

const helpers = {
    areCredentialsEmpty: areCredentialsEmpty,
    verifyLoggedUserEmail: verifyLoggedUserEmail
};

module.exports = helpers;