const mongoose = require("mongoose");

var VoucherSchema = new mongoose.Schema({
    VoucherCode: {
        type: String,
        default: ""
    },
    Reward: {
        type: Number,
        default: 0
    },
    Disable: {
        type: Boolean,
        default: false
    },
    CreatedOnUTC: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model("Voucher", VoucherSchema);
