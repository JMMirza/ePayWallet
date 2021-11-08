const Admin = require('../../models/Admin')
const Reward = require("../../models/Reward")
const Voucher = require("../../models/Voucher")
const bcrypt = require('bcrypt')

async function signin(req, res) {
    try {
        const user = await Admin.findOne({
            PhoneNumber: req.body.phoneNum
        })
        if (!user) {
            return res.status(400).json({
                message: "Admin not found"
            })
        }
        const validPass = await bcrypt.compare(req.body.password, user.Password)
        if (!validPass) return res.status(400).json({
            message: 'Incorrect Password!'
        })
        const token = user.generateAuthToken()
        console.log(token)
        return res.status(200).json({
            message: "Welcome admin",
            token: token
        })
    } catch (error) {
        res.status(500).send({
            message: error
        })
    }
}
async function createReward(req, res) {
    try {
        const user = await Admin.findOne({
            PhoneNumber: req.auth.PhoneNumber
        })
        if (!user) {
            return res.status(400).json({
                message: "Admin not found"
            })
        }
        const reward = await Reward.findOne({})
        if (!reward) {
            await Reward.create({
                RewardNewUser: req.body.RewardNewUser,
                ReferalReward: req.body.ReferalReward
            })
        } else {
            reward.RewardNewUser = req.body.RewardNewUser
            reward.ReferalReward = req.body.ReferalReward
            await reward.save()

        }
        return res.status(200).json({
            message: "reward created successfully"
        })
    } catch (error) {
        res.status(500).send({
            message: error
        })
    }
}

async function createVoucher(req, res) {
    try {
        const user = await Admin.findOne({
            PhoneNumber: req.auth.PhoneNumber
        })
        if (!user) {
            return res.status(400).json({
                message: "Admin not found"
            })
        }
        const voucher = await Voucher.findOne({
            VoucherCode: req.body.VoucherCode,
        })
        if (voucher) {
            return res.status(400).json({
                message: "Voucher Code already exits"
            })
        }
        await Voucher.create({
            VoucherCode: req.body.VoucherCode,
            Reward: req.body.Reward
        })
        return res.status(200).json({
            message: "Voucher created successfully"
        })
    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }
}
module.exports = {
    signin,
    createReward,
    createVoucher,
}
