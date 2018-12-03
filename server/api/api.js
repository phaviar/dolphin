const auth = require("./auth.js");
const fetch_messages = require("./fetch_messages");
const fetch_user = require("./fetch_user");
const new_user = require("./new_user.js");

module.exports = app => {
    app.post("/auth", auth);
    app.post("/fetch_messages", fetch_messages);
    app.post("/fetch_user", fetch_user);
    app.post("/new_user", new_user);

    return app;
};