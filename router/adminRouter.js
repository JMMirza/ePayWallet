const express = require('express')
const router = express.Router()

const validationRules = require("../middlewares/validationRules")
const authentication = require("../middlewares/authentication")
const adminPostMethod = require('../controllers/admin/adminPostMethod')
const adminGetMethod = require('../controllers/admin/adminGetMethod')

router.post("/signin", validationRules.loginValidation, adminPostMethod.signin)
router.post("/createReward", authentication.authenticateToken, validationRules.createRewardValidation, adminPostMethod.createReward)
router.post("/createVoucher", authentication.authenticateToken, validationRules.createVoucherValidation, adminPostMethod.createVoucher)
router.get("/generateVoucherCode", authentication.authenticateToken, adminGetMethod.generateVoucherCode)
router.get("/disableVoucherCode", authentication.authenticateToken, adminGetMethod.disableVoucher)
router.get("/disableUser", authentication.authenticateToken, adminGetMethod.disableUser)

module.exports = router
