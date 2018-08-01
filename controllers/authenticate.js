"use strict";
const User = require('../database/db-connect').User;
const jwt = require('jsonwebtoken');
let responseJSON = require('./response');

module.exports = function authenticate() {
    return function (req, res, next) {
        let token = req.body.token || req.query.token || req.headers.authorization;
        if (token) {
            jwt.verify(token, 'secretKey', function (err, decoded) {
                if (err) {
                    console.error(err);
                    return res.status(401).send(responseJSON(401, 'Failed to authenticate' + err));
                } else {
                    User.findOne({
                        where: {
                            username: decoded.username
                        }
                    }).then((user) => {
                        if (user) {
                            req.decoded = user.toJSON();
                            next();
                        } else {
                            User.create({
                                username: decoded.username,
                                password: '=========================',
                                role: decoded.role,
                                // idCompany: 1
                            }).then(user => {
                                req.decoded = user.toJSON();
                                next();
                            }).catch(err => {
                                return res.status(401).send(responseJSON(401, 'Failed to authenticate' + err));
                            });
                        }
                    });
                }
            });
        } else {
            return res.status(401).send(responseJSON(401, 'No token provided'));
        }
    }
}
