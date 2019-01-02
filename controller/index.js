const file = require("../model");
module.exports.showIndex = showIndex;
module.exports.showAlbum = showAlbum;
module.exports.up = up;
module.exports.upload = upload;

module.exports.dologin = dologin;

function showIndex(req, res) {
    file.getAllAlbums(function(err, data) {
        if (err) {
            res.send(err);
            return;
        }
        res.render("albumindex", {
            data: data
        });
    });
}



function showAlbum(req, res) {
    let albumName = req.params.albumname;
    console.log(albumName);
    file.getAlbumsByAlbumName(albumName, function(err, data) {
        if (err) {
            res.send(err);
            return;
        }
        res.render("album", {
            albumname: albumName,
            images: data
        });
    });
}



function up(req, res) {
    file.getAllAlbumDirs((err, data) => {
        if (err) {
            res.render(err);
            return;
        }
        res.render("up", {
            data: data
        });
    });

}


function upload(req, res) {
    file.uploadFile(req, (err, data) => {
        if (err) {
            res.render(err);
            return;
        }
        res.send("上传成功");
    });

}



//错误的方式
// function showIndex(req, res) {
//     res.render("album", {
//         // data: [] // 
//         data: file.getAllAlbums()
//     });
// }

function dologin(req, res) {
    // file.login(req, res);
}