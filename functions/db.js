var admin = require("firebase-admin");

exports.itemsDb =  admin.firestore().collection("items");
exports.roomDb = admin.firestore().collection("room");

