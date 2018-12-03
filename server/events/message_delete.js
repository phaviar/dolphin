module.exports = app => {
    return async (data, socket) => {
        let { id, token } = data;
        if (!id || !token) return;

        if (!app.validate.id(id)) return;
        if (!app.validate.token(token)) return;

        const tokenData = app.auth.destructToken(token);
        const user = await app.database.getUser(tokenData.id);
        if (!user) return;
        if (user.token != token) return;
        const messageData = await app.database.getMessage(id);
        if (messageData.author !== tokenData.id) return;
        app.database.deleteMessage(id);
        socket.broadcast.emit('message_delete', {
            id
        });
        socket.emit('message_delete', {
            id
        });
    };
};