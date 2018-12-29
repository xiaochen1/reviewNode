const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dburl = "mongodb://localhost:27017";
const dbName = "reviewNode";

exports._connect = _connect;
exports.getDocumentsByColName = getDocumentsByColName;

//数据库连接
function _connect(dbname, cb) {

    let client = new MongoClient(dburl, { useNewUrlParser: true });

    client.connect((err) => {
        // assert.equal(null, err);
        const db = client.db(dbname);
        console.log("client------->");
        console.log(client);
        console.log("db------->");

        console.log(db);
        console.log("client内容到此结束");
        cb(err, db, client);
    });


    // MongoClient.connect(dburl, { useNewUrlParser: true }, (err, client) => {
    //     if (!assert.equal(null, err)) {
    //         cb(err, null);
    //         return ;
    //     }

    //     console.log("Connected successfully to server, current mongo server on " + dburl);
    //     console.log("dbname---->"+dbname);
    //     let db = client.db(dbname);
    //     cb(null, db);
    //     console.log(db);
    //     // client.close();
    // });
}


//根据集合名称获取集合数据
function getDocumentsByColName(dbname, colname, option = {}, callback) {
    _connect(dbname, (err, db, client) => {
        // if(!assert.equal(null, err)) {
        //     callback(err, null);
        //     client.close();
        //     console.log("失败");
        //     return;
        // }
        assert.equal(err, null);
        console.log("getDocumentsByColName-------");
        console.log(db);
        console.log(client);
        assert.equal(null, err);
        let res = [];
        console.log("根据集合名称获取集合中的数据");
        console.log(dbname, colname);
        const collection = db.collection(colname);
        console.log(collection);
        // collection.find(option).toArray((err, docs) => {
        //     assert.equal(null, err);
        //     callback(null, docs);
        //     client.close();
        // });

        collection.find({}).limit(3).skip(2).toArray((err, docs) => {
            assert.equal(null, err);
            callback(null, docs);
            client.close();
        });
    });
}