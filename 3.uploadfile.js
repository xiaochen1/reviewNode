const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const util = require("util");

const mime = require("mime");
const formidable = require("formidable");
const sd = require("silly-datetime");

const publicDir = "/static/";

let app = http.createServer((req, res) => {
    if (req.url == "/favicon.ico") { return; }

    let pathname = url.parse(req.url).pathname;

    if (req.url == "/") {
        pathname = "index.html"
    }

    let extname = path.parse(pathname).ext;
    let contentType = mime.getType(extname);

    fs.readFile(__dirname + "/static/" + pathname, (err, data) => {
        if (err) { throw err }

        console.log(path.resolve(__dirname + "/static/" + pathname + "文件读取成功"));

        res.writeHead(200, { "content-type": contentType + "; charset=utf8" });
        res.end(data);
    });

    if (req.url == "/upload") {
        console.log("接受文件上传");

        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) { throw err }

            // util.inspect({ fields: fields, files: files });
            // return;
            if (files.avatar) {
                let filename = files.avatar.name; // 2.png
                fs.readFile(files.avatar.path, (err, data) => {
                    if (err) { throw err }

                    fs.writeFile(__dirname + "/upload/" + filename, data, (err) => {
                        if (err) {
                            console.log("文件创建失败");
                            throw err;
                        }
                        console.log("文件上传成功");

                        let time = sd.format(new Date(), "YYYYMMDDHHmmss");
                        let rand = Math.floor(Math.random() * 100000 + 900000);
                        let extname = path.parse(files.avatar.name).ext;
                        let oldpath = __dirname + "/upload/" + filename;
                        let newpath = __dirname + "/upload/" + time + rand + extname;
                        fs.rename(oldpath, newpath, (err) => {
                            if (err) {
                                console.log("改名失败");
                                throw err
                            }
                            console.log("改名成功");
                        });

                        res.writeHead(200, { "content-type": contentType + "; charset=utf8" });

                        res.write(JSON.stringify(fields));
                        res.write(JSON.stringify(files));
                        res.end();
                        return;
                    });

                });
            }
        });
        //   localhost:8888/img/2.png?name=xiao&age=10
        // console.log(req.url); //    /img/bb/2.png?name=xiao&age=10
        // console.log(url.parse(req.url, true)); // 
        // {
        //     protocol: null,
        //     slashes: null,
        //     auth: null,
        //     host: null,
        //     port: null,
        //     hostname: null,
        //     hash: null,
        //     search: '?name=xiao&age=10',
        //     query: { name: 'xiao', age: '10' },
        //     pathname: '/img/bb/cc/2.png',
        //     path: '/img/bb/cc/2.png?name=xiao&age=10',
        //     href: '/img/bb/cc/2.png?name=xiao&age=10' 
        // }  

        // console.log(path.parse(url.parse(req.url, true).pathname));
        // // { root: '/', dir: '/img/bb/cc', base: '2.png', ext: '.png', name: '2' }

        // let pathname = url.parse(req.url, true).pathname; console.log(__dirname + pathname);

        // let pathObj = path.parse(pathname);

        // let dir = pathObj.dir;
        // let extname = pathObj.ext;

        // console.log(dir); //     /img/bb/cc
        // console.log(extname); //     .png

    }

});

app.listen(8888, "localhost");
console.log("listening on localhost:8888");