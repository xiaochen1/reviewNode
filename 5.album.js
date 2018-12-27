const express = require("express")
const route = require("./controller");

let app = express();

app.use(express.static("./static"));
app.use(express.static("./upload"));
app.set("view engine", "ejs");
app.get("/", route.showIndex);
app.get("/up", route.up);
app.post("/upload", route.upload);
app.get("/:albumname", route.showAlbum);
app.listen(8888);



console.log("listening on localhost:8888");