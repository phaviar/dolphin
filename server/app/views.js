module.exports = app => {
    app.get("/signup", view("signup.html"));
    app.get("/login", view("login.html"));
    app.get("/chat", view("chat.html"));
    app.get("*", view("error.html"));

    return app;
};  

function view(file) {
    return (req, res) => res.sendFile(process.cwd() + "../../client/views/" + file);
}