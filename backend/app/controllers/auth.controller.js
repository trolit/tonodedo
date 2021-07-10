const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

    User.create({
      email: req.body.email.toLowerCase(),
      password: bcrypt.hashSync(req.body.password, 16)
    })
        .then(() => {
            res.status(201).send({ message: "User was registered successfully!" });
        })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });

};

exports.signin = (req, res) => {

    User.findOne({
      where: {
        email: req.body.email.toLowerCase()
      }
    })
        .then(user => {

            var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
            );
  
            if (!user || !passwordIsValid) {
                return res.status(400).send({
                    accessToken: null,
                    message: "Given credentials are invalid!"
                });
            }
  
            var token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: 86400 // seconds (24 hours)
            });
  
            res.status(200).send({
                id: user.id,
                email: user.email,
                accessToken: token
            });
        })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });

  };