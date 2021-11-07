const express = require('express')
const router = express.Router()

const validationRules = require("../middlewares/validationRules")
const middleware = require("../middlewares/middleware")
const authentication = require("../middlewares/authentication")
const userGetMethod = require('../controllers/user/userGetMethod')
const userPostMethod = require('../controllers/user/userPostMethod')
const paystack = require("../controllers/user/paystack")

router.post("/sendSMS", userGetMethod.sendSMS)
router.post("/verifySMS", userGetMethod.verifySMS)
router.post("/signup", validationRules.signupValidation, userPostMethod.signUp)
router.post("/signin", validationRules.loginValidation, userPostMethod.signin)
router.post("/sendMoney", authentication.authenticateToken, validationRules.sendMoneyValidation, middleware.checkBalance, userPostMethod.sendMoney)
router.post("/recieveMoneyOTP", authentication.authenticateToken, validationRules.recieveAmountValidation, userPostMethod.recieveAmountOTP)

router.post('/paystack/pay', authentication.authenticateToken, validationRules.topupValidation, paystack.initializePayment);
router.get('/paystack/callback', authentication.authenticateToken, paystack.verifyPayment);
module.exports = router
