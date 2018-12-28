const express = require("express");
const md5 = require("md5");



let app = express();
app.get("/", (req, res) => {
    let str = md5("hello world");
    console.log(str);
    res.send(str);
});

app.listen(8888);
console.log("listening on 8888");