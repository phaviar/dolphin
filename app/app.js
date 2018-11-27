const express = require("express")
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 80;

// Routes
const loginRoute = require("../routes/login.js");
const appRoute = require("../routes/app.js");

// Place public in static space
app.use(express.static("public"));

// Setup api endpoints
app.get('/login', loginRoute.get);
app.post("/login", loginRoute.post);
app.get("/app", appRoute.get);

// Create socket connection only for /app endpoint
io.of("/app")
  .on("connection",
    socket => {

    });

// Start the server
server.listen(port, () =>
  console.log(`Listening on ${port}`)
);