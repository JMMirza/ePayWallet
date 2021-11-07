const User = require('../../models/User')
const NumberVerification = require('../../models/numVerification')
const Config = require('../../config')
const client = require('twilio')(Config.twillio.accountSid, Config.twillio.authToken)
const bcrypt = require('bcrypt')

async function sendSMS(req, res) {
    try {
        let user = await User.findOne({
            PhoneNumber: req.body.phoneNum
        })
        console.log(user)
        if (user) {
            return res.status(400).json({
                message: "User already exist on this number"
            })
        }
        let val = Math.floor(1000 + Math.random() * 9000);
        console.log(`+${req.body.phoneNum}
        ${val}`)
        await client.messages.create({
            body: `Hello from Node your verification number is ${val}`,
            to: `+${req.body.phoneNum}`,
            from: Config.twillio.from
        })
        const salt = await bcrypt.genSalt(10)
        val = await bcrypt.hash(val.toString(), salt)
        const phoneNum = await NumberVerification.create({
            PassCode: val,
            PhoneNumber: req.body.phoneNum,
        })
        return res.status(200).json({
            message: 'Code sent Successfully!',
            userID: phoneNum._id,
            userContact: `+${req.body.phoneNum}`
        })
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving user',
            error: err
        })
    }
}
async function verifySMS(req, res) {
    try {
        let user = await NumberVerification.findOne({
            PhoneNumber: req.body.phoneNum
        })
        console.log(user)
        if (!user) {
            return res.status(400).json({
                message: 'Number do not found in Database'
            })
        }
        const validCode = await bcrypt.compare(req.body.code, user.PassCode)
        if (!validCode) return res.status(400).json({
            message: 'Incorrect Code!'
        })
        user.IsVerified = true
        await user.save()

        return res.status(200).json({
            message: 'Number verified Successfully!'
        })
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving user',
            error: err
        })
    }
}
module.exports = {
    sendSMS,
    verifySMS
}