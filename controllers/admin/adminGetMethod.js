const Admin = require('../../models/Admin')
const Voucher = require('../../models/Voucher')
const User = require("../../models/User")

async function generateVoucherCode(req, res) {
    try {
        const user = await Admin.findOne({
            PhoneNumber: req.auth.PhoneNumber
        })
        if (!user) {
            return res.status(400).json({
                message: "Admin not found"
            })
        }
        let randomString = (Math.random() + 1).toString(36).substring(6);
        console.log("random", randomString);
        return res.status(200).json({
            message: "Voucher code generated successfully",
            Code: randomString
        })
    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }
}
async function disableVoucher(req, res) {
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
            VoucherCode: req.query.VoucherCode
        })
        if (!voucher) {
            return res.status(200).json({
                message: "No voucher found",
            })
        }
        if (voucher.Disable == true) {
            return res.status(400).json({
                message: "voucher already disabled"
            })
        }
        voucher.Disable = true
        await voucher.save()
        return res.status(200).json({
            message: "Voucher disabled successfully",
            Voucher: voucher
        })
    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }
}
async function disableUser(req, res) {
    try {
        const admin = await Admin.findOne({
            PhoneNumber: req.auth.PhoneNumber
        })
        if (!admin) {
            return res.status(400).json({
                message: "Admin not found"
            })
        }
        const user = await User.findByIdAndUpdate(req.query.user_id, {
            Disable: true
        })

        return res.status(200).json({
            message: "user disabled successfully",
            User: user
        })
    } catch (error) {
        return res.status(500).send({
            message: error
        })
    }
}
module.exports = {
    generateVoucherCode,
    disableVoucher,
    disableUser
}
