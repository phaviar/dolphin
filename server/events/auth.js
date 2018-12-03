module.exports = app => {
    return async (socket, next) => {
        const token = socket.handshake.headers.token;
        if (token && await app.database.authenticateToken(token)) {
            return next();
        }
        return next(new Error("Authentication"));
    };
};
