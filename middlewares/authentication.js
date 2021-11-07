// import dependencies
const jwt = require('jsonwebtoken');
const Config = require('./../config');
var authenticateToken = function(req, res, next) {
        if (req.headers && req.headers.authorization) {
            jwt.verify(req.headers.authorization,
                Config.secret,
                (err, decoded) => {
                    if(err){
                        if (err.message.includes('jwt expired')) {
                            return res.status(400).json({
                                code: 401,
                                message: "This link is expired"
                            });
                        } else {
                            console.log('Unauthorized. Jwt token not verified.');
                            return res
                                .status(400)
                                .json({code: 400, message: err.message});
                        }
                    }
                    
                    req.auth = decoded;
                    console.log(`User authorized to access `);
                    next();
                });
        } else {
            console.log('Unauthorized. Jwt token not found.');
            return res.status(401).json({
                code: 401,
                message: "You are Unauthorized to access content"
            });
        }
    } // authenticateToken


var customAuthenticationToken = function(req, res, next) {
        if (req.headers && req.headers.authorization) {
            jwt.verify(req.headers.authorization,
                'Config.secret',
                (err, decoded) => {
                    if(err){
                        if (err.message.includes('jwt expired')) {
                            return res.status(400).json({
                                code: 401,
                                message: "This link is expired"
                            });
                        } else {
                            console.log('Unauthorized. Jwt token not verified.');
                            return res
                                .status(400)
                                .json({code: 400, message: err.message});
                        }
                    }
                    
                    req.auth = decoded;
                    console.log(`User authorized to access `);
                    next();
                });
        } else {
            console.log('Unauthorized. Jwt token not found.');
            return res.status(401).json({
                code: 401,
                message: "You are Unauthorized to access content"
            });
        }
    }

module.exports = {
    authenticateToken, customAuthenticationToken
};
