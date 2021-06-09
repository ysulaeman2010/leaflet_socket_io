import { tankPos } from "./utils.js";

const PORT = 3001;
const socket = io(`http://localhost:${PORT}`);

/* Leaflet */
const zoom_level = 14;
const map = L.map("mapid").setView([-6.91081915, 107.7583738], zoom_level);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

const viewerIcon = L.icon({
  iconUrl: "./assets/soldier.png",
  iconSize: [45, 45],
  iconAnchor: [25, 16],
});

const tankIcon = L.icon({
  iconUrl: "./assets/tank.png",
  iconSize: [50, 50],
  iconAnchor: [25, 16],
});

const markerRf1 = L.marker([0, 0], { icon: viewerIcon }).addTo(map);
const markerRf2 = L.marker([0, 0], { icon: viewerIcon }).addTo(map);
const markerTank1 = L.marker([0, 0], { icon: tankIcon }).addTo(map);
const markerTank2 = L.marker([0, 0], { icon: tankIcon }).addTo(map);

/* End of Leaflet */

socket.on("connection");

socket.on("data", (res) => {
  console.log(res);

  document.querySelector(".latitude_1").innerHTML =
    "<strong>Latitude:</strong> " + res.lat_rf1;
  document.querySelector(".longitude_1").innerHTML =
    "<strong>Longitude:</strong> " + res.lng_rf1;

  document.querySelector(".latitude_2").innerHTML =
    "<strong>Latitude:</strong> " + res.lat_rf2;
  document.querySelector(".longitude_2").innerHTML =
    "<strong>Longitude:</strong> " + res.lng_rf2;

  markerRf1.setLatLng([res.lat_rf1, res.lng_rf1]);
  markerRf2.setLatLng([res.lat_rf2, res.lng_rf2]);

  markerTank1.setLatLng([
    tankPos(res.lat_rf1, res.lng_rf1, res.dist_rf1, res.compass_rf1).f_lat,
    tankPos(res.lat_rf1, res.lng_rf1, res.dist_rf1, res.compass_rf1).f_lng,
  ]);

  markerTank2.setLatLng([
    tankPos(res.lat_rf2, res.lng_rf2, res.dist_rf2, res.compass_rf2).f_lat,
    tankPos(res.lat_rf2, res.lng_rf2, res.dist_rf2, res.compass_rf2).f_lng,
  ]);

  map.setView([res.lat_rf1, res.lng_rf1], zoom_level);
});
