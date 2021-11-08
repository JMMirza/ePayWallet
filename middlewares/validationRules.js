const Joi = require("joi");
const Validate = require("./validate");

function signupValidation(req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        name: Joi.string().required(),
        surName: Joi.string().required(),
        phoneNum: Joi.string().required(),
        password: Joi.string().required(),
    });
    Validate.validate(req, data, schema, res, next);
}

function loginValidation(req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
        phoneNum: Joi.string().required(),
        password: Joi.string().required(),
    });
    Validate.validate(req, data, schema, res, next);
}

function sendMoneyValidation(req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
        phoneNum: Joi.string().required(),
        amount: Joi.number().integer().min(1).max(150).required(),
    });
    Validate.validate(req, data, schema, res, next);
}

function recieveAmountValidation(req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
        transactionID: Joi.string().required(),
        OTP: Joi.number().integer().required(),
    });
    Validate.validate(req, data, schema, res, next);
}

function topupValidation(req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        amount: Joi.number().min(1).required()
    });
    Validate.validate(req, data, schema, res, next);
}

function createRewardValidation(req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
        RewardNewUser: Joi.number().min(1),
        ReferalReward: Joi.number().min(1),
    });
    Validate.validate(req, data, schema, res, next);
}

function createVoucherValidation(req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
        VoucherCode: Joi.string().required(),
        Reward: Joi.number().min(1).required(),
    });
    Validate.validate(req, data, schema, res, next);
}

function addLocationrValidation(req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
        address: Joi.string().required(),
    });
    Validate.validate(req, data, schema, res, next);
}
function voucherSystemValidation(req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
        VoucherCode: Joi.string().required(),
    });
    Validate.validate(req, data, schema, res, next);
}
module.exports = {
    signupValidation,
    loginValidation,
    sendMoneyValidation,
    recieveAmountValidation,
    topupValidation,
    createRewardValidation,
    createVoucherValidation,
    addLocationrValidation,
    voucherSystemValidation
};
