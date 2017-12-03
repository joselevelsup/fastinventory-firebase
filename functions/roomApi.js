var express = require("express");
var roomRouter = express.Router();

var roomDb = require("./db").roomDb;

roomRouter.get("/", (req, res) => {
    roomDb.get().then((result) => {
        var resArr = [];
        result.forEach((doc) => {
            resArr.push(doc.data());
        });
        res.json({
            "success": true,
            "result": resArr
        });
    }).catch((err) => {
        console.log(err);
        res.json({
            "success": false,
            "error": err
        });
    })
})

roomRouter.get("/:roomId", (req, res) => {
    roomDb.doc(req.params.roomId).get().then((result) => {
        res.json({
            "success": true,
            "result": result.data()
        });
    }).catch((err) => {
        res.json({
            "success": false,
            "error": err
        })
    })
})


roomRouter.post("/", (req, res) => {
    var roomName = req.body.roomName,
        roomLocation = req.body.roomLocation;
    roomDb.add({
        name: roomName,
        location: roomLocation,
        items: null
    }).then((result) => {
        res.json({
            "success": true,
            "result": result.id
        });
    }).catch((err) => {
        res.json({
            "success": false,
            "error": err
        });
    })
});


module.exports = roomRouter;