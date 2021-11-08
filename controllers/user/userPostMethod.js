const User = require('../../models/User')
const NumberVerification = require('../../models/numVerification')
const Voucher = require('../../models/Voucher')
const PartnerLocation = require('../../models/PartnerLocation');
const Reward = require('../../models/Reward')
const bcrypt = require('bcrypt')
const Config = require('../../config')
const Coupon = require("../../utils/createCoupon");
var mongoose = require('mongoose');
const simpleTransactions = require('../../models/simpleTransactions')
const otpTransactions = require('../../models/transactionOTP')
const client = require('twilio')(Config.twillio.accountSid, Config.twillio.authToken)
const couponGenerator = new Coupon();
async function signUp(req, res) {
    try {
        let referralCode = "";
        const reward = await Reward.find()
        if (req.query.referral_id || req.query.referral_id != undefined) {
            referralCode = couponGenerator.getCouponFromReferralLink(req.query.referral_id);
            const referralUser = await User.findOne({
                Coupon: referralCode
            })
            if (!referralUser) {
                return res.status(400).send({
                    message: "Invalid referral code"
                })
            }
            referralUser.WalletBalance = Number(referralUser.WalletBalance) + Number(reward.ReferalReward)
            await referralUser.save()
            console.log("done")
        }
        console.log(req.query.referral_id)
        const user = await User.findOne({
            PhoneNumber: req.body.phoneNum
        })
        if (user) {
            return res.status(400).json({
                message: "User already registered"
            });
        }
        // console.log("signup",req.body)
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)

        const num = await NumberVerification.findOne({
            PhoneNumber: req.body.phoneNum
        })

        if (!num) return res.status(400).json({
            message: "Phone number is not registered"
        });
        if (num.IsVerified == false) {
            return res.status(400).json({
                message: "Phone number is not verified"
            });
        }
        const coupon = await couponGenerator.generateCoupon()
        console.log(coupon, reward)
        await User.create({
            Email: req.body.email,
            Name: req.body.name,
            SurName: req.body.surName,
            PhoneNumber: req.body.phoneNum,
            Password: req.body.password,
            Coupon: coupon,
            WalletBalance: Number(reward.RewardNewUser),
            Referal_Link: `http://localhost:20000/api/user/signup?referral_id=${coupon}`,
            Supplied_Referal_Code: referralCode
        })
        return res.status(201).json({
            message: "User created successfully"
        });
    } catch (err) {
        return res.status(500).send({
            message: err
        })
    }
}
async function signin(req, res) {
    try {
        const user = await User.findOne({
            PhoneNumber: req.body.phoneNum
        })
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        if (user.Disable == true) {
            return res.status(400).json({
                message: "Your account has been blocked, Kindly contact the support team for further details"
            })
        }
        const validPass = await bcrypt.compare(req.body.password, user.Password)
        if (!validPass) return res.status(400).json({
            message: 'Incorrect Password!'
        })
        console.log("hello")
        const token = user.generateAuthToken()
        console.log(token)
        return res.status(200).json({
            message: "Welcome",
            token: token
        })
    } catch (error) {
        res.status(500).send({
            message: error
        })
    }
}
async function sendMoney(req, res) {
    if (req.auth.PhoneNumber == req.body.phoneNum) {
        res.status(400).json({
            message: "This is not allowed"
        })
    }
    const reciever = await User.findOne({
        PhoneNumber: req.body.phoneNum
    })
    const sender = await User.findOne({
        PhoneNumber: req.auth.PhoneNumber
    })
    if (sender.Disable == true) {
        return res.status(400).json({
            message: "Your account has been blocked, Kindly contact the support team for further details"
        })
    }
    if (!reciever) {
        try {
            let val = Math.floor(1000 + Math.random() * 9000);
            let ID = mongoose.Types.ObjectId();
            console.log(val, req.body.phoneNum, req.body.amount)
            await client.messages.create({
                body: `Hello you have recieved an amount of ${req.body.amount} against the Transaction Id of ${ID}. Kindly use this OTP ${val} and get your amount.`,
                to: `+${req.body.phoneNum}`,
                from: Config.twillio.from
            })
            const salt = await bcrypt.genSalt(10)
            val = await bcrypt.hash(val.toString(), salt)
            await otpTransactions.create({
                _id: ID,
                Sender_id: req.auth._id,
                OTP: val,
                Reciever_Num: req.body.phoneNum,
                Sender_Num: req.auth.PhoneNumber,
                Amount: req.body.amount,
                Status: "Open"
            })
            sender.Hold_Balance = 0
            await sender.save()
            res.status(200).json({
                message: "Code send to the number kindly use the otp to get your money"
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }

    } else {
        try {
            await simpleTransactions.create({
                Sender_id: req.auth._id,
                Reciever_id: reciever._id,
                OTP: "",
                Reciever_Num: req.body.phoneNum,
                Sender_Num: req.auth.PhoneNumber,
                Amount: req.body.amount,
            })
            sender.Hold_Balance = 0
            reciever.WalletBalance = reciever.WalletBalance + Number(req.body.amount)
            await sender.save()
            await reciever.save()
            res.status(200).json({
                message: "transfered amount successfully"
            })
        } catch (error) {
            res.status(500).json({
                message: error.message
            })
        }
    }


}

async function recieveAmountOTP(req, res) {
    const user = await User.findOne({
        PhoneNumber: req.auth.PhoneNumber
    })
    if (!user) {
        return res.status(400).send({
            message: "User not found"
        })
    }
    if (user.Disable == true) {
        return res.status(400).json({
            message: "Your account has been blocked, Kindly contact the support team for further details"
        })
    }
    const otpTrans = await otpTransactions.findById(req.body.transactionID)
    if (!otpTrans) {
        return res.status(400).send({
            message: "no transaction found"
        })
    }
    if (otpTrans.Status == "Complete") {
        return res.status(400).json({
            message: "Transaction status is completed"
        })
    }
    const validOTP = await bcrypt.compare(req.body.OTP, otpTrans.OTP)
    if (!validOTP) {
        return res.status(400).send({
            message: "invalid OTP"
        })
    }
    user.WalletBalance = user.WalletBalance + Number(otpTrans.Amount)
    await user.save()
    otpTrans.Status = "Complete"
    await otpTrans.save()
    return res.status(200).send({
        message: "Transaction complete"
    })
}


// @desc  Get all stores
// @route GET /api/v1/stores
// @access Public
async function getStores(req, res) {
    try {
        const stores = await PartnerLocation.find();

        return res.status(200).json({
            success: true,
            count: stores.length,
            data: stores
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Server error'
        });
    }
};
async function voucherSystem(req, res) {
    try{
        const user = await User.findById(req.auth._id)
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            })
        }
        const voucher = await Voucher.findOne({
            VoucherCode: req.body.VoucherCode
        })
        if (!voucher) {
            return res.status(400).json({
                message: "No such voucher found"
            })
        }
        if (voucher.Disable == true) {
            return res.status(400).json({
                message: "voucher is disabled"
            })
        }
        user.WalletBalance = Number(user.WalletBalance) + Number(voucher.Reward)
        await user.save()
        return res.status(200).json({
            message: `Congratulations! you have got Voucher of ${voucher.Reward}`
        })
    }catch(error){
        return res.status(500).json({
            error: `Server error ${error.message}`
        });
    }
    
}
module.exports = {
    signUp,
    signin,
    sendMoney,
    recieveAmountOTP,
    getStores,
    voucherSystem
}
