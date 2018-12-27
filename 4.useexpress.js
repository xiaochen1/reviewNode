let express = require("express");


let app = express();

// app.set("view engine", "ejs");
app.set("view engine", "jade");

//  静态服务
//将当前static文件夹下的所有文件  路由出来 ，供访问；  
app.use(express.static("./static"));

app.use("/", (req, res, next) => {
    console.log("use 中间件");
    next();
});



//------------------路由-------------------------------------------------------------
app.get("/", (req, res) => {
    // res.send("Hello World! 根路由 /");
    console.log("根路由");
    console.log(req.query); // { name: 'xiao', age: '10' }
    res.render("index");
});

app.get("/student", (req, res) => {
    console.log("/student");
    res.send("Hello Student!");
});


app.get("/teacher", (req, res) => {
    console.log("/teacher");

    res.send("Hello Teacher!");
});

//------------------路由， 参数获取（get方法）-------------------------------------------------------------


app.get("/student/:stu_id", (req, res) => {
    console.log("/student/:stu_id");
    console.log(req.params);
    res.send("welcome student: " + req.params.stu_id);
});


app.get("/student/:stu_id/book/:book_id", (req, res) => {
    console.log("/student/:stu_id/book/:book_id");
    console.log(req.params);
    res.send("welcome student: " + req.params.stu_id + "; student: " + req.params.stu_id + "; & book_id :" + req.params.book_id);
}, (req, res) => {
    console.log("多个回调");
});


app.get("/student/:stu_id/book/:book_id", (req, res) => {
    console.log("/student/:stu_id/book/:book_id");
    console.log(req.params);
    res.send("welcome student: " + req.params.stu_id + "; student: " + req.params.stu_id + "; & book_id :" + req.params.book_id);
});

app.get("/ejs", (req, res) => {
    res.render("test", { data: "haha" });
});


app.use((req, res) => {
    res.send("404， not found");
});

//------------------路由-------------------------------------------------------------






//------------------路由-------------------------------------------------------------





//------------------路由-------------------------------------------------------------






//------------------路由-------------------------------------------------------------


app.listen(8888);
console.log("listening on localhost:8888");