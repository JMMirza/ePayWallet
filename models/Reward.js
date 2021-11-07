const mongoose = require("mongoose");

var RewardSchema = new mongoose.Schema({
  RewardNewUser: {
    type: Number,
    default: 0
  },
  ReferalReward: {
    type: Number,
    default: 0
  },
  CreatedOnUTC: {
    type: Date,
    default: Date.now
  }
});
module.exports = mongoose.model("Reward", RewardSchema);
