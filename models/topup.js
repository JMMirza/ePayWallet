const mongoose = require("mongoose");

const topupSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    Reference: {
        type: String,
        default: ""
    },
    Status: {
        type: String,
        default: ""
    },
    PhoneNum: {
        type: String
    },
    CreatedOnUTC: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Topup', topupSchema);
