const couponCode = require('coupon-code');
const userQueries = require('../models/User');
class Coupon {
    constructor() {}
    findCoupon(code) {
        try {
            return new Promise((resolve, reject) => {
                userQueries.findOne({
                        Coupon: code
                    })
                    .then(userModel => {
                        if (userModel) {
                            resolve(userModel);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    })
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    }
    generateCoupon() {
        try {
            console.log("hello")
            return new Promise((resolve, reject) => {
                var code = couponCode.generate();
                userQueries.findOne({
                        Coupon: code
                    }).then(couponExist => {
                        if (couponExist) {
                            this.generateCoupon();
                        } else {
                            resolve(code);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            });
        } catch (err) {
            console.log(err);
            reject(err);
        }
    }
    validateCoupon(coupon) {
        try {
            return new Promise((resolve, reject) => {
                if (coupon == undefined) {
                    resolve(null);
                } else {
                    console.log("Coupon For Validation", coupon);
                    let partOptions = {};
                    if (coupon.length <= 5) {
                        console.log("Coupon Parts 1");
                        partOptions = {
                            parts: 1
                        };
                    } else if (coupon.length > 5 && coupon.length <= 9) {
                        console.log("Coupon Parts 2");
                        partOptions = {
                            parts: 2
                        };
                    }
                    var couponResult = couponCode.validate(coupon, partOptions);
                    console.log("validate coupon validate func", couponResult);
                    if (couponResult) {
                        this.findCoupon(coupon).then(user => {
                                if (user) {
                                    resolve(user);
                                } else {
                                    resolve(null);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                reject(err);
                            })
                    } else {
                        resolve(null);
                    }
                }
            })
        } catch (err) {
            console.log(err);
            reject(err);
        }
    }
    getCouponFromReferralLink(referralLink) {
        var referralCode;
        var referralLinkArray;
        if (referralLink) {
            referralLinkArray = referralLink.split("=");
            if (referralLinkArray.length > 0) {
                referralCode = referralLinkArray[referralLinkArray.length - 1];
                console.log(referralCode)
            }
        }
        return referralCode;
    }
}
module.exports = Coupon;
