const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dburl = "mongodb://localhost:27017";
const dbName = "reviewNode";

exports.connect = connect;
exports.getAllDocumentByColName = getAllDocumentByColName;

//数据库连接
function connect(dbname, cb) {
    MongoClient.connect(dburl, { useNewUrlParser: true }, (err, client) => {
        if (!assert.equal(null, err)) {
            cb(err, null);
        }

        console.log("Connected successfully to server");
        console.log(dbname);
        let db = client.db(dbname);
        cb(null, db);
        console.log(db);
        // client.close();
    });
}


//根据集合名称获取集合数据
function getDocumentsByColName(db, colname, option = {}, callback) {
    let result = [];
    result = db.collection(colname).find(option);
    callback(result);
}