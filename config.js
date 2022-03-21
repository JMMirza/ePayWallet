var config = {
    server_port: 20000,
    mongo_uri: "mongodb://localhost/epaywallet",
    secret: "0xc106ece52802f2cd3fba36defbcc9d708bcad751efe6246d21e32ed16844bc6b",
    twillio: {
        from: "+15155237395",
        accountSid: "AC82d4c87485329af09d179278380dd446",
        authToken: "47cf92ea1e595f5e9a3522fd2d470116",
    },
    keySecret: "Bearer sk_test_149d40dc0cd533b0be63607b1e7ff1fca9d76f70",
    keySecretLive: "Bearer sk_live_8cd1ea8df16a0fe023397cc5cca2e22c8dd4affd",
    GEOCODER_PROVIDER: "mapquest",
    GEOCODER_API_KEY: "AW7vm3SPdJE1TBYDtC5WsrkhNhz14zQV"
};
module.exports = config;
