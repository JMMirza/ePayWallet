const User = require('../models/User')

function checkBalance(req, res, next) {
    var filter = {
        PhoneNumber: req.auth.PhoneNumber,
        WalletBalance: {
            $gte: parseFloat(req.body.amount),
        },
    };
    var update = {
        $inc: {
            WalletBalance: -parseFloat(req.body.amount).toFixed(8),
            Hold_Balance: parseFloat(req.body.amount).toFixed(8),
        },
    };
    User.findOneAndUpdate(filter, update)
        .then((updateResult) => {
            if (updateResult) {
                next();
            } else {
                //console.log("not enough balance");
                return res.status(400).json({
                    message: "Not enough balance",
                });
            }
        })
        .catch((updateError) => {
            console.log(updateError);
            return res.status(500).json({
                message: updateError,
            });
        });
}

module.exports = {
    checkBalance
}
