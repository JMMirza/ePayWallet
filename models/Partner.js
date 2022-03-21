const mongoose = require("mongoose");
const config = require('../config')
const jwt = require('jsonwebtoken')
var PartnerSchema = new mongoose.Schema({
  Email: {
    type: String,
    default: "",
  },
  Name: {
    type: String,
    default: "",
    require: true
  },
  SurName: {
    type: String,
    default: ""
  },
  PhoneNumber: {
    type: String,
    default: ""
  },
  Password: {
    type: String,
    default: ""
  },
  WalletBalance: {
    type: Number,
    default: 0
  },
  Topup: {
    type: Number,
    default: 0
  },
  Hold_Balance: {
    type: Number,
    default: 0
  },
  Coupon: {
    type: String,
    required: true
  },
  Disable: {
    type: Boolean,
    default: false
  },
  Referal_Link: {
    type: String,
    default: ""
  },
  Supplied_Referal_Code: {
    type: String,
    default: ""
  },
  CreatedOnUTC: {
    type: Date,
    default: Date.now
  }
});
PartnerSchema.methods.generateAuthToken = function () {
  console.log("auth token")
  const token = jwt.sign({
    _id: this._id,
    PhoneNumber: this.PhoneNumber
  }, config.secret, {
    expiresIn: "60m"
  })
  return token
}


module.exports = mongoose.model("Partner", PartnerSchema);
