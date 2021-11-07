const mongoose = require('mongoose');
const config = require('../config');

function getConnection() {
    const dbUri = config.mongo_uri;
    //mongoose.connect(dbUri, {useNewUrlParser: true});
    mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});
    
    // CONNECTION EVENTS When successfully connected
    mongoose
        .connection
        .on('connected', function () {
            console.log('Mongoose default connection open to ' + dbUri);
        });
 
    // If the connection throws an error
    mongoose
        .connection
        .on('error', function (err) {
            console.log('Mongoose default connection error: ' + err);
        });
    // When the connection is disconnected
    mongoose
        .connection
        .on('disconnected', function () {
            console.log('Mongoose default connection disconnected');
        });

}
module.exports = {
    getConnection
};