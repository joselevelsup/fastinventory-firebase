var express = require("express"),
    bodyParser = require("body-parser"),
    functions = require("firebase-functions");
    admin = require("firebase-admin");

var server = express();
admin.initializeApp(functions.config().firebase);


server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: true
}))

var itemRoutes = require("./itemApi");
var roomRoutes = require("./roomApi");

server.get("/", (req, res) => {
    res.send("Hello firebase app");
});

server.use("/items", itemRoutes);

server.use("/room", roomRoutes);

var app = functions.https.onRequest(server);

exports.app = app;