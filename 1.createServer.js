const http = require("http");
const url = require("url");
const path = require("path");



var app = http.createServer(function(req, res) {
    if (req.url == "/favicon.ico") { return }
    console.log(req.url);

    // http://localhost:8888/img/2.png?name=xiao&age=1

    //  请求参数获取
    let urlObj = url.parse(req.url, true); // 

    // {
    //     "protocol":null,
    //     "slashes":null,
    //     "auth":null,
    //     "host":null,
    //     "port":null,
    //     "hostname":null,
    //     "hash":null,
    //     "search":"?name=xiao&age=1",
    //     "query":{
    //         "name":"xiao",
    //         "age":"1"
    //     },
    //     "pathname":"/img/2.png",
    //     "path":"/img/2.png?name=xiao&age=1",
    //     "href":"/img/2.png?name=xiao&age=1"
    // }


    let queryObj = url.parse(req.url, true).query; // { name: 'xiao', age: '1' }

    // 请求文件相关信息获取
    let pathObj = path.parse(url.parse(req.url).pathname); //     /img/2.png
    //{ root: '/', dir: '/img', base: '2.png', ext: '.png', name: '2' }

    console.log(urlObj);
    console.log(queryObj); // { name: 'xiao', age: '1' }
    console.log(pathObj);

    res.writeHead(200, { "content-type": "text/plain; charset=utf8" });
    res.end(JSON.stringify(urlObj));
});


app.listen(8888, "localhost");
console.log("listening localhost:80");