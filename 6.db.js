const express = require("express");
const session = require("express-session");

const DB = require("./model/db.js");
const formidable = require("formidable");

let app = express();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.set("view engine", "ejs");


app.use(express.static("./static"));
app.use(express.static("./upload"));

app.use((req, res, next) => {
    if (req.session) {
        if (req.session.login == 1) {
            next();
        }
    }
    next();
});
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

app.get("/login", (req, res) => {
    res.render("login");
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

app.post("/dologin", (req, res) => {
    let form = new formidable.IncomingForm();
    if (req.session) {
        console.log(req.session);
        console.log("session---->>>>>>>>>>" + req.session.userid);
    }

    form.parse(req, (err, fields, files) => {
        if (err) {
            res.send("登录失败");
            return;
        }
        let loginInfo = {};
        loginInfo.username = fields.username;
        loginInfo.password = fields.password;

        DB.checkLogin(loginInfo, (err, result) => {
            if (err) {
                res.send(result);
                return;
            }
            console.log("开始返回数据");
            console.log(result);
            req.session.userid = result.data._id || "";
            req.session.login = 1;
            res.send(result);
        });
    });
});


app.post("/zone/add", (req, res) => {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        if (err) {
            return;

        }

        let username = fields.username;
        let content = fields.content;
        let info = {
            username: username,
            content: content,
        }

        let returnResult = {};
        DB.addShuoShuo(info, (err, result) => {
            if (err) {
                res.send(err, null);
                return;
            }

            res.send(result);
        });
    });

});

app.get("/zone", (req, res) => {
    console.log(req.session.userid);
    let userid = req.session.userid;
    DB.getShuoList("heh", (err, data) => {
        if (err) {
            res.render("zone", {
                data: [{
                    username: "hah",
                    content: "这是内容啊"
                }]
            });

            return;
        }

        console.log(data);

        res.render("zone", {
            data: data.allShuoShuo,
            users: data.allUser,
        });


    });

});




app.listen(8888);