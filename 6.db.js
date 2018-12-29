const express = require("express");

const DB = require("./model/db.js");
const formidable = require("formidable");

let app = express();
app.set("view engine", "ejs");


app.use(express.static("./static"));
app.use(express.static("./upload"));


app.get("/", (req, res) => {
    res.send("跟路由");
});
app.get("/dbjson", (req, res) => {
    let page_index = parseInt(req.query.page_index);
    let page_size = parseInt(req.query.page_size);
    let condition = {};
    condition.score = { $lt: parseInt(req.query.score) };
    console.log(page_index, page_size);
    console.log(condition);

    DB.getDocumentsByColName("reviewNode", "user", condition, { page_index: page_index, page_size: page_size }, (err, data) => {
        if (err) {
            console.log("连接失败");
            res.send("连接失败啦");
        }
        console.log(JSON.stringify(data, null, 4));
        res.send(JSON.stringify(data, null, 4));
    });
});

app.get("/register", (req, res) => {
    res.render("register");
});


app.post("/doregister", (req, res) => {

    let form = new formidable.IncomingForm();
    form.uploadDir = "/upload";

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.send("注册失败");
            return;
        }
        let regisInfo = {};
        regisInfo.username = fields.username;
        regisInfo.password = fields.password;
        regisInfo.age = fields.age;
        DB.addUser(regisInfo, (err, result) => {
            if (err) {
                res.send("添加用户失败");
                return;
            }
            res.send(JSON.stringify(result));
        });
    });

});




app.listen(8888);
console.log("listening on 8888");