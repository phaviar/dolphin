const auth = require("./auth.js");
const app = require("./app.js");
const validate = require("./validation.js");

function connection (socket) {
    socket.on("message_create", async data => {
        let { content, token } = data;
        if (!content || !token) return;

        content = validate.cleanContent(content);
        if (!validate.content(content)) return;
        if (!validate.token(token)) return;

        const tokenData = auth.destructToken(token);
        const user = await app.database.getUser(tokenData.id);
        if (!user) return;
        if (user.token != token) return;

        const id = app.snowflake.nextId();
        const timestamp = Date.now();
        const author = user.id;
        app.io.sockets.emit("message_create", {
            id,
            content,
            author,
            timestamp
        });
    });
}

module.exports = connection;
