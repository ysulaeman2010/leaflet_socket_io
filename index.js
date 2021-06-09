const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const serveStatic = require("serve-static");
const path = require("path");
const app = express();

const server = require("http").createServer(app);
const io = require("socket.io")(server);

const randomLocation = require("random-location");
const geolib = require("geolib");

app.use(
  "/public",
  serveStatic(path.resolve(__dirname, "public"), { index: ["index.html"] })
);

app.use(helmet());
app.use(cors());

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});

io.on("connection", (socket) => {
  console.log(`A new client connected with id ${socket.id}`);
  sendData(socket);
});

const centrePoint = {
  latitude: -6.9108191,
  longitude: 107.7583738,
};

const sendData = (socket) => {
  const loc_rf1 = randomLocation.randomCirclePoint(centrePoint, 1500);
  const loc_rf2 = randomLocation.randomCirclePoint(centrePoint, 1500);

  const target1 = randomLocation.randomCirclePoint(centrePoint, 500);
  const target2 = randomLocation.randomCirclePoint(centrePoint, 500);

  const dist_rf1 = geolib.getDistance(loc_rf1, target1);
  const dist_rf2 = geolib.getDistance(loc_rf2, target2);

  const compass_rf1 = geolib.getGreatCircleBearing(loc_rf1, target1);
  const compass_rf2 = geolib.getGreatCircleBearing(loc_rf2, target2);

  const data = {
    lat_rf1: loc_rf1["latitude"],
    lng_rf1: loc_rf1["longitude"],
    dist_rf1: dist_rf1,
    compass_rf1: compass_rf1,
    lat_rf2: loc_rf2["latitude"],
    lng_rf2: loc_rf2["longitude"],
    dist_rf2: dist_rf2,
    compass_rf2: compass_rf2,
  };

  socket.emit("data", data);

  setTimeout(() => {
    sendData(socket);
  }, 5000);
};
