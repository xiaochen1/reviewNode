const fs = require("fs");
const formidable = require("formidable");
const sd = require("silly-datetime");
const path = require("path");
const url = require("url");



exports.getAllAlbums = getAllAlbums; // 获取static下所有的相册名（文件夹名）
exports.getAlbumsByAlbumName = getAlbumsByAlbumName; // 根据相册名（文件夹名），获取该相册下所有的图片
exports.getAllAlbumDirs = getAllAlbumDirs; // 获取upload下所有的文件夹
exports.uploadFile = uploadFile; // 向upload文件夹上传文件

function getAllAlbums(cb) {
    let allAblums = [];
    fs.readdir("./static", (err, files) => {
        if (err) {
            cb("找不到该static文件夹", null);
            return;
        }
        (function Iterator(i) {
            if (i >= files.length) {
                console.log("已搜索到最后一个文件; 目前搜索到的文件夹如下：");
                console.log(allAblums);
                cb(null, allAblums)
                return;
            }

            fs.stat("./static/" + files[i], (err, stats) => {
                if (err) {
                    cb("找不到文件" + files[i], null);
                    return;
                }

                if (stats.isDirectory()) {
                    allAblums.push(files[i]);
                }
                Iterator(i + 1);
            });

        })(0);
    });
}


function getAlbumsByAlbumName(name, cb) {
    let images = [];
    fs.readdir("static/" + name, (err, files) => {
        if (err) {
            cb(err, null);
            return err;
        }

        (function Iterator(i) {
            if (i >= files.length) {
                console.log(images);
                cb(null, images);
                return;
            }

            fs.stat("static/" + name + "/" + files[i], (err, stats) => {
                console.log("static/" + name + "/" + files[i]);
                if (err) {
                    return;
                }

                if (stats.isFile()) {
                    console.log(path.parse(files[i]));
                    if ([".jpg", ".png"].indexOf(path.parse(files[i]).ext) > -1) {
                        images.push(files[i]);
                    }
                }

                Iterator(i + 1);

            });

        })(0);
    })
}

function getAllAlbumDirs(cb) {
    fs.readdir("./upload", (err, files) => {
        let data = [];
        if (err) {
            cb(err, null);
            return;
        }
        if (files.length > 0) {
            (function Iterator(i) {
                if (i == files.length) {
                    cb(null, data);
                }

                fs.stat("./upload" + "/" + files[i], (err, stats) => {
                    if (err) { return; }

                    if (stats.isDirectory()) {
                        data.push(files[i]);
                    }
                    Iterator(i + 1);
                });
            })(0);
            return;
        }
        cb("暂无文件夹", null);
    });
}


function uploadFile(req, cb) {

    let form = new formidable.IncomingForm();
    form.uploadDir = __dirname + "/../tempUploadDir";

    form.parse(req, (err, fields, files) => {
        if (err) { return; }

        let targetDir = fields.updir;
        let oldpath = files.imgfile.path;
        let time = sd.format(new Date(), "YYYYMMDDHHmmss");
        let rand = Math.floor(Math.random() * 100000 + 900000);
        let extname = path.parse(files.imgfile.name).ext;
        console.log(targetDir);
        console.log(files.imgfile);
        console.log(extname);

        let newpath = path.resolve(__dirname + "/../upload/" + targetDir + "/" + time + "_" + rand + extname);
        console.log(oldpath);
        console.log(newpath);

        fs.rename(oldpath, newpath, (err) => {
            if (err) {
                console.log(err);
                console.log("改名失败");
                return;
            }
            console.log("改名成功");
            console.log("上传后的文件名为：-->" + newpath);
            cb(null, null);
        });




    });
}

// function getAllAlbums() {
//     let allAblums = [];
//     fs.readdir("./static", (err, files) => {
//         if (err) { return; }

//         (function Iterator(i) {
//             if (i >= files.length) {
//                 console.log("已搜索到最后一个文件; 目前搜索到的文件夹如下：");
//                 console.log(allAblums);
//                 return;
//             }

//             fs.stat("./static/" + files[i], (err, stats) => {
//                 if (err) { return; }

//                 if (stats.isDirectory()) {
//                     allAblums.push(files[i]);
//                 }

//                 Iterator(i + 1);

//             });

//         })(0);
//     });

//     console.log(allAblums);
//     return allAblums;
// }