const request = require("request")
const _ = require("lodash")
const paystack = require("../../utils/payStack")(request)
const User = require("../../models/User")
const Topup = require("../../models/topup")

async function initializePayment(req, res) {
    try {
        let userId = req.auth._id
        let userPhoneNum = req.auth.PhoneNumber
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        let response = {}
        const form = _.pick(req.body, ['amount', 'email', 'name']);
        form.metadata = {
            name: form.name
        }

        console.log(form)
        paystack.initializePayment(form, async (error, body) => {
            if (error) {
                //handle errors
                console.log(error);
                return res.status(400).json({
                    message: error.message
                })
            }
            response = JSON.parse(body);
            console.log(response.data)
            user.Topup += Number(form.amount)
            await user.save()
            return res.status(200).json({
                message: "Successfull",
                reference: response.data.reference,
                url: response.data.authorization_url
            })
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

}

async function verifyPayment(req, res) {
    try {
        let userId = req.auth._id
        let userPhoneNum = req.auth.PhoneNumber
        const user = await User.findById(userId)
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        let response = {}
        const ref = req.query.reference;
        paystack.verifyPayment(ref, async (error, body) => {
            if (error) {
                //handle errors appropriately
                console.log(error)
                return res.status(400).json({
                    message: error.message
                })
            }
            response = JSON.parse(body);
            // const data = _.at(response.data, ['reference', 'amount', 'customer.email', 'metadata.name']);
            // console.log(data)
            const dbTopup = await Topup.findOne({
                Reference:response.data.reference
            })
            if(dbTopup){
                return res.status(400).json({
                    message: "Already exist in database"
                })
            }
            await Topup.create({
                full_name: response.data.metadata.name,
                email: response.data.customer.email,
                amount: response.data.amount,
                Reference: response.data.reference,
                Status: response.data.status,
                PhoneNum: userPhoneNum
            })
            if (response.data.status == "success") {
                console.log("hello")
                user.WalletBalance = user.WalletBalance + user.Topup
                user.Topup = 0
                await user.save()
            }
            return res.status(200).json({
                message: "Successfull",
                response: response
            })
        })


    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}
module.exports = {
    initializePayment,
    verifyPayment
}
