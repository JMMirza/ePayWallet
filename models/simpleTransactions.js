const mongoose = require("mongoose");

var simpleTransSchema = new mongoose.Schema({
    Sender_id: {
        type: mongoose.Schema.Types.ObjectId,
    },
    Reciever_id: {
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
    CreatedOnUTC: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("SimpleTransaction", simpleTransSchema);
