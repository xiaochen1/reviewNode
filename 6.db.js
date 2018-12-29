const express = require("express");


const DB = require("./model/db.js");

let app = express();

app.get("/", (req, res) => {
    res.send("跟路由");
});

app.get("/dbjson", (req, res) => {
    // DB.connect("reviewNode", (err, db) => {
    //     if (err) {
    //         console.log("连接数据库失败");
    //         console.log(err);
    //         return;
    //     }

    //     console.log(db.collection("user").find());
    // });

    DB.getDocumentsByColName("reviewNode", "user", { score: { $lt: 60 } }, (err, data) => {
        if (err) {
            console.log("连接失败");
            res.send("连接失败啦");
        }
        res.send(JSON.stringify(data));
    });
});

app.listen(8888);
console.log("listening on 8888");