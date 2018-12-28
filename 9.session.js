const express = require("express");
const session = require("express-session");

let app = express();
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.get("/", (req, res) => {
    if (req.session.islogin == 1) {
        req.session.time++;
        console.log(req.session.time);
        res.send("已经登录， 访问了 " + req.session.time + "次");
    } else {
        req.session.islogin = 1;
        req.session.time = 1;
        res.send("未登录");
    }

});

app.listen(8888);
console.log("listening on 8888");