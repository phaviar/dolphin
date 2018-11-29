const express = require("express");
const bodyParser = require("body-parser");

const app = express();


const server = require("http").Server(app);
const io = require("socket.io")(server);
app.io = io;
module.exports = app;
const Snowflake = require("./snowflake.js");
const RateLimiter = require("./ratelimiter.js");
const Database = require("./database");
const socketHandler = require("./socket.js");
const port = 80;

// API
const apiAuth = require("../api/auth.js");
const apiNewUser = require("../api/new_user.js");
const apiFetchUser = require("../api/fetch_user.js");
const apiDecToken = require("../api/decontruct_token.js");

app.snowflake = new Snowflake();
app.limiter = new RateLimiter(3, 5);
app.database = new Database();
// Place public in static space
app.use(express.static("public"));
app.use(bodyParser.json());

// Setup html serving
app.get("/signup", (req, res) => {
    res.sendFile(process.cwd() + "/views/signup.html");
});
app.get("/login", (req, res) => {
    res.sendFile(process.cwd() + "/views/login.html");
});
app.get("/chat", (req, res) => {
    res.sendFile(process.cwd() + "/views/chat.html");
});
app.get("*", (req, res) => {
    res.sendFile(process.cwd() + "/views/404.html");
});
// Setup api endpoints
app.post("/api/new_user", apiNewUser);
app.post("/api/auth", apiAuth);
app.post("/api/fetchuser", apiFetchUser);
app.post("/api/dectoken", apiDecToken);

// Create socket connection only for /chat endpoint
io.of("/chat").on("connection", socketHandler);

// Start the server
server.listen(port, () =>
    console.log(`Listening on ${port}`)
);
