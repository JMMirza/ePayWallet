var mongoose = require('mongoose');
var NumberVerificationSchema = new mongoose.Schema({
    PassCode: { 
        type: String 
    },
    PhoneNumber: { 
        type: String,
        unique: true 
    },
    IsVerified: {
      type: Boolean,
      default: false  
    },
    CreatedOnUTC: { 
        type: Date, 
        default: Date.now, 
        expires: 120 
    }
});
module.exports = mongoose.model('NumberVerification', NumberVerificationSchema);