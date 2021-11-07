const express = require("express");
const app = express();
const connection = require("./utils/connection");
const users = require("./router/userRouter");
const partner = require("./router/partnerRouter");
const admin = require("./router/adminRouter")
const bodyParser = require("body-parser");
const Config = require("./config")
console.log("Project started");
connection.getConnection();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

app.use("/api/user/", users);
app.use("/api/user/", partner);
app.use("/api/admin/", admin);
// app.use("/api/admin/", admin);


module.exports = app.listen(Config.server_port, () =>
    console.log(`Project Started at port ${Config.server_port} environment  !!!`)
);
