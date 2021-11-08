const express = require('express')
const router = express.Router()

const validationRules = require("../middlewares/validationRules")
const middleware = require("../middlewares/middleware")
const authentication = require("../middlewares/authentication")
const partnerGetMethod = require('../controllers/partner/partnerGetMethod')
const partnerPostMethod = require('../controllers/partner/partnerPostMethod')
const paystack = require("../controllers/user/paystack")

router.post("/sendSMS", partnerGetMethod.sendSMS)
router.post("/verifySMS", partnerGetMethod.verifySMS)
router.post("/signup", validationRules.signupValidation, partnerPostMethod.signUp)
router.post("/signin", validationRules.loginValidation, partnerPostMethod.signin)
router.post("/sendMoney", authentication.authenticateToken, validationRules.sendMoneyValidation, middleware.checkBalance, partnerPostMethod.sendMoney)
router.post("/recieveMoneyOTP", authentication.authenticateToken, validationRules.recieveAmountValidation, partnerPostMethod.recieveAmountOTP)
router.post('/addLocation', authentication.authenticateToken, validationRules.addLocationrValidation, partnerPostMethod.addLocation)
router.post("/voucher", authentication.authenticateToken, validationRules.voucherSystemValidation, partnerPostMethod.voucherSystem)

router.post('/paystack/pay', authentication.authenticateToken, validationRules.topupValidation, paystack.initializePayment);
router.get('/paystack/callback', authentication.authenticateToken, paystack.verifyPayment);
module.exports = router
