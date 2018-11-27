const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const Snowflake = require("./snowflake.js");

const port = 80;

// Routes
const loginRoute = require("../routes/login.js");
const chatRoute = require("../routes/chat.js");

app.snowflake = new Snowflake();

// Place public in static space
app.use(express.static("public"));
app.use(bodyParser.json());

// Setup api endpoints
app.get("/login", loginRoute.get);
app.post("/login", loginRoute.post);
app.get("/chat", chatRoute.get);

// Create socket connection only for /chat endpoint
io.of("/chat")
    .on("connection",
        socket => {

        });

// Start the server
server.listen(port, () =>
    console.log(`Listening on ${port}`)
);