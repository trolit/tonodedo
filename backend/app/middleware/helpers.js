areCredentialsEmpty = (req, res, next) => {

    if (!req.body.email || !req.body.password) {
        res.status(400).send({
            message: "Email and/or password is missing!"
        });
        return;
    }

    next();

};

verifyLoggedUserEmailAsPayload = (req, res, next) => {

    if (req.body.email !== req.decodedEmail) {
        return res.status(401).send({ message: `Not authorized to manipulate ${req.body.email} tasks.`});
    }

    next();

}

verifyLoggedUserEmailAsParam = (req, res, next) => {

    if (req.params.email !== req.decodedEmail) {
        return res.status(401).send({ message: `Not authorized to manipulate ${req.params.email} tasks.`});
    }

    next();

}

const helpers = {
    areCredentialsEmpty: areCredentialsEmpty,
    verifyLoggedUserEmailAsParam: verifyLoggedUserEmailAsParam,
    verifyLoggedUserEmailAsPayload: verifyLoggedUserEmailAsPayload
};

module.exports = helpers;