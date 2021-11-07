const mongoose = require("mongoose");

var otpTransSchema = new mongoose.Schema({
    Sender_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    Sender_Num: {
        type: String,
        required: true
    },
    Reciever_Num: {
        type: String,
        required: true
    },
    Amount: {
        type: Number,
        default: 0
    },
    OTP: {
        type: String,
        default: ""
    },
    Status: {
        type: String
    },
    CreatedOnUTC: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("OTPTransaction", otpTransSchema);
