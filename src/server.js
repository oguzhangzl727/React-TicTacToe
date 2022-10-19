var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http, { cors: { origin: "*" } });
var port = 3001;


io.on("connection", function (socket) {
  console.log("connection oldu");
  
  socket.on("send_data", (data) => {
    socket.broadcast.emit("send_data", {
      position: data.position,
    });
  });

  socket.on("restartRequest", (data) => {
    socket.broadcast.emit("gameRestart", { twoPlayerGame: data.twoPlayerGame });
    socket.emit("gameRestart", { twoPlayerGame: data.twoPlayerGame });
  });
});

http.listen(port, function () {
  console.log(`server çalışıyor Port: http://localhost:${port}`);
});
