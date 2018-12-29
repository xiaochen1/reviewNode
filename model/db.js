const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dburl = "mongodb://localhost:27017";
const dbName = "reviewNode";


exports._connect = _connect;
exports.getDocumentsByColName = getDocumentsByColName;
exports.addUser = addUser; // 添加用户

//数据库连接
/**
 * 
 * @param {*数据库名称*} dbname 
 * @param {*回调函数*} cb 
 */
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
/**
 * 
 * @param {数据库名称} dbname 
 * @param {集合名称} colname 
 * @param {查询时条件} option 
 * @param {回调函数} callback 
 */
function getDocumentsByColName(dbname, colname, option = {}, opquery = { page_size: 10, page_index: 1 }, callback) {
    _connect(dbname, (err, db, client) => {

        assert.equal(err, null);
        console.log("getDocumentsByColName-------");
        console.log(db);
        console.log(client);
        assert.equal(null, err);
        console.log("根据集合名称获取集合中的数据");
        console.log(dbname, colname);
        const collection = db.collection(colname);
        console.log(collection);

        let result = {
            code: 500,
            msg: "",
            page_index: opquery.page_index || 1,
            page_size: opquery.page_size || 10,
            total_records: 0,
            total_pages: 0,
            data: []
        };

        let cursor = collection.find(option);

        cursor.limit(result.page_size).skip((opquery.page_index - 1) * opquery.page_size).toArray((err, docs) => {
            assert.equal(err, null);
            cursor.count(false, {}, (err, count) => {
                assert.equal(err, null);
                result.code = 200;
                result.msg = "查询成功";
                result.total_records = count;
                result.total_pages = Math.ceil(count / result.page_size);
                result.data = docs;

                callback(null, result);
                client.close();

            });
        });

        // cursor.count(true, { limit: opquery.page_size, skip: (opquery.page_index - 1) * opquery.page_size }, (err, count) => {
        //     assert.equal(err, null);

        //     cursor.toArray((err, docs) => {
        //         assert.equal(err, null);
        //         result.data = docs;
        //         result.page_index = opquery.page_index || result.page_index;
        //         result.page_size = opquery.page_size || result.page_size;
        //         result.total_pages = Math.ceil(docs.length / result.page_size);
        //         result.total_records = count;

        //         callback(null, result);
        //         client.close();
        //     });
        // })

        // collection.find({}).limit(3).skip(2).toArray((err, docs) => {
        //     assert.equal(null, err);
        //     let result = {};
        //     callback(null, docs);
        //     client.close();
        // });
    });
}

//------ 用户（user）  相关操作-----------------------------------------------------

// 增
function addUser(info, cb) {
    _connect(dbName, (err, db, client) => {
        assert.equal(err, null);
        let user_coll = db.collection("user");
        user_coll.insertOne(info, {}, (err, result) => {
            console.log(assert.equal(err, null));
            console.log(result);
            cb(null, result);
            client.close();
        });
    });
}




// 查
function getUserInfo(info, cb) {

}



/**
 * 
 * @param  info  用户信息
 */
function register(info) {
    _connect();
}