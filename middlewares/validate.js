const Joi = require('joi');
var validate = function(req, data, schema, res, next) {
    Joi.validate(data, schema, (err, value) => {
        if (err) {
            var message = err.details[0].message.replace(/[^a-zA-Z ]/g, "")
            res.status(422).json({
                code:400,
                status: 'Field Validation Failed !',
                message: message,
                data:[]
            });
        } else {
            next();
        }
    })
}
module.exports = {
    validate
}