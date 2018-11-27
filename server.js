const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);

const port = 80;

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

app.post("/auth", (req, res) => {

})

app.get("/app")

io.of("/app")
  .on("connection"
    socket => {

    })

server.listen(port, () => console.log(`Listening on ${port}`));
