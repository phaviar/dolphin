module.exports = app => {
    return async (data, socket) => {
        let { content, token } = data;
        if (!content || !token) return;

        content = app.validate.cleanContent(content);
        if (!app.validate.content(content)) return;
        if (!app.validate.token(token)) return;

        const tokenData = app.auth.destructToken(token);
        const user = await app.database.getUser(tokenData.id);
        if (!user) return;
        if (user.token != token) return;

        const id = app.snowflake.nextId();
        const timestamp = Date.now();
        const author = user.id;
        app.database.newMessage({ id, content, author, timestamp });
        socket.broadcast.emit('message_create', {
            id,
            content,
            author,
            timestamp
        });
        socket.emit('message_create', {
            id,
            content,
            author,
            timestamp
        });
    };
};