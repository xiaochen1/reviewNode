const express = require("express");
const cookieParser = require("cookie-parser");

let app = express();
app.use(cookieParser());


app.get("/", function(req, res, next) {
    res.cookie("name", "xiao");
    res.cookie("age", 24);
    res.send("已设置cookie");
});


app.get("/getcookie", function(req, res, next) {
    let name = req.cookies.name;
    let age = req.cookies.age;
    res.send("name---->" + name + "age---->" + age);
});

app.listen(8888);
console.log("listening on 8888");