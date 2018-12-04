const Snowflake = require("./snowflake.js");
const RateLimiter = require("./ratelimiter.js");
const Database = require("./database");
const Validation = require("./validation.js");
const Auth = require("./auth.js");
const SocketManager = require("./socketmanager.js");

module.exports = app => {
    app.snowflake = new Snowflake();
    app.limiter = new RateLimiter(3, 5);
    app.database = new Database();
    app.manager = new SocketManager();
    app.validate = Validation;
    app.auth = Auth;
};