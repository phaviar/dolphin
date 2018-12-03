const port = process.env.PORT || 80;

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socket = require("socket.io");

const app = express();
const server = http.Server(app);
app.io = socket(server);

// Place public in static space
app.use(express.static("public"));
app.use(bodyParser.json());

require("./api/api.js")(app);
require("./app/views.js")(app);
require("./app/extensions.js")(app);
require("./events/events.js")(app);

// Start the server
server.listen(port, () =>
    console.log(`Listening on ${port}`)
);