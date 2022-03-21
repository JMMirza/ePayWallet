const mongoose = require("mongoose");
const config = require('../config')
const jwt = require('jsonwebtoken')
var AdminSchema = new mongoose.Schema({
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
  CreatedOnUTC: {
    type: Date,
    default: Date.now
  }
});
AdminSchema.methods.generateAuthToken = function () {
  console.log("auth token")
  const token = jwt.sign({
    _id: this._id,
    PhoneNumber: this.PhoneNumber
  }, config.secret, {
    expiresIn: "60m"
  })
  return token
}
module.exports = mongoose.model("Admin", AdminSchema);
