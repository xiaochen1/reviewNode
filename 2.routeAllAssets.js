const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const mime = require("mime");


const { publicDir } = require("./config");
// const publicDir = "/static/";

let app = http.createServer((req, res) => {

    if (req.url == "/favicon.ico") { return; }
    let urlObj = path.parse(url.parse(req.url, true).pathname); // "pathname":"/img/2.png",
    //urlObj  --->   { root: '/', dir: '/img', base: '2.png', ext: '.png', name: '2' }

    let dir = urlObj.dir;
    let filename = url.parse(req.url, true).pathname;
    let extname = urlObj.ext;

    // res.write("请求路径" + dir + "; 请求文件为" + filename + "; 文件拓展名为：" + extname);

    let contentType = mime.getType(extname);

    fs.readFile(path.resolve(__dirname + publicDir + filename), (err, data) => {
        if (err) { throw err; }
        console.log(contentType);
        console.log(path.resolve(__dirname + publicDir + filename));
        res.writeHead(200, { "content-type": contentType + ";charset=utf8" });
        res.end(data);
        return;
    });

});

app.listen(8888, "localhost");
console.log("listening on localhost:8888");