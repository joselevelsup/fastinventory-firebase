var express = require("express");
var itemRouter = express.Router();
var db = require("./db");
var roomsDb = db.roomDb;
var itemsDb = db.itemsDb;

itemRouter.post("/", (req, res) => {
    var itemType = req.body.itemType,
        os = req.body.osVersion,
        stockDate = req.body.stockDate,
        roomId = req.body.roomId;
        
    itemsDb.add({
        itemType: itemType,
        osVersion: os,
        stockDate: stockDate,
        roomId: roomId,
        scannedTime: null,
        scannedDate: null
    }).then((result) => {
        itemsDb.where("roomId", "==", roomId).get().then((resp) => {
            var itemArr = [];
            resp.forEach((doc) => {
                itemArr.push(doc.id);
            });
            roomsDb.doc(roomId).update({
                items: itemArr
            }).then((response) => {
                res.json({
                    "success": true,
                    "result": result.id
                });
            })
        })
    }).catch((err) => {
        res.json({
            "success": false,
            "error": err
        });
    });
});


itemRouter.get("/", (req, res) => {
    itemsDb.get().then((result) => {
        var resArr = [];
        result.forEach((doc) => {
            resArr.push(doc.data());
        });
        res.json({
            "success": true,
            "result": resArr
        });
    }).catch((err) => {
        res.json({
            "success": false,
            "error": err
        });
    });
});

itemRouter.get("/:itemId", (req, res) => {
    itemsDb.doc(req.params.itemId).get().then((result) => {
        res.json({
            "success": true,
            "result": result.data()
        });
    }).catch((err) => {
        res.json({
            "success": false,
            "error": err
        });
    });
});

itemRouter.put("/:itemId", (req, res) => {
    itemsDb.doc(req.params.itemId).update({
        itemType: req.body.itemType,
        osVersion: req.body.osVersion,
        companyId: req.body.companyId,
        quantity: req.body.quantity,
        stockDate: req.body.stockDate
    }).then((result) => {
        res.json({
            "success": true,
            "result": result
        });
    }).catch((err) => {
        res.json({
            "success": false,
            "result": err
        });
    });
});

itemRouter.delete("/:itemId", (req, res) => {
    itemsDb.doc(req.params.itemId).delete().then((result) => {
        res.json({
            "success": true,
            "result": result 
        });
    }).catch((err) => {
        res.json({
            "success": false,
            "error": err
        });
    });
});

itemRouter.get("/updateTime/:itemId", (req, res) => {

    addZeroToTime = (i) => {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    
    currentTime = () => {
        var d = new Date();
        var h = addZeroToTime(d.getHours() % 12);
        var m = addZeroToTime(d.getMinutes());
        var date = d.toLocaleDateString();
        var mid = (d.getHours() < 12) ? "AM" : "PM";
        return {
            hour: h,
            minute: m,
            mid: mid,
            date: date
        };
    }

    itemsDb.doc(req.params.itemId).set({
        scannedDate: currentTime().date,
        scannedTime: currentTime().hour+":"+currentTime().minute+" "+currentTime().mid
    }).then((result) => {
        res.json({
            "success": true,
            "result": result
        });    
    }).catch((err) => {
        res.json({

        })
    })
})


module.exports = itemRouter;